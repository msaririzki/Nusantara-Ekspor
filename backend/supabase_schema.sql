-- ==========================================
-- Nusantara Ekspor - Supabase SQL Schema
-- ==========================================
-- Jalankan file ini di Supabase SQL Editor:
-- Dashboard → SQL Editor → New query → Paste & Run
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Table: users ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id          VARCHAR(36)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email       VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    full_name   VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    role        VARCHAR(10)  NOT NULL CHECK (role IN ('umkm', 'buyer')),
    country     VARCHAR(100) NOT NULL DEFAULT 'Indonesia',
    phone       VARCHAR(20),
    address     VARCHAR(500),
    is_active   BOOLEAN      NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email   ON users (email);

-- ─── Table: products ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id              VARCHAR(36)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id         VARCHAR(36)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT         NOT NULL,
    price           FLOAT        NOT NULL,
    currency        VARCHAR(3)   NOT NULL DEFAULT 'IDR',
    category        VARCHAR(100) NOT NULL,
    images          JSONB        NOT NULL DEFAULT '[]',
    specifications  JSONB        NOT NULL DEFAULT '{}',
    min_order       INTEGER      NOT NULL DEFAULT 1,
    stock           INTEGER      NOT NULL DEFAULT 0,
    is_active       BOOLEAN      NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_user_id  ON products (user_id);
CREATE INDEX IF NOT EXISTS idx_products_name     ON products (name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);

-- Auto-update updated_at on products
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- ─── Table: chat_rooms ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_rooms (
    id          VARCHAR(36)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
    umkm_id     VARCHAR(36)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    buyer_id    VARCHAR(36)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id  VARCHAR(36)  REFERENCES products(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    UNIQUE (umkm_id, buyer_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_rooms_umkm_id  ON chat_rooms (umkm_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_buyer_id ON chat_rooms (buyer_id);

CREATE TRIGGER update_chat_rooms_updated_at
    BEFORE UPDATE ON chat_rooms
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- ─── Table: chat_messages ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_messages (
    id                  VARCHAR(36)  PRIMARY KEY DEFAULT gen_random_uuid()::text,
    room_id             VARCHAR(36)  NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id           VARCHAR(36)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_message    TEXT         NOT NULL,
    translated_message  TEXT,
    original_language   VARCHAR(5)   NOT NULL DEFAULT 'id',
    target_language     VARCHAR(5),
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages (room_id);

-- ─── Row Level Security (Opsional) ───────────────────────────
-- Uncomment jika ingin aktifkan RLS (gunakan jika akses langsung dari frontend)
-- ALTER TABLE users        ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE products     ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE chat_rooms   ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
