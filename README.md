# Eventcom

The Eventcom website, with an admin panel for the events on the Work page.
The backend follows the Konkreet site: a Neon Postgres database, ImageKit for
photos, and a password-protected panel at `/admin`.

## Running

```bash
npm run dev     # http://localhost:3000
npm run build
npm start
```

## How the content works

- **Without a database** (no `DATABASE_URL`), the site renders
  [data/events.ts](data/events.ts), exactly as before the backend existed. The
  admin login page says the database isn't connected.
- **With a database set up**, `/work` and `/work/[slug]` read the events from
  Postgres. Saving anything in the admin refreshes those pages straight away;
  a 60-second limit also catches changes made outside the panel.
- `data/events.ts` stays in the repo as the fallback and as the seed for a
  fresh database. The photos in `public/` are never deleted.

## Setting up the admin

1. **Database.** Create a project on [Neon](https://neon.tech) (a separate one
   from Konkreet) and copy its connection string from **Connect**.
2. **Photos.** In [ImageKit](https://imagekit.io), open **Developer options**
   and copy the public key, private key and URL endpoint.
3. **Keys.** Copy `.env.example` to `.env.local` and fill in the four values.
4. **Check them:**

   ```bash
   npm run check
   ```

5. **Fill the database** with today's events. This uploads their photos to
   ImageKit (into an `/eventcom` folder); add `-- --local` to keep using the
   photos in `public/` instead. It never overwrites existing content, so it is
   safe to re-run.

   ```bash
   npm run db:setup
   ```

6. **Create your login.** The first account is the super admin, the only one
   who can manage other users. It prints a password once.

   ```bash
   npm run admin:create -- you@example.com "Your Name"
   ```

7. Log in at `/admin/login` and change the password under **My account**.

## Deploying on Vercel

Add the same four variables under **Project Settings → Environment Variables**
and redeploy. Until they are set, the live site keeps rendering
`data/events.ts` and nothing changes for visitors.

## What the admin covers

- **Events**: add, edit, delete, and drag to reorder. Each event has a card
  photo, and its card either opens an event page or plays one Vimeo film in a
  lightbox. An event page has a main photo, films (Vimeo link, title, poster,
  portrait flag) and a photo album. A full Vimeo share link can be pasted as it
  is. An event with films shows them instead of its album, as the site already
  did.
- **Users**: the super admin adds and removes people and resets passwords.
  Everyone else sees only Events and their own password.
- **Photos** upload from the browser straight to ImageKit, and a photo removed
  from every event is deleted there too.

Logins use scrypt password hashing and database sessions: the cookie holds a
random token and the database stores only its hash, sessions last 14 days,
and an email is locked for 15 minutes after 10 failed attempts. Every admin
action checks the login itself, and `/admin` is marked `noindex`.

## Structure

| Path | What it holds |
| --- | --- |
| [app/(site)/](app/(site)/) | The public pages, with the header and footer layout |
| [app/admin/](app/admin/) | The admin panel: login, events, users, account |
| [server/](server/) | Database, logins, ImageKit and data shaping (server only) |
| [lib/imageUrl.ts](lib/imageUrl.ts) | ImageKit URL helpers shared by the site and the panel |
| [scripts/](scripts/) | `check`, `db:setup` and `admin:create` |
| [data/events.ts](data/events.ts) | The built-in events: fallback and seed |
