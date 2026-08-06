import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { events, getEventBySlug } from "@/data/events";
import PhotoAlbum from "@/components/PhotoAlbum";

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  return { title: event ? `${event.brand} | Eventcom` : "Eventcom" };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <>
      <section
        className="page-hero event-hero"
        style={
          { "--hero-image": `url('${event.heroImage}')` } as React.CSSProperties
        }
      >
        <div className="page-hero-content">
          <div className="page-kicker">{event.kicker}</div>
          <h1 className="page-title">{event.brand}</h1>
          <div className="cta-row">
            <Link className="btn btn-pink" href="#album">
              View Photo Album →
            </Link>
            <Link className="btn" href="/work">
              Back to Work
            </Link>
          </div>
        </div>
      </section>

      {event.video && (
        <section className="section event-overview">
          <div className="services-heading">
            <div className="small-label">Watch</div>
            <h2>Event film.</h2>
          </div>
          <video
            className="event-video"
            src={event.video}
            poster={event.heroImage}
            controls
            playsInline
          />
        </section>
      )}

      <section id="album" className="section services">
        <div className="services-heading">
          <div className="small-label">Photo Album</div>
          <h2>Event moments.</h2>
        </div>
        <PhotoAlbum images={event.album} vertical={event.verticalAlbum} />
      </section>

      <section className="section contact mini-contact">
        <div>
          <div className="small-label" style={{ color: "var(--cyan)" }}>
            Start Your Event
          </div>
          <h2>Want an experience like this?</h2>
          <p>
            Tell us the brand, audience, objective, and event format. We can
            shape the concept and full guest journey.
          </p>
          <div className="center-cta">
            <Link className="btn" href="/contact">
              Contact Us →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
