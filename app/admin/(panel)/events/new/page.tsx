import Link from "next/link";
import { redirect } from "next/navigation";
import { EventEditor } from "@/app/admin/_components/EventEditor";
import { PageTitle, secondaryButtonClass } from "@/app/admin/_components/ui";
import { requireAdmin } from "@/server/auth";
import { isSeeded } from "@/server/content";
import { emptyEvent } from "@/server/eventData";

export default async function NewEventPage() {
  await requireAdmin();
  if (!(await isSeeded())) redirect("/admin/events");

  return (
    <>
      <PageTitle
        title="New event"
        action={
          <Link href="/admin/events" className={secondaryButtonClass}>
            ← All events
          </Link>
        }
      />
      <EventEditor id={null} initial={emptyEvent()} />
    </>
  );
}
