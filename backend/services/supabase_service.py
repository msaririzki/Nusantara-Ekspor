# ==========================================
# Nusantara Ekspor - Supabase Storage Service
# ==========================================

import uuid
import asyncio
from pathlib import Path
from supabase import create_client, Client
from config import settings


class SupabaseService:
    """Service to handle interactions with Supabase Storage.
    
    Uses run_in_executor to call the synchronous supabase-py client
    from async FastAPI endpoints without blocking the event loop.
    """

    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.key = settings.SUPABASE_KEY
        self.bucket = settings.SUPABASE_BUCKET
        self._client: Client | None = None

    @property
    def client(self) -> Client:
        if self._client is None:
            if not self.url or not self.key:
                raise RuntimeError(
                    "Supabase belum dikonfigurasi!\n"
                    "Isi SUPABASE_URL dan SUPABASE_KEY di backend/.env\n"
                    "Dapatkan key dari: Supabase Dashboard → Settings → API → service_role key"
                )
            if self.key.startswith("AIzaSy"):
                raise RuntimeError(
                    "SUPABASE_KEY terisi dengan Google API Key, bukan Supabase key!\n"
                    "Ambil key yang benar dari: Supabase Dashboard → Settings → API → service_role key"
                )
            self._client = create_client(self.url, self.key)
        return self._client

    def _upload_sync(
        self,
        unique_path: str,
        file_content: bytes,
        content_type: str,
    ) -> str:
        """Synchronous upload — called via run_in_executor."""
        self.client.storage.from_(self.bucket).upload(
            path=unique_path,
            file=file_content,
            file_options={"content-type": content_type, "upsert": "false"},
        )
        public_url = (
            f"{self.url}/storage/v1/object/public/{self.bucket}/{unique_path}"
        )
        return public_url

    def _delete_sync(self, storage_path: str) -> None:
        """Synchronous delete — called via run_in_executor."""
        self.client.storage.from_(self.bucket).remove([storage_path])

    async def upload_file(
        self,
        file_content: bytes,
        filename: str,
        content_type: str = "image/jpeg",
    ) -> str:
        """Upload file ke Supabase Storage dan kembalikan public URL-nya."""
        ext = Path(filename).suffix.lower()
        unique_path = f"products/{uuid.uuid4()}{ext}"

        loop = asyncio.get_event_loop()
        url = await loop.run_in_executor(
            None,
            lambda: self._upload_sync(unique_path, file_content, content_type),
        )
        return url

    async def delete_file(self, file_url: str) -> None:
        """Hapus file dari Supabase Storage berdasarkan public URL-nya."""
        prefix = f"/storage/v1/object/public/{self.bucket}/"
        if prefix not in file_url:
            return  # Bukan URL Supabase Storage, skip

        storage_path = file_url.split(prefix, 1)[-1]
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            lambda: self._delete_sync(storage_path),
        )


supabase_service = SupabaseService()
