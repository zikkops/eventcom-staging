import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">Eventcom</div>
          <p className="footer-copy">
            We shape the energy behind every event — creating experiences
            that connect, inspire, and leave a lasting impact.
          </p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <h4>Company</h4>
            <Link href="/about">About Us</Link>
            <Link href="/about#approach">Our Approach</Link>
            <Link href="/contact">Careers</Link>
            <Link href="/work">News</Link>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <Link href="/services#strategy">Strategy &amp; Concept</Link>
            <Link href="/services#production">Event Production</Link>
            <Link href="/services#creative">Design &amp; Creative</Link>
            <Link href="/services#guest">Guest Experience</Link>
          </div>
          <div className="footer-col">
            <h4>Work</h4>
            <Link href="/work">Featured Projects</Link>
            <Link href="/work#brand-work">Brand Portfolio</Link>
            <Link href="/contact">Client Stories</Link>
          </div>
          <div className="footer-col">
            <h4>Insights</h4>
            <Link href="/work">Articles</Link>
            <Link href="/work">Trends</Link>
            <Link href="/contact">Resources</Link>
          </div>
        </div>
        <div className="connect">
          <h4>Let&rsquo;s Connect</h4>
          <span>hello@eventcom.com</span>
          <span>+971 50 123 4567</span>
          <span>Dubai, UAE</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Eventcom. All rights reserved.</span>
        <div>
          <span>Privacy Policy</span>
          <span>Terms of Use</span>
        </div>
      </div>
    </footer>
  );
}
