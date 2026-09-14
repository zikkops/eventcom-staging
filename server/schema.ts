// Every statement is idempotent, so `npm run db:setup` can be re-run safely.
export const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS admins (
    id serial PRIMARY KEY,
    email text NOT NULL UNIQUE,
    name text NOT NULL DEFAULT '',
    password_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  // Everyone is a normal admin unless promoted to "super", who alone manages accounts.
  `ALTER TABLE admins ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'admin'`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token_hash text PRIMARY KEY,
    admin_id integer NOT NULL REFERENCES admins (id) ON DELETE CASCADE,
    expires_at timestamptz NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS login_failures (
    email text NOT NULL,
    failed_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS login_failures_email ON login_failures (email, failed_at)`,
  // One row, written by the setup script. Its presence is what says the
  // database has content, so deleting every event leaves an empty grid
  // rather than bringing the built-in events back.
  `CREATE TABLE IF NOT EXISTS site_settings (
    id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    data jsonb NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS events (
    id serial PRIMARY KEY,
    position integer NOT NULL DEFAULT 0,
    slug text NOT NULL UNIQUE,
    brand text NOT NULL,
    kicker text NOT NULL DEFAULT '',
    hero_image text NOT NULL DEFAULT '',
    card_image text NOT NULL DEFAULT '',
    vimeo_id text NOT NULL DEFAULT '',
    video text NOT NULL DEFAULT '',
    vertical_album boolean NOT NULL DEFAULT false,
    album jsonb NOT NULL DEFAULT '[]',
    films jsonb NOT NULL DEFAULT '[]',
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
];
