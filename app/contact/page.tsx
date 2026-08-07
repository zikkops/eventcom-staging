import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Eventcom",
};

export default function ContactPage() {
  return (
    <>
      <section
        className="page-hero"
        style={
          {
            "--hero-image":
              "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1800&auto=format&fit=crop')",
          } as React.CSSProperties
        }
      >
        <div className="page-hero-content">
          <div className="page-kicker">Contact</div>
          <h1 className="page-title">Let&rsquo;s build your next event.</h1>
          <p className="page-intro">
            Share the event type, audience, objective, date, and location.
            Eventcom will shape the right creative and production direction.
          </p>
        </div>
      </section>

      <section className="section approach">
        <div className="grid-2">
          <div className="page-copy">
            <div className="small-label">Start a Conversation</div>
            <h2>Tell us what you want to create.</h2>
            <p>
              Whether you have a clear brief or only an early idea, we can
              help structure the concept, guest journey, timeline, and
              execution plan.
            </p>
            <div className="info-list">
              <div>
                <strong>Website</strong>
                <span>eventcom-me.com</span>
              </div>
              <div>
                <strong>Email</strong>
                <span>elias.eid@eventcom-me.com</span>
              </div>
              <div>
                <strong>Mobile</strong>
                <span>+966 57 011 6716</span>
              </div>
              <div>
                <strong>Location</strong>
                <span>Beirut | Dubai | Abu Dhabi | Riyadh | Jeddah</span>
              </div>
            </div>
          </div>
          <form
            className="contact-form"
            action="mailto:elias.eid@eventcom-me.com"
            method="post"
            encType="text/plain"
          >
            <input type="text" name="name" placeholder="Full Name" required />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
            />
            <input type="text" name="company" placeholder="Company / Brand" />
            <textarea name="message" placeholder="Tell us about your event" />
            <button className="btn btn-pink" type="submit">
              Send Request
            </button>
          </form>
        </div>
      </section>

      <section className="section contact">
        <div>
          <div className="small-label" style={{ color: "var(--cyan)" }}>
            Next Step
          </div>
          <h2>We turn the brief into a clear event direction.</h2>
          <p>
            After receiving your request, the next step is to define the
            audience, event objective, guest journey, and production needs.
          </p>
        </div>
      </section>
    </>
  );
}
