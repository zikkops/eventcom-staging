import Link from "next/link";
import { notFound } from "next/navigation";
import { EventEditor } from "@/app/admin/_components/EventEditor";
import { PageTitle, secondaryButtonClass } from "@/app/admin/_components/ui";
import { requireAdmin } from "@/server/auth";
import { readEvent } from "@/server/content";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const event = await readEvent(id);
  if (!event) notFound();

  return (
    <>
      <PageTitle
        title={`Edit ${event.brand}`}
        action={
          <Link href="/admin/events" className={secondaryButtonClass}>
            ← All events
          </Link>
        }
      />
      <EventEditor id={event.id} initial={event} />
    </>
  );
}
