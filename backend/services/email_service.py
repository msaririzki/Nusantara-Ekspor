import resend
from config import settings

resend.api_key = settings.RESEND_API_KEY

def send_reset_password_email(to_email: str, reset_link: str) -> bool:
    """Mengirim email tautan reset kata sandi menggunakan Resend API."""
    if not settings.RESEND_API_KEY:
        print("⚠️  RESEND_API_KEY belum dikonfigurasi. Mengabaikan pengiriman email aktual.")
        print(f"🔗 [MOCK] Reset link for {to_email}: {reset_link}")
        return True
        
    try:
        html_content = f"""
        <div style="font-family: sans-serif; max-w-md; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h2 style="color: #2563eb;">Reset Kata Sandi Nusantara Ekspor</h2>
            <p>Halo,</p>
            <p>Kami menerima permintaan untuk mereset kata sandi akun Anda. Jika ini adalah Anda, silakan klik tombol di bawah ini:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_link}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Atur Ulang Sandi</a>
            </div>
            <p>Jika tombol tidak berfungsi, salin dan tempel tautan berikut ke browser Anda:</p>
            <p>
                <a href="{reset_link}" style="color: #2563eb; word-break: break-all;">{reset_link}</a>
            </p>
            <p style="color: #6b7280; font-size: 0.875rem;">Tautan ini akan kedaluwarsa dalam 1 jam.</p>
            <hr style="border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="color: #9ca3af; font-size: 0.75rem;">Abaikan email ini jika Anda tidak merasa memintanya.</p>
        </div>
        """
        
        # Resend mensyaratkan domain terverifikasi. Untuk sandbox trial, bisa menggunakan "onboarding@resend.dev"
        params = {
            "from": "Nusantara Ekspor <onboarding@resend.dev>",
            "to": [to_email],
            "subject": "Reset Kata Sandi Anda - Nusantara Ekspor",
            "html": html_content
        }
        
        email = resend.Emails.send(params)
        print(f"✅ Email reset terkirim ke {to_email}: {email}")
        return True
    except Exception as e:
        print(f"❌ Gagal mengirim email reset: {e}")
        return False
