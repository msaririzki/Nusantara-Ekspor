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
        
        # Mendapatkan atau Membuat User UMKM untuk dipakai Produk
        result = await session.execute(select(User).where(User.email == 'umkm@ekspor.id'))
        umkm_user = result.scalars().first()
        if not umkm_user:
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
            await session.flush()
        
        # Ekstra buyer untuk testing chat (jika perlu)
        result_buyer = await session.execute(select(User).where(User.email == 'buyer@global.com'))
        buyer_user = result_buyer.scalars().first()
        if not buyer_user:
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
            await session.flush()
            
        print("Info: User disiapkan. Memproses produk...")
        
        print("Membuat data sampel produk...")
        product1 = Product(
            user_id=umkm_user.id,
            name="Organik Beras Pandan Wangi",
            description="Beras organik pilihan dari pertanian lereng gunung berapi. Tumbuh tanpa pestisida kimia untuk menjamin kualitas keluarga Anda.",
            price=25000.0,
            currency="IDR",
            category="Agrikultur",
            images=["https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop"],
            specifications={
                "Weight": "1kg",
                "Origin": "Jawa Tengah, Indonesia",
                "Certification": "Organic Inofice"
            },
            min_order=100,
            stock=5000
        )
        session.add(product1)
        
        product2 = Product(
            user_id=umkm_user.id,
            name="Biji Kopi Arabika Gayo Grade 1",
            description="Biji kopi hijau (green bean) Arabika murni dari dataran tinggi Gayo. Diproses natural.",
            price=120000.0,
            currency="IDR",
            category="Perkebunan",
            images=["https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop"],
            specifications={
                "Weight": "1kg",
                "Variety": "Arabica",
                "Process": "Natural",
                "Origin": "Aceh, Indonesia"
            },
            min_order=50,
            stock=1000
        )
        session.add(product2)
        
        product3 = Product(
            user_id=umkm_user.id,
            name="Kayu Gaharu Super Asli",
            description="Kayu gaharu (agarwood) kualitas super dari hutan alam Kalimantan. Menghasilkan aroma terapi premium.",
            price=15000000.0,
            currency="IDR",
            category="Kehutanan",
            images=["https://images.unsplash.com/photo-1517409419159-873b22baf7b7?q=80&w=600&auto=format&fit=crop"],
            specifications={
                "Grade": "Super AAA",
                "Origin": "Kalimantan Barat, Indonesia",
                "Certification": "CITES"
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
