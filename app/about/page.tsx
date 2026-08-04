import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Eventcom",
};

export default function AboutPage() {
  return (
    <>
      <section
        className="page-hero"
        style={
          {
            "--hero-image":
              "url('https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1800&auto=format&fit=crop')",
          } as React.CSSProperties
        }
      >
        <div className="page-hero-content">
          <div className="page-kicker">About Eventcom</div>
          <h1 className="page-title">Experience is our language.</h1>
          <p className="page-intro">
            Eventcom creates live experiences that help brands, institutions,
            and private clients communicate with clarity, emotion, and
            impact.
          </p>
        </div>
      </section>

      <section className="section approach">
        <div className="grid-2">
          <div className="page-copy">
            <div className="small-label">Who We Are</div>
            <h2>We design the full journey, not only the event.</h2>
            <p>
              Our work begins before the first guest arrives and continues
              after the event ends. We connect strategy, creative direction,
              production, logistics, and guest flow into one complete
              experience.
            </p>
            <p>
              Every detail has a role: the arrival, the lighting, the
              movement, the content, the room energy, the timing, and the
              final impression.
            </p>
          </div>
          <div
            className="full-image"
            style={
              {
                "--image":
                  "url('https://eventcom.vipmindslb.com/wp-content/uploads/2026/06/7-scaled.jpg')",
              } as React.CSSProperties
            }
          />
        </div>
      </section>

      <section id="approach" className="section services">
        <div className="services-heading">
          <div className="small-label">Our Method</div>
          <h2>From idea to impact.</h2>
        </div>
        <div className="grid-4">
          <div className="panel">
            <div className="panel-number">01</div>
            <h3>Insight</h3>
            <p>
              We understand the audience, the message, the brand, and the
              context.
            </p>
          </div>
          <div className="panel">
            <div className="panel-number">02</div>
            <h3>Concept</h3>
            <p>
              We turn the objective into a clear creative experience and
              narrative.
            </p>
          </div>
          <div className="panel">
            <div className="panel-number">03</div>
            <h3>Design</h3>
            <p>
              We shape space, content, decor, movement, and guest
              interaction.
            </p>
          </div>
          <div className="panel">
            <div className="panel-number">04</div>
            <h3>Execution</h3>
            <p>
              We manage production with planning, precision, and on-ground
              control.
            </p>
          </div>
        </div>
      </section>

      <section className="section how">
        <div className="small-label">What We Believe</div>
        <h2>Memorable events are built with intention.</h2>
        <p>
          A strong event is not about filling a room. It is about creating
          the right rhythm, the right emotion, and the right moment for the
          audience to remember.
        </p>
      </section>
    </>
  );
}
