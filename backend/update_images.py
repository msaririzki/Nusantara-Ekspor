"""
Skrip pembaruan gambar produk berdasarkan nama/kategori.
Jalankan dengan: python update_images.py

Skrip ini TIDAK menghapus data/user/produk apapun.
Ia hanya menambahkan/mengganti daftar gambar agar carousel bisa aktif.
"""

from database import SessionLocal
from models.product import Product
from sqlalchemy import select

# Peta nama produk -> daftar URL gambar (terverifikasi)
PRODUCT_IMAGES = {
    # Tembakau
    "tembakau": [
        "https://images.unsplash.com/photo-1589393922695-ef4d5ec6b532?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1567016526105-22da7c13161a?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1608613304899-ea8098577e38?w=600&auto=format&fit=crop",
    ],
    # Jagung
    "jagung": [
        "https://images.unsplash.com/photo-1601593346740-925612772716?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542838775-8f6f10c69a25?w=600&auto=format&fit=crop",
    ],
    # Beras
    "beras": [
        "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop",
    ],
    # Kopi
    "kopi": [
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop",
    ],
    # Gaharu / Kayu
    "gaharu": [
        "https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504204267155-aaad8e81290d?w=600&auto=format&fit=crop",
    ],
}

# Fallback per kategori jika nama tidak cocok
CATEGORY_IMAGES = {
    "Agrikultur": [
        "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop",
    ],
    "Perkebunan": [
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1592921870789-04563d55041c?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=600&auto=format&fit=crop",
    ],
    "Kehutanan": [
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=600&auto=format&fit=crop",
    ],
    "Hortikultura": [
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop",
    ],
}


def find_images_for_product(product):
    """Cari gambar berdasarkan nama produk dulu, lalu fallback ke kategori."""
    name_lower = product.name.lower()
    for keyword, images in PRODUCT_IMAGES.items():
        if keyword in name_lower:
            return images
    return CATEGORY_IMAGES.get(product.category, CATEGORY_IMAGES["Agrikultur"])


def update_product_images():
    print("🖼️  Memperbarui gambar produk...")
    updated = 0

    with SessionLocal() as session:
        products = session.execute(select(Product)).scalars().all()
        print(f"Ditemukan {len(products)} produk.")

        for product in products:
            new_images = find_images_for_product(product)

            # Pertahankan foto upload asli pengguna (bukan URL Unsplash) di depan
            original_custom = [
                img for img in (product.images or [])
                if img and not img.startswith("https://images.unsplash.com")
            ]
            if original_custom:
                merged = original_custom + new_images[:2]
            else:
                merged = new_images

            product.images = merged
            updated += 1
            print(f"  ✅ '{product.name}' ({product.category}) → {len(merged)} foto")

        session.commit()

    print(f"\n🎉 Selesai! {updated} produk diperbarui dengan foto carousel baru.")


if __name__ == "__main__":
    update_product_images()
