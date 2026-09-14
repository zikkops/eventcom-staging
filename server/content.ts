import "server-only";
import { unstable_cache } from "next/cache";
import { events as localEvents, hasEventPage, type EventItem } from "../data/events";
import { db } from "./db";
import { isDatabaseConfigured } from "./env";
import { rowToEvent, toEventItem, type EventRecord } from "./eventData";

/** Saving anything in the admin panel expires this tag, so the pages rebuild with the change. */
export const CONTENT_TAG = "site-content";

// Thrown (rather than returned) so the empty state is never cached.
class NoContentYet extends Error {}

// Before `npm run db:setup` the tables don't exist yet; treat that as "no content".
const isMissingTable = (error: unknown) => (error as { code?: string }).code === "42P01";

/** Whether the setup script has filled the database. Until then the site shows data/events.ts. */
export async function isSeeded(): Promise<boolean> {
  try {
    const rows = await db()`SELECT 1 FROM site_settings WHERE id = 1`;
    return rows.length > 0;
  } catch (error) {
    if (isMissingTable(error)) return false;
    throw error;
  }
}

/** Every event in running order, uncached: for the admin panel. */
export async function readEvents(): Promise<EventRecord[]> {
  try {
    const rows = await db()`SELECT * FROM events ORDER BY position, id`;
    return rows.map(rowToEvent);
  } catch (error) {
    if (isMissingTable(error)) return [];
    throw error;
  }
}

export async function readEvent(id: number): Promise<EventRecord | null> {
  const rows = await db()`SELECT * FROM events WHERE id = ${id}`;
  return rows[0] ? rowToEvent(rows[0]) : null;
}

const cachedEvents = unstable_cache(
  async () => {
    if (!(await isSeeded())) throw new NoContentYet();
    return (await readEvents()).map(toEventItem);
  },
  ["events"],
  // Saving in the admin panel refreshes this immediately through the tag. The
  // time limit is a safety net for changes made outside the panel, such as a
  // script writing straight to the database.
  { tags: [CONTENT_TAG], revalidate: 60 },
);

/** What the site renders: the database's events, or the built-in list until it has some. */
export async function getEvents(): Promise<EventItem[]> {
  if (!isDatabaseConfigured) return localEvents;
  try {
    return await cachedEvents();
  } catch (error) {
    if (error instanceof NoContentYet) return localEvents;
    throw error;
  }
}

/** An event that has an inner page; lightbox-only events have none. */
export async function getEventPage(slug: string): Promise<EventItem | undefined> {
  const event = (await getEvents()).find((item) => item.slug === slug);
  return event && hasEventPage(event) ? event : undefined;
}
