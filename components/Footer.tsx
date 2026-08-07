import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            <Image
              src="/eventcom-logo.png"
              alt="Eventcom"
              width={196}
              height={40}
            />
          </div>
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
            <Link href="/work">Featured Projects</Link>
          </div>
        </div>
        <div className="connect">
          <h4>Let&rsquo;s Connect</h4>
          <span>eventcom-me.com</span>
          <span>elias.eid@eventcom-me.com</span>
          <span>+966 57 011 6716</span>
          <span>Beirut | Dubai | Abu Dhabi | Riyadh | Jeddah</span>
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
