import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services | Eventcom",
};

const services = [
  {
    id: "strategy",
    number: "01",
    title: "Strategy & Concept",
    copy: "We define the event objective, audience journey, key messages, theme, creative direction, and overall experience flow.",
    tags: ["Creative concept", "Guest journey", "Messaging"],
  },
  {
    id: "production",
    number: "02",
    title: "Event Production",
    copy: "We manage planning, supplier coordination, technical requirements, timelines, production details, and on-ground execution.",
    tags: ["Logistics", "Suppliers", "Run of show"],
  },
  {
    id: "creative",
    number: "03",
    title: "Design & Creative",
    copy: "We develop the visual language of the event, including spatial mood, stage look, branding, invitations, content, signage, and digital assets.",
    tags: ["Branding", "Spatial design", "Content"],
  },
  {
    id: "guest",
    number: "04",
    title: "Guest Experience",
    copy: "We plan how guests move, interact, discover, photograph, gather, and remember the event.",
    tags: ["Arrival flow", "Photo moments", "Hospitality"],
  },
  {
    id: undefined,
    number: "05",
    title: "Brand Activations",
    copy: "We create pop-ups, product launches, retail moments, influencer experiences, and interactive brand environments.",
    tags: ["Launches", "Pop-ups", "Influencers"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section
        className="page-hero"
        style={
          {
            "--hero-image":
              "url('https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1800&auto=format&fit=crop')",
          } as React.CSSProperties
        }
      >
        <div className="page-hero-content">
          <div className="page-kicker">Services</div>
          <h1 className="page-title">
            Event services shaped around the guest.
          </h1>
          <p className="page-intro">
            From strategy and creative concept to production, design, and
            execution, we build experiences that feel complete from arrival
            to departure.
          </p>
        </div>
      </section>

      <section className="section services">
        <div className="services-heading">
          <div className="small-label">What We Do</div>
          <h2>Our Services</h2>
        </div>
        <div className="service-list">
          {services.map((service) => (
            <div
              key={service.title}
              id={service.id}
              className="service-detail"
            >
              <div>
                <span>{service.number}</span>
                <h3>{service.title}</h3>
              </div>
              <p>{service.copy}</p>
              <div className="service-tags">
                {service.tags.map((tag) => (
                  <b key={tag}>{tag}</b>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section how">
        <div className="small-label">Process</div>
        <h2>Creative thinking with operational discipline.</h2>
        <p>
          We combine the energy of a creative studio with the structure of an
          event production team, making sure every concept can actually be
          executed beautifully.
        </p>
        <div className="center-cta">
          <Link className="btn btn-pink" href="/work">
            See Our Work →
          </Link>
        </div>
      </section>
    </>
  );
}
