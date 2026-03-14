"""
Skrip pembaruan gambar produk berdasarkan kategori.
Jalankan dengan: python update_images.py

Skrip ini TIDAK menghapus data/user/produk apapun.
Ia hanya menambahkan/mengganti daftar gambar agar carousel bisa aktif.
"""

from database import SessionLocal
from models.product import Product
from sqlalchemy import select

# Peta kategori -> daftar URL gambar dari Unsplash
CATEGORY_IMAGES = {
    "Agrikultur": [
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=600&auto=format&fit=crop",
    ],
    "Perkebunan": [
        "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1493857671505-72967e2e2760?q=80&w=600&auto=format&fit=crop",
    ],
    "Kehutanan": [
        "https://images.unsplash.com/photo-1517409419159-873b22baf7b7?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542838775-8f6f10c69a25?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop",
    ],
    "Hortikultura": [
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=600&auto=format&fit=crop",
    ],
}

def update_product_images():
    print("Memperbarui gambar produk...")
    updated = 0

    with SessionLocal() as session:
        products = session.execute(select(Product)).scalars().all()
        print(f"Ditemukan {len(products)} produk.")

        for product in products:
            # Hanya perbarui jika produk hanya punya 1 gambar (gambar lama)
            if product.images and len(product.images) >= 2:
                print(f"  [skip] '{product.name}' sudah punya {len(product.images)} foto.")
                continue

            # Cari gambar berdasarkan kategori
            new_images = CATEGORY_IMAGES.get(product.category)
            if not new_images:
                print(f"  [skip] '{product.name}' kategori '{product.category}' tidak ada pemetaan gambar.")
                continue

            # Pertahankan foto asli pengguna sebagai foto pertama jika ada
            original = product.images[0] if product.images else None
            if original and not original.startswith("https://images.unsplash.com"):
                # Foto asli upload pengguna - taruh di depan, tambah unsplash sebagai bonus
                merged = [original] + new_images[:2]
            else:
                merged = new_images

            product.images = merged
            updated += 1
            print(f"  ✅ '{product.name}' ({product.category}) → {len(merged)} foto")

        session.commit()

    print(f"\nSelesai! {updated} produk diperbarui dengan beberapa gambar.")

if __name__ == "__main__":
    update_product_images()
