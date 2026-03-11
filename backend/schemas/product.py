# ==========================================
# Nusantara Ekspor - Product Schemas (Pydantic)
# ==========================================

from datetime import datetime
from pydantic import BaseModel


class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    currency: str = "IDR"
    category: str
    images: list[str] = []
    specifications: dict[str, str] = {}
    min_order: int = 1
    stock: int = 0


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    category: str | None = None
    images: list[str] | None = None
    specifications: dict[str, str] | None = None
    min_order: int | None = None
    stock: int | None = None
    is_active: bool | None = None


class ProductResponse(ProductBase):
    id: str
    user_id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProductSearchParams(BaseModel):
    query: str | None = None
    category: str | None = None
    min_price: float | None = None
    max_price: float | None = None
    sort_by: str = "newest"  # newest, price-low, price-high
    page: int = 1
    per_page: int = 20
