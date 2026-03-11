# ==========================================
# Nusantara Ekspor - Gemini AI Service
# (Using google-genai SDK - latest official)
# ==========================================

from google import genai
from google.genai import types
from config import settings

# Initialize Gemini client
client = None
if settings.GEMINI_API_KEY:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)

# Model to use
MODEL_ID = "gemini-2.5-flash"

# System prompt for the export chatbot
EXPORT_CHATBOT_SYSTEM_PROMPT = (
    "Kamu adalah Asisten Ekspor Nusantara, chatbot pintar yang membantu pengusaha dan UMKM Indonesia "
    "memahami proses ekspor. Kamu harus: "
    "1. Menjelaskan alur dan prosedur ekspor dari Indonesia. "
    "2. Memberikan informasi tentang syarat kelayakan produk ekspor. "
    "3. Menjelaskan dokumen dan izin yang diperlukan (PEB, SKA, NIB, dll). "
    "4. Memberikan informasi regulasi perdagangan internasional. "
    "5. Menjawab dalam Bahasa Indonesia yang ramah dan mudah dipahami. "
    "Selalu berikan jawaban yang akurat, terstruktur, dan mudah dipahami. "
    "Gunakan emoji untuk membuat jawaban lebih menarik. "
    "Jika tidak yakin dengan informasi, sarankan pengguna untuk mengecek sumber resmi "
    "seperti oss.go.id atau kemendag.go.id."
)


async def translate_text(
    text: str,
    source_language: str = "id",
    target_language: str = "en",
) -> str:
    """Translate text using Gemini API."""
    if not client:
        return _fallback_translate(text, source_language, target_language)

    try:
        lang_names = {
            "id": "Indonesian",
            "en": "English",
            "zh": "Mandarin Chinese",
            "ja": "Japanese",
            "ko": "Korean",
        }

        source_name = lang_names.get(source_language, source_language)
        target_name = lang_names.get(target_language, target_language)

        prompt = (
            f"Translate the following text from {source_name} to {target_name}. "
            f"Only return the translated text, no explanations.\n\n{text}"
        )

        response = await client.aio.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
        )
        return response.text.strip()

    except Exception as e:
        print(f"[Gemini Translation Error] {e}")
        return _fallback_translate(text, source_language, target_language)


async def chat_with_assistant(message: str) -> str:
    """Get response from the export assistant chatbot using Gemini."""
    if not client:
        print("[Gemini] Client not initialized — no API key")
        return _fallback_chatbot(message)

    try:
        response = await client.aio.models.generate_content(
            model=MODEL_ID,
            contents=message,
            config=types.GenerateContentConfig(
                system_instruction=EXPORT_CHATBOT_SYSTEM_PROMPT,
                temperature=0.7,
                max_output_tokens=1024,
            ),
        )
        return response.text.strip()

    except Exception as e:
        print(f"[Gemini Chatbot Error] {e}")
        return _fallback_chatbot(message)


def _fallback_translate(text: str, source: str, target: str) -> str:
    """Fallback when Gemini API is not available."""
    return f"[Translation {source}→{target}] {text}"


def _fallback_chatbot(message: str) -> str:
    """Fallback chatbot responses when Gemini API is not available."""
    msg = message.lower()

    responses = {
        "ekspor": (
            "**Ekspor** adalah kegiatan mengeluarkan barang dari wilayah pabean Indonesia "
            "ke luar negeri. 📦\n\n"
            "**Alur Dasar Ekspor:**\n"
            "1. Persiapan produk sesuai standar internasional\n"
            "2. Pendaftaran NIB (Nomor Induk Berusaha) di OSS\n"
            "3. Mendapatkan dokumen ekspor\n"
            "4. Pengiriman melalui freight forwarder\n"
            "5. Customs clearance\n"
            "6. Penerimaan pembayaran"
        ),
        "dokumen": (
            "**Dokumen Wajib Ekspor:** 📄\n\n"
            "• PEB (Pemberitahuan Ekspor Barang)\n"
            "• Commercial Invoice\n"
            "• Packing List\n"
            "• Bill of Lading (B/L)\n"
            "• Certificate of Origin (SKA)\n"
            "• Health/Phytosanitary Certificate (jika diperlukan)"
        ),
        "izin": (
            "**Izin yang Diperlukan:** 🏢\n\n"
            "1. NIB — Nomor Induk Berusaha\n"
            "2. ET — Eksportir Terdaftar\n"
            "3. SKA — Surat Keterangan Asal\n"
            "4. BPOM/Halal (untuk produk tertentu)"
        ),
        "syarat": (
            "**Syarat Kelayakan Produk:** ✅\n\n"
            "• Memiliki NIB\n"
            "• Produk memenuhi standar mutu negara tujuan\n"
            "• Sertifikasi yang diperlukan\n"
            "• Packaging standar internasional\n"
            "• Labeling sesuai ketentuan"
        ),
    }

    for keyword, response in responses.items():
        if keyword in msg:
            return response

    return (
        "Halo! 👋 Saya Asisten Ekspor Nusantara.\n\n"
        "Saya bisa membantu Anda dengan:\n"
        "• Apa itu ekspor & alurnya\n"
        "• Syarat kelayakan produk\n"
        "• Dokumen yang diperlukan\n"
        "• Izin & regulasi ekspor\n\n"
        "Silakan tanyakan salah satu topik di atas! 😊"
    )
