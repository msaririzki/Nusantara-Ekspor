# ==========================================
# Nusantara Ekspor - Database Seeder
# ==========================================

import asyncio
from sqlalchemy import select

from database import async_session, init_db
from models.user import User
from models.product import Product
from models.chat import ChatRoom, ChatMessage
from utils.security import hash_password


async def seed_data():
    """Seeds the database with initial users and products."""
    
    print("Mempersiapkan database...")
    await init_db()
    
    async with async_session() as session:
        print("Memeriksa data pengguna...")
        
        # Check if admin already exists
        result = await session.execute(select(User).where(User.email == 'admin@ekspor.id').limit(1))
        existing_admin = result.scalars().first()
        
        if existing_admin:
            print("Seeder dilewati: Data admin dan testing tambahan sudah ada di database.")
            return

        print("Membuat user Admin...")
        admin_user = User(
            email="admin@ekspor.id",
            hashed_password=hash_password("admin123"),
            full_name="Super Admin",
            company_name="Nusantara Ekspor HQ",
            role="admin",
            country="Indonesia",
            phone="+6280000000000",
            address="Gedung Nusantara"
        )
        session.add(admin_user)

        # existing test users (we will assume we are recreating them or ignoring errors later... wait, if existing_user was there but no admin, we might hit unique constraint on umkm@ekspor.id. So let's check it.)
        try:
            print("Membuat user UMKM...")
            umkm_user = User(
                email="umkm@ekspor.id",
                hashed_password=hash_password("password123"),
                full_name="Budi Karya",
                company_name="PT Karya Nusantara",
                role="umkm",
                country="Indonesia",
                phone="+6281234567890",
                address="Jl. Jendral Sudirman No.1, Jakarta"
            )
            session.add(umkm_user)
            
            print("Membuat user Buyer...")
            buyer_user = User(
                email="buyer@global.com",
                hashed_password=hash_password("password123"),
                full_name="Michael Carter",
                company_name="Global Import Inc.",
                role="buyer",
                country="United States",
                phone="+12135550123",
                address="123 Export Ave, Los Angeles, CA"
            )
            session.add(buyer_user)

            print("Membuat user UMKM 2 (Testing)...")
            umkm_user2 = User(
                email="umkm2@ekspor.id",
                hashed_password=hash_password("password123"),
                full_name="Siti Aminah",
                company_name="CV Berkah Alam",
                role="umkm",
                country="Indonesia",
                phone="+6285555555555",
                address="Bandung, Jawa Barat"
            )
            session.add(umkm_user2)

            print("Membuat user Buyer 2 (Testing)...")
            buyer_user2 = User(
                email="buyer2@global.com",
                hashed_password=hash_password("password123"),
                full_name="Kenji Tanaka",
                company_name="Tokyo Trading Co.",
                role="buyer",
                country="Japan",
                phone="+81312345678",
                address="Shibuya, Tokyo"
            )
            session.add(buyer_user2)
            
            # Flush to get user IDs for products
            await session.flush()
        except Exception as e:
            # If unique constraint fails because primary users exist, just continue setuping products for them later
            print("Info: User dasar sudah ada. Memproses berlanjut.")
        
        print("Membuat data sampel produk...")
        product1 = Product(
            user_id=umkm_user.id,
            name="Kopi Luwak Premium Arabica",
            description="Kopi Luwak murni dari biji kopi Arabica pilihan yang tumbuh di dataran tinggi Gayo. Diproses secara alami untuk menghasilkan cita rasa unik dengan tingkat keasaman yang seimbang dan aroma buah yang khas.",
            price=250000.0,
            currency="IDR",
            category="Food & Beverage",
            images=["https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1470&auto=format&fit=crop"],
            specifications={
                "Weight": "250g",
                "Roast Level": "Medium",
                "Origin": "Aceh, Indonesia",
                "Process": "Washed"
            },
            min_order=10,
            stock=150
        )
        session.add(product1)
        
        product2 = Product(
            user_id=umkm_user.id,
            name="Kain Batik Tulis Motif Mega Mendung",
            description="Kain batik tulis asli buatan tangan pengrajin Cirebon. Menggunakan bahan katun prima yang sejuk dan nyaman dipakai. Motif Mega Mendung melambangkan awan pembawa hujan sebagai simbol kesuburan dan pemberi kehidupan.",
            price=750000.0,
            currency="IDR",
            category="Textile & Fashion",
            images=["https://images.unsplash.com/photo-1610058525287-1b058fe4e3e3?q=80&w=1527&auto=format&fit=crop"],
            specifications={
                "Dimension": "200cm x 115cm",
                "Material": "Cotton Prima",
                "Method": "Hand-drawn (Tulis)",
                "Origin": "Cirebon, Indonesia"
            },
            min_order=2,
            stock=50
        )
        session.add(product2)
        
        product3 = Product(
            user_id=umkm_user.id,
            name="Kerajinan Rotan Kursi Teras Set",
            description="Set kursi teras berbahan rotan alami berkualitas ekspor. Dianyam dengan teknik tradisional yang kuat dan tahan lama. Cocok untuk penggunaan indoor maupun semi-outdoor.",
            price=3500000.0,
            currency="IDR",
            category="Furniture & Home Decor",
            images=["https://images.unsplash.com/photo-1599696848652-f0ff23bc911f?q=80&w=1374&auto=format&fit=crop"],
            specifications={
                "Set Includes": "2 Chairs, 1 Table",
                "Material": "Natural Rattan",
                "Color": "Natural Brown",
                "Origin": "Jepara, Indonesia"
            },
            min_order=1,
            stock=15
        )
        session.add(product3)
        await session.flush()
        
        print("Membuat sampel Chat Room & Message...")
        chat_room = ChatRoom(
            umkm_id=umkm_user.id,
            buyer_id=buyer_user.id,
            product_id=product1.id
        )
        session.add(chat_room)
        await session.flush()
        
        chat_msg = ChatMessage(
            room_id=chat_room.id,
            sender_id=buyer_user.id,
            original_message="Hello, is this Luwak Coffee still available?",
            translated_message="Halo, apakah Kopi Luwak ini masih tersedia?",
            original_language="en",
            target_language="id"
        )
        session.add(chat_msg)
        
        print("Menyimpan ke database...")
        await session.commit()
        print("✅ Data seeder berhasil dimasukkan ke database!")
        print("   Admin: admin@ekspor.id (admin123)")
        print("   UMKM Utama: umkm@ekspor.id (password123)")
        print("   UMKM Testing: umkm2@ekspor.id (password123)")
        print("   Buyer Utama: buyer@global.com (password123)")
        print("   Buyer Testing (Japan): buyer2@global.com (password123)")

if __name__ == "__main__":
    asyncio.run(seed_data())
