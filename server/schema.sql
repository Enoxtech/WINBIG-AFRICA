-- WINBIG AFRICA — Supabase PostgreSQL Schema
-- Run this in Supabase Dashboard > SQL Editor

-- ─── Users ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wb_users (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT        UNIQUE NOT NULL,
  password_hash TEXT      NOT NULL,
  full_name   TEXT,
  phone       TEXT,
  date_of_birth TEXT,
  bank_name   TEXT,
  account_number TEXT,
  account_name  TEXT,
  referred_by  UUID      REFERENCES wb_users(id),
  referral_code TEXT     UNIQUE,
  role         TEXT      DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ─── Campaigns ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wb_campaigns (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT        NOT NULL,
  description   TEXT,
  image_url     TEXT,
  ticket_price  NUMERIC     DEFAULT 100,
  total_tickets INTEGER     DEFAULT 1000,
  sold_tickets  INTEGER     DEFAULT 0,
  status        TEXT        DEFAULT 'draft'
                          CHECK (status IN ('draft','active','completed','cancelled')),
  end_date      TIMESTAMPTZ,
  winner_id     UUID        REFERENCES wb_users(id),
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ─── Tickets ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wb_tickets (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID        REFERENCES wb_campaigns(id) ON DELETE CASCADE,
  user_id     UUID        REFERENCES wb_users(id) ON DELETE CASCADE,
  quantity    INTEGER     DEFAULT 1,
  total_price NUMERIC     DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── Draws ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wb_draws (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID        REFERENCES wb_campaigns(id),
  winner_id   UUID        REFERENCES wb_users(id),
  drawn_at    TIMESTAMPTZ DEFAULT now()
);

-- ─── Notifications ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wb_notifications (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES wb_users(id) ON DELETE CASCADE,
  type        TEXT        DEFAULT 'info',
  title       TEXT,
  message     TEXT,
  read        BOOLEAN     DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── Wallets ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wb_wallets (
  user_id          UUID        PRIMARY KEY REFERENCES wb_users(id) ON DELETE CASCADE,
  balance          NUMERIC     DEFAULT 0,
  total_won        NUMERIC     DEFAULT 0,
  total_withdrawn  NUMERIC     DEFAULT 0,
  total_spent      NUMERIC     DEFAULT 0
);

-- ─── Withdrawals ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wb_withdrawals (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID        REFERENCES wb_users(id) ON DELETE CASCADE,
  amount          NUMERIC     NOT NULL,
  bank_name       TEXT,
  account_number  TEXT,
  account_name    TEXT,
  status          TEXT        DEFAULT 'pending'
                          CHECK (status IN ('pending','approved','paid','rejected')),
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ─── Deposits ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wb_deposits (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID        REFERENCES wb_users(id) ON DELETE CASCADE,
  amount            NUMERIC     NOT NULL,
  payment_reference TEXT,
  status            TEXT        DEFAULT 'pending'
                          CHECK (status IN ('pending','confirmed','failed')),
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- ─── Referrals ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wb_referrals (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id  UUID        REFERENCES wb_users(id) ON DELETE CASCADE,
  referred_id  UUID        REFERENCES wb_users(id) ON DELETE CASCADE,
  bonus_earned NUMERIC     DEFAULT 0,
  status       TEXT        DEFAULT 'pending'
                          CHECK (status IN ('pending','earned','cancelled')),
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ─── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_tickets_campaign ON wb_tickets(campaign_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user     ON wb_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON wb_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user  ON wb_withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_user      ON wb_deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON wb_referrals(referrer_id);

-- ─── Auto-create wallet on user insert ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION create_wallet_on_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wb_wallets (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_user_created
  AFTER INSERT ON wb_users
  FOR EACH ROW EXECUTE FUNCTION create_wallet_on_user();

-- ─── Auto-update sold_tickets on ticket insert ─────────────────────────────────
CREATE OR REPLACE FUNCTION update_sold_tickets()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE wb_campaigns
  SET sold_tickets = sold_tickets + NEW.quantity
  WHERE id = NEW.campaign_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_ticket_created
  AFTER INSERT ON wb_tickets
  FOR EACH ROW EXECUTE FUNCTION update_sold_tickets();
