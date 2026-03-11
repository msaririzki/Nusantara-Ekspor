# ==========================================
# Nusantara Ekspor - Products Router
# ==========================================

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_

from database import get_db
from models.user import User
from models.product import Product
from schemas.product import ProductCreate, ProductUpdate, ProductResponse
from utils.dependencies import get_current_user

router = APIRouter(prefix="/api/products", tags=["Products"])


@router.get("", response_model=list[ProductResponse])
async def list_products(
    query: str | None = Query(None, description="Search query"),
    category: str | None = Query(None, description="Filter by category"),
    min_price: float | None = Query(None, ge=0),
    max_price: float | None = Query(None, ge=0),
    sort_by: str = Query("newest", regex="^(newest|price-low|price-high)$"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List all active products with search, filter, and sorting."""
    stmt = select(Product).where(Product.is_active == True)

    # Search
    if query:
        stmt = stmt.where(
            or_(
                Product.name.ilike(f"%{query}%"),
                Product.description.ilike(f"%{query}%"),
            )
        )

    # Category filter
    if category:
        stmt = stmt.where(Product.category == category)

    # Price range
    if min_price is not None:
        stmt = stmt.where(Product.price >= min_price)
    if max_price is not None:
        stmt = stmt.where(Product.price <= max_price)

    # Sorting
    if sort_by == "price-low":
        stmt = stmt.order_by(Product.price.asc())
    elif sort_by == "price-high":
        stmt = stmt.order_by(Product.price.desc())
    else:
        stmt = stmt.order_by(Product.created_at.desc())

    # Pagination
    offset = (page - 1) * per_page
    stmt = stmt.offset(offset).limit(per_page)

    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str, db: AsyncSession = Depends(get_db)):
    """Get a single product by ID."""
    result = await db.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produk tidak ditemukan",
        )

    return product


@router.post("", response_model=ProductResponse, status_code=201)
async def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new product (UMKM only)."""
    if current_user.role != "umkm":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hanya akun UMKM yang bisa menambahkan produk",
        )

    product = Product(
        user_id=current_user.id,
        name=product_data.name,
        description=product_data.description,
        price=product_data.price,
        currency=product_data.currency,
        category=product_data.category,
        images=product_data.images,
        specifications=product_data.specifications,
        min_order=product_data.min_order,
        stock=product_data.stock,
    )

    db.add(product)
    await db.flush()
    await db.refresh(product)
    return product


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a product (owner only)."""
    result = await db.execute(
        select(Product).where(Product.id == product_id, Product.user_id == current_user.id)
    )
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produk tidak ditemukan atau Anda bukan pemiliknya",
        )

    update_data = product_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)

    await db.flush()
    await db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=204)
async def delete_product(
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a product (owner only)."""
    result = await db.execute(
        select(Product).where(Product.id == product_id, Product.user_id == current_user.id)
    )
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produk tidak ditemukan atau Anda bukan pemiliknya",
        )

    await db.delete(product)
