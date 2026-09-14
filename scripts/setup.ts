/**
 * Prepares the database: creates the tables, then (only if there's no
 * content yet) uploads the events' photos to ImageKit and copies
 * data/events.ts in, so the admin panel starts with today's site.
 *
 *   npm run db:setup
 *   npm run db:setup -- --local    keep the photos in public/ instead of uploading
 *
 * Safe to re-run: existing content is never overwritten. The files in
 * public/ are never deleted, so the site keeps working either way.
 */
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { events as localEvents } from "../data/events";
import { db, insertEvent, upsertSettings } from "../server/db";
import { collectStrings, eventFromItem, isLocalImage } from "../server/eventData";
import { uploadImage } from "../server/imagekit";
import { SCHEMA } from "../server/schema";

const UPLOAD_CONCURRENCY = 4;
const publicDir = path.join(process.cwd(), "public");
const keepLocal = process.argv.includes("--local");

/**
 * "/work/cartier/cartier-01.jpg" → "work-cartier-cartier-01.jpg". ImageKit file
 * names allow letters, digits, dots and dashes, so the folders in the path
 * become part of the name and keep it unique.
 */
const fileNameFor = (src: string) => src.replace(/^\//, "").replace(/[^\w.-]+/g, "-");

async function uploadAll(sources: string[]) {
  const urls = new Map<string, string>();
  const queue = [...sources];
  let done = 0;

  async function worker() {
    for (let src = queue.shift(); src; src = queue.shift()) {
      const fullPath = path.join(publicDir, src);
      if (!existsSync(fullPath)) {
        console.log(`  [${++done}/${sources.length}] skipped, not on disk: ${src}`);
        continue;
      }
      urls.set(src, await uploadImage(createReadStream(fullPath), fileNameFor(src)));
      console.log(`  [${++done}/${sources.length}] ${src}`);
    }
  }

  await Promise.all(Array.from({ length: UPLOAD_CONCURRENCY }, worker));
  return urls;
}

async function main() {
  const sql = db();
  for (const statement of SCHEMA) await sql.query(statement);
  console.log("Tables are ready.");

  const [{ count }] = await sql`SELECT count(*)::int AS count FROM site_settings`;
  if (count > 0) {
    console.log("The database already has content, so it was left as it is.");
    return;
  }

  let events = localEvents.map(eventFromItem);

  if (keepLocal) {
    console.log("Keeping the photos in public/ (--local).");
  } else {
    const sources = [...collectStrings(events, isLocalImage)];
    console.log(`Uploading ${sources.length} photos to ImageKit…`);
    const urls = await uploadAll(sources);
    // Swap every public/ path for its ImageKit URL.
    events = JSON.parse(JSON.stringify(events), (_, item) =>
      typeof item === "string" && urls.has(item) ? urls.get(item) : item,
    );
  }

  await sql.transaction([
    upsertSettings(sql, {}),
    ...events.map((event, position) => insertEvent(sql, event, position)),
  ]);

  console.log(`Saved ${events.length} events.`);
  console.log('Next: npm run admin:create -- you@example.com "Your Name"');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
