import type { Metadata } from "next";
import Link from "next/link";
import { events } from "@/data/events";

export const metadata: Metadata = {
  title: "Work | Eventcom",
};

export default function WorkPage() {
  return (
    <>
      <section
        className="page-hero"
        style={
          {
            "--hero-image":
              "url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1800&auto=format&fit=crop')",
          } as React.CSSProperties
        }
      >
        <div className="page-hero-content">
          <div className="page-kicker">Selected Work</div>
          <h1 className="page-title">Brands we brought to life.</h1>
          <p className="page-intro">
            Explore brand events, launches, activations, and formal
            experiences. Each project opens into a dedicated event page with
            a short description and photo album.
          </p>
        </div>
      </section>

      <section id="brand-work" className="section work">
        <div className="services-heading">
          <div className="small-label">Brand Portfolio</div>
          <h2>Click a brand to view the event.</h2>
        </div>
        <div className="brand-card-grid">
          {events.map((event) => (
            <Link
              key={event.slug}
              className="brand-card"
              href={`/work/${event.slug}`}
              style={
                { "--image": `url('${event.cardImage}')` } as React.CSSProperties
              }
            >
              <div className="brand-card-top" style={{ justifyContent: "flex-end" }}>
                <b>View Event →</b>
              </div>
              <div className="brand-card-content">
                <h3>{event.brand}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section services">
        <div className="services-heading">
          <div className="small-label">Selected Work</div>
          <h2>From idea to impact.</h2>
        </div>
        <div className="grid-4">
          <div className="panel">
            <div className="panel-number">01</div>
            <h3>Launches</h3>
            <p>
              Product reveals, fragrance launches, retail openings, and
              campaign moments.
            </p>
          </div>
          <div className="panel">
            <div className="panel-number">02</div>
            <h3>Corporate</h3>
            <p>
              Conferences, forums, town halls, leadership retreats, and
              internal events.
            </p>
          </div>
          <div className="panel">
            <div className="panel-number">03</div>
            <h3>Activations</h3>
            <p>
              Pop-ups, influencer experiences, brand booths, and interactive
              environments.
            </p>
          </div>
          <div className="panel">
            <div className="panel-number">04</div>
            <h3>Formal</h3>
            <p>
              Gala dinners, award ceremonies, private celebrations, and
              milestone events.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
