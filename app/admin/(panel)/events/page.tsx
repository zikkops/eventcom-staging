import Link from "next/link";
import { EventList, type EventRow } from "@/app/admin/_components/EventList";
import { buttonClass, PageTitle } from "@/app/admin/_components/ui";
import { requireAdmin } from "@/server/auth";
import { isSeeded, readEvents } from "@/server/content";
import type { EventRecord } from "@/server/eventData";

// The list only needs these fields, so only these reach the browser.
const toRow = (event: EventRecord): EventRow => ({
  id: event.id,
  brand: event.brand,
  slug: event.slug,
  cardImage: event.cardImage || event.heroImage,
  opensFilm: event.vimeoId !== "",
  films: event.films.length,
  photos: event.album.length,
});

export default async function EventsPage() {
  await requireAdmin();
  const [seeded, events] = await Promise.all([isSeeded(), readEvents()]);

  return (
    <>
      <PageTitle
        title="Events"
        description="Everything on the Work page, in the order it appears there. Changes go live straight away."
        action={
          seeded && (
            <Link href="/admin/events/new" className={buttonClass}>
              + New event
            </Link>
          )
        }
      />
      {seeded ? (
        <EventList events={events.map(toRow)} />
      ) : (
        <p className="adm-notice">
          The database has no content yet. Run <code>npm run db:setup</code> first; until then the
          site keeps showing its built-in events.
        </p>
      )}
    </>
  );
}
