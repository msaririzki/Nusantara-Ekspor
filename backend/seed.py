# ==========================================
# Nusantara Ekspor - Database Seeder (Realistis NTB & Indonesia)
# ==========================================

from sqlalchemy import text

from database import SessionLocal, init_db
from models.user import User
from models.product import Product
from models.chat import ChatRoom, ChatMessage
from utils.security import hash_password


def clear_database(session):
    """Hapus semua data dari database (urutan terbalik untuk FK)."""
    print("🗑️  Membersihkan database...")
    session.execute(text("DELETE FROM chat_messages"))
    session.execute(text("DELETE FROM chat_rooms"))
    session.execute(text("DELETE FROM products"))
    session.execute(text("DELETE FROM users"))
    session.commit()
    print("✅ Database berhasil dikosongkan.\n")


def seed_data():
    """Seeds database dengan data realistis: UMKM NTB + Buyer Arab."""

    print("🌱 Mempersiapkan database...")
    init_db()

    with SessionLocal() as session:

        # ──────────────────────────────────────────────
        # CLEAR DATABASE DULU
        # ──────────────────────────────────────────────
        clear_database(session)

        # ──────────────────────────────────────────────
        # USERS: BUYER IMPORTIR
        # ──────────────────────────────────────────────
        print("👤 Membuat akun Buyer / Importir...")

        buyer_arab = User(
            email="ArabianCompany@gmail.com",
            hashed_password=hash_password("111111"),
            full_name="Khalid Al-Rashidi",
            company_name="Al-Rashidi Trading Co.",
            role="buyer",
            country="Saudi Arabia",
            phone="+966501234567",
            address="King Fahd Rd, Riyadh, Saudi Arabia"
        )
        session.add(buyer_arab)

        buyer_malaysia = User(
            email="MalaysiaImport@gmail.com",
            hashed_password=hash_password("111111"),
            full_name="Ahmad Faizal bin Yusof",
            company_name="Faizal Global Trading Sdn. Bhd.",
            role="buyer",
            country="Malaysia",
            phone="+601112345678",
            address="Jalan Bukit Bintang, Kuala Lumpur, Malaysia"
        )
        session.add(buyer_malaysia)

        buyer_japan = User(
            email="TokyoFoodImport@gmail.com",
            hashed_password=hash_password("111111"),
            full_name="Hiroshi Tanaka",
            company_name="Tokyo Natural Foods Co., Ltd.",
            role="buyer",
            country="Japan",
            phone="+81312345678",
            address="Shibuya, Tokyo, Japan"
        )
        session.add(buyer_japan)

        session.flush()

        # ──────────────────────────────────────────────
        # USERS: UMKM
        # ──────────────────────────────────────────────
        print("🏭 Membuat akun UMKM...")

        # UMKM 1 — Penjual kemiri dari NTB (akun dari user)
        umkm_zaryel = User(
            email="zaryelkemiri@gmail.com",
            hashed_password=hash_password("111111"),
            full_name="Zaryel Hamdani",
            company_name="UD Kemiri Sumbawa Asli",
            role="umkm",
            country="Indonesia",
            phone="+6281353001234",
            address="Jl. Raya Sumbawa No. 12, Kabupaten Sumbawa, NTB"
        )
        session.add(umkm_zaryel)

        # UMKM 2 — Mutiara Lombok
        umkm_mutiara = User(
            email="mutiaralombok@gmail.com",
            hashed_password=hash_password("111111"),
            full_name="Baiq Nuri Rahayu",
            company_name="CV Mutiara Lombok Abadi",
            role="umkm",
            country="Indonesia",
            phone="+6281917654321",
            address="Jl. Pantai Senggigi No. 5, Lombok Barat, NTB"
        )
        session.add(umkm_mutiara)

        # UMKM 3 — Madu Sumbawa
        umkm_madu = User(
            email="madusumbawa.asli@gmail.com",
            hashed_password=hash_password("111111"),
            full_name="H. Syamsuddin",
            company_name="UD Madu Hutan Sumbawa",
            role="umkm",
            country="Indonesia",
            phone="+6281234598765",
            address="Desa Batu Dulang, Kec. Moyo Hulu, Sumbawa, NTB"
        )
        session.add(umkm_madu)

        # UMKM 4 — Kopi Flores
        umkm_kopi = User(
            email="kopi.flores.ekspor@gmail.com",
            hashed_password=hash_password("111111"),
            full_name="Yohanes Dami Dopo",
            company_name="Koperasi Kopi Flores Bajawa",
            role="umkm",
            country="Indonesia",
            phone="+6281339887766",
            address="Desa Wologai, Kec. Detusoko, Ende, NTT"
        )
        session.add(umkm_kopi)

        session.flush()

        # ──────────────────────────────────────────────
        # PRODUCTS — ZARYEL (Kemiri Sumbawa)
        # ──────────────────────────────────────────────
        print("📦 Membuat produk UMKM...")

        prod_kemiri = Product(
            user_id=umkm_zaryel.id,
            name="Kemiri Sumbawa Premium Grade A",
            description=(
                "Kemiri asli Sumbawa yang terkenal dengan kandungan minyak alami tinggi. "
                "Diproses secara tradisional tanpa bahan kimia, dikeringkan di bawah sinar matahari langsung. "
                "Cocok untuk ekspor sebagai bahan baku kosmetik, minyak rambut, dan bumbu masakan."
            ),
            price=45000.0,
            currency="IDR",
            category="Agrikultur",
            images=[
                "https://images.unsplash.com/photo-1587049332298-1c42e83937a7?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
            ],
            specifications={
                "Weight": "1 kg",
                "Moisture": "≤ 12%",
                "Origin": "Sumbawa, NTB, Indonesia",
                "Packaging": "Karung goni 25kg / vakum 1kg",
                "Certifications": "Halal MUI",
            },
            min_order=50,
            stock=3000,
        )
        session.add(prod_kemiri)

        prod_kemiri_oil = Product(
            user_id=umkm_zaryel.id,
            name="Minyak Kemiri Murni Cold-Pressed",
            description=(
                "Minyak kemiri murni hasil cold-press tanpa bahan tambahan. "
                "Kaya asam lemak omega dan vitamin E alami. "
                "Diekspor ke Timur Tengah, Eropa, dan Asia sebagai bahan premium perawatan rambut."
            ),
            price=95000.0,
            currency="IDR",
            category="Kosmetik & Perawatan",
            images=[
                "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
            ],
            specifications={
                "Volume": "100ml / 250ml / 500ml",
                "Process": "Cold-pressed",
                "Origin": "Sumbawa, NTB",
                "Shelf life": "24 bulan",
                "Certification": "BPOM, Halal MUI",
            },
            min_order=24,
            stock=1500,
        )
        session.add(prod_kemiri_oil)

        # ──────────────────────────────────────────────
        # PRODUCTS — MUTIARA LOMBOK
        # ──────────────────────────────────────────────
        prod_mutiara = Product(
            user_id=umkm_mutiara.id,
            name="Mutiara Laut Selatan Lombok AAA",
            description=(
                "Mutiara laut selatan (South Sea Pearl) asli dari perairan Lombok. "
                "Warna putih susu hingga krem keemasan dengan kilauan tinggi. "
                "Sangat diminati pasar Timur Tengah, Eropa, dan Jepang sebagai perhiasan premium."
            ),
            price=1500000.0,
            currency="IDR",
            category="Perhiasan & Aksesoris",
            images=[
                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80",
            ],
            specifications={
                "Size": "9-13mm",
                "Shape": "Round / Semi-Round",
                "Luster": "Very High",
                "Origin": "Lombok, NTB, Indonesia",
                "Certification": "GIA certified upon request",
            },
            min_order=10,
            stock=500,
        )
        session.add(prod_mutiara)

        # ──────────────────────────────────────────────
        # PRODUCTS — MADU SUMBAWA
        # ──────────────────────────────────────────────
        prod_madu = Product(
            user_id=umkm_madu.id,
            name="Madu Hutan Sumbawa Murni Raw Honey",
            description=(
                "Madu hutan liar dari lebah Apis dorsata di hutan Sumbawa. "
                "Dipanen sekali setahun secara tradisional oleh masyarakat adat. "
                "Kandungan antioksidan sangat tinggi, tidak dipanaskan, tidak disaring. "
                "Ekspor ke pasar halal Timur Tengah dan Asia Tenggara."
            ),
            price=180000.0,
            currency="IDR",
            category="Produk Alam",
            images=[
                "https://images.unsplash.com/photo-1587049332298-1c42e83937a7?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80",
            ],
            specifications={
                "Volume": "500g / 1kg",
                "Type": "Raw, Unfiltered",
                "HMF": "< 40 mg/kg",
                "Water Content": "< 20%",
                "Origin": "Hutan Sumbawa, NTB",
                "Certification": "Halal MUI, SNI",
            },
            min_order=12,
            stock=800,
        )
        session.add(prod_madu)

        # ──────────────────────────────────────────────
        # PRODUCTS — KOPI FLORES
        # ──────────────────────────────────────────────
        prod_kopi = Product(
            user_id=umkm_kopi.id,
            name="Kopi Arabika Flores Bajawa Specialty Grade",
            description=(
                "Biji kopi arabika specialty dari pegunungan Bajawa, Flores. "
                "Ditanam di ketinggian 1400-1600 mdpl dengan proses washed. "
                "Profil rasa: coklat dark, brown sugar, bright acidity. "
                "Skor cupping 85+ oleh QC Internasional."
            ),
            price=165000.0,
            currency="IDR",
            category="Perkebunan",
            images=[
                "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&w=800&q=80",
            ],
            specifications={
                "Weight": "1 kg (green bean)",
                "Variety": "Arabica Typica",
                "Process": "Fully Washed",
                "Altitude": "1400-1600 mdpl",
                "Cup Score": "85+ SCA",
                "Origin": "Bajawa, Flores, NTT",
            },
            min_order=50,
            stock=2000,
        )
        session.add(prod_kopi)

        session.flush()

        # ──────────────────────────────────────────────
        # CHAT ROOM & MESSAGES — Arab x Zaryel (Kemiri)
        # ──────────────────────────────────────────────
        print("💬 Membuat percakapan chat realistis...")

        room1 = ChatRoom(
            umkm_id=umkm_zaryel.id,
            buyer_id=buyer_arab.id,
            product_id=prod_kemiri.id,
        )
        session.add(room1)
        session.flush()

        msgs_room1 = [
            # Buyer (Arab Saudi) menulis dalam bahasa ARAB → terjemahan ke Indonesia untuk UMKM
            dict(sender_id=buyer_arab.id,
                 original_message="السلام عليكم، وجدت منتجكم من جوز القنديل على منصة Nusra Ekspor. هل ما زال متاحاً للتصدير؟",
                 translated_message="Assalamu'alaikum, saya menemukan produk kemiri Anda di platform Nusra Ekspor. Apakah masih bisa untuk ekspor?",
                 original_language="ar", target_language="id"),

            dict(sender_id=umkm_zaryel.id,
                 original_message="Wa'alaikumsalam, Alhamdulillah masih tersedia Pak. Ini kemiri grade A langsung dari Sumbawa, NTB. Bapak dari negara mana ya?",
                 translated_message="وعليكم السلام، الحمد لله لا يزال متاحاً. هذه جوزة القنديل من الدرجة A مباشرة من سومباوا. من أي بلد أنتم؟",
                 original_language="id", target_language="ar"),

            dict(sender_id=buyer_arab.id,
                 original_message="أنا خالد الرشيدي من الرياض، المملكة العربية السعودية. نحن نبحث عن مورد لزيت جوزة القنديل لعلامتنا التجميلية.",
                 translated_message="Saya Khalid Al-Rashidi dari Riyadh, Arab Saudi. Kami sedang mencari pemasok minyak kemiri untuk brand kosmetik kami.",
                 original_language="ar", target_language="id"),

            dict(sender_id=umkm_zaryel.id,
                 original_message="Alhamdulillah, kami produksi minyak kemiri cold-pressed langsung dari kebun di Sumbawa. Grade A, sudah bersertifikat BPOM dan Halal MUI yang diakui di Arab Saudi.",
                 translated_message="الحمد لله، نحن ننتج زيت جوزة القنديل بالضغط البارد مباشرة من مزرعتنا. درجة A، معتمد BPOM وحلال MUI المعترف به في المملكة العربية السعودية.",
                 original_language="id", target_language="ar"),

            dict(sender_id=buyer_arab.id,
                 original_message="ممتاز! الشهادة الحلال ضرورية للسوق السعودي. ما هو الحد الأدنى للطلبية للزيت؟",
                 translated_message="Luar biasa! Sertifikat Halal sangat penting untuk pasar Arab Saudi. Berapa minimum order untuk minyaknya?",
                 original_language="ar", target_language="id"),

            dict(sender_id=umkm_zaryel.id,
                 original_message="Minimum order minyak kemiri 500ml adalah 24 botol (1 karton). Harga per botol Rp 95.000. Untuk biji kemiri kering minimum 50 kg @ Rp 45.000/kg. Harga bisa kami negosiasi untuk order besar.",
                 translated_message="الحد الأدنى للطلب لزيت جوزة القنديل 500 مل هو 24 زجاجة. سعر كل زجاجة 95,000 روبية. بذور جوزة القنديل الجاف بحد أدنى 50 كج. يمكن التفاوض على السعر للطلبيات الكبيرة.",
                 original_language="id", target_language="ar"),

            dict(sender_id=buyer_arab.id,
                 original_message="حسناً. هل يمكنكم إرسال عينات أولاً؟ نريد اختبار الجودة قبل تقديم طلب كبير.",
                 translated_message="Baik. Bisakah Anda kirim sampel terlebih dahulu? Kami ingin uji kualitas sebelum order besar.",
                 original_language="ar", target_language="id"),

            dict(sender_id=umkm_zaryel.id,
                 original_message="Bisa! Kami siap kirim sampel via DHL Express ke Riyadh, estimasi 5-7 hari kerja. Biaya pengiriman sampel ditanggung pembeli ya. Nanti kami siapkan: 2 botol minyak 250ml dan 500gr biji kemiri kering.",
                 translated_message="بالتأكيد! نحن مستعدون لإرسال عينات عبر DHL Express إلى الرياض، تقدير 5-7 أيام عمل. تكاليف الشحن على عاتق المشتري. سنجهز: زجاجتين 250 مل و500 جم بذور جافة.",
                 original_language="id", target_language="ar"),

            dict(sender_id=buyer_arab.id,
                 original_message="شكراً. سأرسل لكم عنوان الشحن. أيضاً، هل لديكم وثائق تصدير مثل SIUP و COO وشهادة الحلال؟",
                 translated_message="Terima kasih. Saya akan kirim alamat pengiriman. Apakah Anda punya dokumen ekspor seperti SIUP, COO, dan sertifikat Halal?",
                 original_language="ar", target_language="id"),

            dict(sender_id=umkm_zaryel.id,
                 original_message="Siap Pak! Kami punya SIUP, NIB, sertifikat Halal MUI, BPOM, dan bisa urus COO dari Dinas Perdagangan. Silakan kirim alamat lengkap. Insya Allah kami proses dalam 2 hari kerja!",
                 translated_message="حاضرون! لدينا SIUP و NIB وشهادة حلال MUI و BPOM، ويمكننا ترتيب COO من مكتب التجارة. فضلاً أرسل العنوان الكامل. إن شاء الله سنعالجخلال يومين عمليين!",
                 original_language="id", target_language="ar"),
        ]

        for m in msgs_room1:
            session.add(ChatMessage(room_id=room1.id, **m))

        # ──────────────────────────────────────────────
        # CHAT ROOM 2 — Malaysia x Mutiara Lombok
        # ──────────────────────────────────────────────
        room2 = ChatRoom(
            umkm_id=umkm_mutiara.id,
            buyer_id=buyer_malaysia.id,
            product_id=prod_mutiara.id,
        )
        session.add(room2)
        session.flush()

        msgs_room2 = [
            dict(sender_id=buyer_malaysia.id,
                 original_message="Assalamualaikum, saya berminat dengan mutiara Lombok anda. Boleh saya tahu harga per biji untuk saiz 10-11mm?",
                 translated_message="Assalamualaikum, saya tertarik dengan mutiara Lombok Anda. Boleh saya tahu harga per butir untuk ukuran 10-11mm?",
                 original_language="ms", target_language="id"),

            dict(sender_id=umkm_mutiara.id,
                 original_message="Wa'alaikumsalam Pak. Untuk mutiara ukuran 10-11mm bulat sempurna, harga per butir mulai Rp 1.500.000 tergantung luster dan grade. Ada juga semi-round yang lebih terjangkau.",
                 translated_message="Wa'alaikumsalam sir. For round perfect 10-11mm pearls, the price per piece starts from Rp 1,500,000 depending on luster and grade. There is also semi-round which is more affordable.",
                 original_language="id", target_language="ms"),

            dict(sender_id=buyer_malaysia.id,
                 original_message="Kami nak beli untuk dijadikan rantai dan subang. Kalau beli 50 biji, ada diskaun tak?",
                 translated_message="Kami ingin membeli untuk dijadikan kalung dan anting. Kalau beli 50 butir, ada diskon tidak?",
                 original_language="ms", target_language="id"),

            dict(sender_id=umkm_mutiara.id,
                 original_message="Untuk pembelian 50 butir ke atas, kami berikan diskon 10% dan gratis shipping ke Malaysia via Pos Laju internasional. Bisa juga kami siapkan certificate authenticity untuk setiap butir.",
                 translated_message="For purchases of 50 pieces and above, we give 10% discount and free shipping to Malaysia via international Pos Laju. We can also prepare a certificate of authenticity for each pearl.",
                 original_language="id", target_language="ms"),

            dict(sender_id=buyer_malaysia.id,
                 original_message="Bagus tu! Boleh hantar gambar mutiara yang ada sekarang? Saya nak tengok dulu kualiti dan warna.",
                 translated_message="Bagus itu! Bisa kirim foto mutiara yang ada sekarang? Saya mau lihat dulu kualitas dan warnanya.",
                 original_language="ms", target_language="id"),

            dict(sender_id=umkm_mutiara.id,
                 original_message="Bisa Bu/Pak, nanti saya foto dan kirim via WhatsApp atau email ya. Stok kami sekarang ada warna putih susu, cream, dan sedikit golden. Kalau berkenan bisa jadwalkan video call untuk lihat langsung.",
                 translated_message="Sure ma'am/sir, I'll take photos and send via WhatsApp or email. Our current stock has milky white, cream, and a few golden colors. If interested, we can schedule a video call to see them directly.",
                 original_language="id", target_language="ms"),
        ]

        for m in msgs_room2:
            session.add(ChatMessage(room_id=room2.id, **m))

        # ──────────────────────────────────────────────
        # CHAT ROOM 3 — Japan x Kopi Flores
        # ──────────────────────────────────────────────
        room3 = ChatRoom(
            umkm_id=umkm_kopi.id,
            buyer_id=buyer_japan.id,
            product_id=prod_kopi.id,
        )
        session.add(room3)
        session.flush()

        msgs_room3 = [
            # Buyer (Japan) menulis dalam bahasa JEPANG → terjemahan ke Indonesia untuk UMKM
            dict(sender_id=buyer_japan.id,
                 original_message="こんにちは。Nusra Eksporでフロレス・バジャワのアラビカコーヒーを見ました。東京のスペシャルティコーヒー輸入業者です。最新のカッピングスコアレポートを共有していただけますか？",
                 translated_message="Halo. Saya melihat kopi Arabika Flores Bajawa Anda di Nusra Ekspor. Kami adalah importir kopi specialty di Tokyo. Bisakah Anda berbagi cupping score report terbaru?",
                 original_language="ja", target_language="id"),

            dict(sender_id=umkm_kopi.id,
                 original_message="Halo Pak Hiroshi, terima kasih sudah tertarik dengan kopi Flores kami! Cupping score terakhir 86.25 SCA oleh Q-Grader bersertifikat, Januari 2025. Laporan lengkap bisa kami kirimkan.",
                 translated_message="田中槐槐槐さん、弊社のフロレスコーヒーに興味を持っていただきありがとうございます！直近のカッピングスコアは2025年1月に認定キューグレーダーが86.25 SCAを付けました。詳細レポートをお送りできます。",
                 original_language="id", target_language="ja"),

            dict(sender_id=buyer_japan.id,
                 original_message="素晴らしいスコアですね！200kgのグリーンビーンの試験注文に興味があります。プロセス方法は何ですか？東京市場にはフルーリーウォッシュドが好まれます。",
                 translated_message="Skor yang luar biasa! Kami tertarik dengan trial order 200kg green bean. Apa metode prosesnya? Pasar Tokyo lebih suka fully washed.",
                 original_language="ja", target_language="id"),

            dict(sender_id=umkm_kopi.id,
                 original_message="Kami punya fully washed dan natural process. Untuk pasar Jepang, fully washed memang lebih cocok. Kami siapkan 200kg grade 1 fully washed dalam 2 minggu. Harga FOB Maumere USD 7,5 per kg untuk kuantiti ini.",
                 translated_message="フルーリーウォッシュとナチュラルプロセスの両方を制造しています。東京市場ではフルーリーウォッシュが人気です。200kgグレード1フルーリーウォッシュを2週間で準備できます。FOBマウメレ価格はUSD 7.5/kgです。",
                 original_language="id", target_language="ja"),

            dict(sender_id=buyer_japan.id,
                 original_message="USD 7.5の FOBマウメレはこの品質に対して妙当な価格だと思います。植物検疫証明書とCOOを含む輸出書類を提供していただけますか？",
                 translated_message="USD 7.5 FOB Maumere terasa wajar untuk kualitas ini. Bisakah Anda menyediakan dokumen ekspor termasuk phytosanitary certificate dan COO?",
                 original_language="ja", target_language="id"),

            dict(sender_id=umkm_kopi.id,
                 original_message="Bisa Pak! Kami rutin ekspor jadi semua dokumen sudah siap: Phytosanitary dari Karantina Pertanian, COO dari Disperindag, Invoice, Packing List, dan Bill of Lading. Boleh mulai dengan Purchase Order dulu, Pak Hiroshi?",
                 translated_message="もちろんです！定期的に輸出しているので、全ての書類は準備できています: 橋礎検疫証明書、COO、インボイス、パッキングリスト、船荷証券。田中槐槐槐さん、まず発注書から始めていただけますか？",
                 original_language="id", target_language="ja"),

            dict(sender_id=buyer_japan.id,
                 original_message="わかりました。会社概要、TT払いの銀行口座情報、梊見積書を送ってください。評価した後、試験注文を進めます。",
                 translated_message="Baik. Mohon kirimkan profil perusahaan, detail rekening bank untuk pembayaran TT, dan draft invoice. Setelah kami review, kami akan lanjutkan order percobaan.",
                 original_language="ja", target_language="id"),

            dict(sender_id=umkm_kopi.id,
                 original_message="Siap Pak Hiroshi! WhatsApp kami: +6281339887766. Semua dokumen disiapkan dalam 24 jam. Terima kasih banyak atas kepercayaan Bapak, semoga kerjasama kita panjang dan berkah! 🙏",
                 translated_message="田中槐槐槐さん、用意できます！WhatsApp: +6281339887766。全ての文書は24時間以内に準備します。ご信頼いただき誠にありがとうございます。長いお付き合いを期待しております！🙏",
                 original_language="id", target_language="ja"),
        ]

        for m in msgs_room3:
            session.add(ChatMessage(room_id=room3.id, **m))

        # ──────────────────────────────────────────────
        # SAVE
        # ──────────────────────────────────────────────
        session.commit()

        print("\n" + "="*55)
        print("✅ SEED BERHASIL! Berikut akun yang tersedia:")
        print("="*55)
        print("\n🌙 BUYER / IMPORTIR:")
        print("   Arab Saudi : ArabianCompany@gmail.com      | 111111")
        print("   Malaysia   : MalaysiaImport@gmail.com      | 111111")
        print("   Jepang     : TokyoFoodImport@gmail.com     | 111111")
        print("\n🏭 UMKM SELLER:")
        print("   Kemiri NTB : zaryelkemiri@gmail.com         | 111111")
        print("   Mutiara    : mutiaralombok@gmail.com        | 111111")
        print("   Madu       : madusumbawa.asli@gmail.com     | 111111")
        print("   Kopi Flores: kopi.flores.ekspor@gmail.com  | 111111")
        print("\n💬 CHAT ROOM AKTIF:")
        print("   1. Al-Rashidi (Arab) ↔ Zaryel Kemiri Sumbawa")
        print("   2. Faizal Malaysia  ↔ Mutiara Lombok")
        print("   3. Hiroshi Jepang   ↔ Kopi Flores Bajawa")
        print("="*55 + "\n")


if __name__ == "__main__":
    seed_data()
