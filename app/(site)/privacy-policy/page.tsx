import type { Metadata } from "next";
import LegalContact from "@/components/LegalContact";

export const metadata: Metadata = {
  title: "Privacy Policy | Eventcom",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="page-hero legal-hero">
        <div className="page-hero-content">
          <div className="page-kicker">Legal</div>
          <h1 className="page-title">Privacy Policy</h1>
          <p className="page-intro">Last updated: September 16, 2026</p>
        </div>
      </section>

      <section className="section legal">
        <div className="legal-body">
          <p>
            At Eventcom, we respect your privacy and are committed to protecting
            any personal information you share with us through our website.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            When you visit our website or contact us, we may collect basic
            information such as:
          </p>
          <ul>
            <li>Your name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Company name</li>
            <li>Event details or inquiry information</li>
            <li>Any message or file you choose to send us</li>
          </ul>
          <p>
            We may also collect simple website usage data, such as pages
            visited, device type, browser type, and general location, to help us
            improve the website.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Reply to your inquiries</li>
            <li>Prepare proposals or follow up on requests</li>
            <li>Share information about our services</li>
            <li>Improve our website and communication</li>
            <li>Manage business records when needed</li>
          </ul>
          <p>We do not sell your personal information.</p>

          <h2>3. Sharing of Information</h2>
          <p>
            We may share your information only when needed with trusted
            partners, suppliers, or service providers who help us deliver our
            services, such as production teams, venues, logistics partners, or
            technical providers.
          </p>
          <p>We may also share information if required by law.</p>

          <h2>4. Cookies</h2>
          <p>
            Our website may use cookies or similar tools to improve the browsing
            experience and understand how visitors use the website. You can
            disable cookies through your browser settings.
          </p>

          <h2>5. Data Protection</h2>
          <p>
            We take reasonable steps to protect your information from
            unauthorized access, loss, or misuse. However, no online system is
            completely secure, so we cannot guarantee absolute security.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            You may contact us to request access to your personal information,
            correct it, or ask us to delete it, where applicable.
          </p>

          <h2>7. Contact Us</h2>
          <p>For any privacy-related questions, please contact us at:</p>
          <LegalContact />
        </div>
      </section>
    </>
  );
}
