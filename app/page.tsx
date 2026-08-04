import Link from "next/link";
import StatCounter from "@/components/StatCounter";

const UP = "https://eventcom.vipmindslb.com/wp-content/uploads/2026/05";

const methodSteps = [
  {
    title: "Insight",
    copy: "Understanding the audience, the message, and the context.",
    color: "var(--pink)",
  },
  {
    title: "Concept",
    copy: "Translating ideas into a clear experiential narrative.",
    color: "var(--purple)",
  },
  {
    title: "Design",
    copy: "Shaping space, content, and interaction into a cohesive environment.",
    color: "var(--cyan)",
  },
  {
    title: "Execution",
    copy: "Delivering the experience with precision and operational discipline.",
    color: "#00e08a",
  },
  {
    title: "Impact",
    copy: "Ensuring the moment resonates beyond the event itself.",
    color: "var(--lime)",
  },
];

const serviceRows = [
  {
    ghost: "Unique",
    title: "Experiential Marketing",
    copy: "Immersive brand activations, pop-ups, and interactive environments.",
    bullets: ["Brand activations", "Pop-up concepts", "Interactive environments"],
    images: ["/homepage/experiential-1.jpg", "/homepage/experiential-2.jpg"],
  },
  {
    ghost: "Corporate",
    title: "Corporate & Institutional Events",
    copy: "Conferences, executive gatherings, product launches, and retreats.",
    bullets: ["Executive gatherings", "Product launches", "Retreats"],
    images: [
      "https://eventcom.vipmindslb.com/wp-content/uploads/2026/06/Copy-of-A7407648-scaled.jpg",
      "https://eventcom.vipmindslb.com/wp-content/uploads/2026/06/Copy-of-DSC02851-scaled.jpg",
    ],
  },
  {
    ghost: "Formal",
    title: "Formal Occasions",
    copy: "Elegant celebrations and milestone moments that leave a mark.",
    bullets: ["Gala dinners", "Award ceremonies", "Private celebrations"],
    images: ["/homepage/formal-1.jpg", "/homepage/formal-2.jpg"],
  },
];

const brandLogos = [
  "BMW.png",
  "CAB-XL-Logo-white.png",
  "Cartier.png",
  "DAHAMANI.png",
  "Gevency.png",
  "Italian-Embassy.c.png",
  "Jaeger.png",
  "Lucid.c.png",
  "O100.c.png",
  "REMOWA.png",
  "SGC.png",
  "Solitaire.c.png",
].map((file) => `${UP}/${file}`);

const workCategories = [
  {
    number: "01",
    title: "Event Experiences",
    image:
      "https://eventcom.vipmindslb.com/wp-content/uploads/2026/06/Copy-of-A7409319-scaled.jpg",
  },
  {
    number: "02",
    title: "Live Moments",
    image:
      "https://eventcom.vipmindslb.com/wp-content/uploads/2026/06/Copy-of-DSC01144-scaled.jpg",
  },
  {
    number: "03",
    title: "Creative Content",
    image:
      "https://eventcom.vipmindslb.com/wp-content/uploads/2026/06/PIAGET-2172-scaled.jpg",
  },
  {
    number: "04",
    title: "Brand Activations",
    image:
      "https://eventcom.vipmindslb.com/wp-content/uploads/2026/06/Copy-of-DSC02795-scaled.jpg",
  },
];

export default function Home() {
  return (
    <>
      <section id="home" className="hero">
        <div className="hero-content">
          <div className="eyebrow">We create moments that move</div>
          <h1>We shape the energy behind every event.</h1>
          <p>
            From first idea to final guest experience, we craft events that
            connect, inspire, and leave a lasting impact.
          </p>
          <div className="cta-row">
            <Link className="btn btn-pink" href="/work">
              See Our Work →
            </Link>
            <Link className="btn" href="/contact">
              Let&rsquo;s Talk →
            </Link>
          </div>
          <div className="play-reel">
            <span className="play-icon">▶</span> Play Reel
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stats-grid">
          <div className="stat">
            <StatCounter to={250} suffix="+" />
            <span>Events Delivered</span>
          </div>
          <div className="stat">
            <StatCounter to={80} suffix="+" />
            <span>Brands Activated</span>
          </div>
          <div className="stat">
            <StatCounter to={15} suffix="+" />
            <span>Years Experience</span>
          </div>
          <div className="stat">
            <StatCounter to={12} />
            <span>Regional Markets</span>
          </div>
        </div>
      </section>

      <section className="section approach">
        <div className="split" style={{ alignItems: "start" }}>
          <div>
            <div className="small-label">Our Method</div>
            <h2 className="section-title">Our Approach</h2>
            <div className="pink-line" />
            <p className="section-copy">
              Great experiences are not assembled; they are designed. At
              Eventcom, every project follows a structured creative journey.
            </p>
            <Link className="btn" href="/about" style={{ marginTop: 32, display: "inline-flex" }}>
              More About Us →
            </Link>
          </div>
          <div>
            {methodSteps.map((step) => (
              <div
                key={step.title}
                className="method-step"
                style={{
                  padding: "24px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="step-line" style={{ background: step.color }} />
                <h3 style={{ color: step.color }}>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="section services">
        <div className="services-heading">
          <div className="small-label">Services</div>
          <h2>Event Experiences</h2>
        </div>
        <div className="service-list">
          {serviceRows.map((row) => (
            <div className="service-row" key={row.title}>
              <div className="service-title-wrap">
                <div className="ghost">{row.ghost}</div>
                <div className="service-title">{row.title}</div>
              </div>
              <p className="service-copy">{row.copy}</p>
              <ul className="bullets">
                {row.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="image-stack">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={row.images[0]} alt="" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={row.images[1]} alt="" />
              </div>
            </div>
          ))}
        </div>
        <div className="center-cta">
          <Link className="btn btn-pink" href="/services">
            All Services →
          </Link>
        </div>
      </section>

      <section className="brand-strip">
        <p>Trusted by leading brands</p>
        <div className="marquee">
          {[...brandLogos, ...brandLogos].map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`${src}-${i}`} src={src} alt="" loading="lazy" />
          ))}
        </div>
      </section>

      <section className="section how">
        <div className="small-label">Process</div>
        <h2>How We Do It</h2>
        <p>
          We work through close collaboration, disciplined planning, and
          thoughtful creative direction; aligning concept, production, and
          execution into a single, cohesive experience.
        </p>
      </section>

      <section id="work" className="section work">
        <div className="services-heading">
          <div className="small-label">Selected Work</div>
          <h2>Moments designed to be seen.</h2>
        </div>
        <div className="work-grid">
          {workCategories.map((cat) => (
            <div
              className="work-card"
              key={cat.number}
              style={{ "--image": `url('${cat.image}')` } as React.CSSProperties}
            >
              <div className="work-card-content">
                <span>{cat.number}</span>
                <h3>{cat.title}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="center-cta">
          <Link className="btn btn-pink" href="/work">
            See Our Work →
          </Link>
        </div>
      </section>

      <section className="section contact">
        <div>
          <div className="small-label" style={{ color: "var(--cyan)" }}>
            Let&rsquo;s talk about your event
          </div>
          <h2>Let&rsquo;s talk about your event idea with us</h2>
          <p>
            Tell us the idea, audience, objective, and launch type. We shape
            the concept and bring it to life.
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
