import type { Metadata } from "next";
import LegalContact from "@/components/LegalContact";

export const metadata: Metadata = {
  title: "Terms of Use | Eventcom",
};

export default function TermsOfUsePage() {
  return (
    <>
      <section className="page-hero legal-hero">
        <div className="page-hero-content">
          <div className="page-kicker">Legal</div>
          <h1 className="page-title">Terms of Use</h1>
          <p className="page-intro">Last updated: September 16, 2026</p>
        </div>
      </section>

      <section className="section legal">
        <div className="legal-body">
          <p>
            Welcome to the Eventcom website. By using this website, you agree to
            the terms below.
          </p>

          <h2>1. Website Use</h2>
          <p>
            This website is created to present Eventcom’s services, projects,
            and contact information. You agree to use it in a respectful and
            lawful way.
          </p>

          <h2>2. Content Ownership</h2>
          <p>
            All content on this website, including text, images, videos,
            designs, logos, and project visuals, belongs to Eventcom or is used
            with permission.
          </p>
          <p>
            You may not copy, reuse, publish, or edit any content from this
            website without written approval from Eventcom.
          </p>

          <h2>3. Project Images and References</h2>
          <p>
            The projects, brand references, and images shown on the website are
            used to present Eventcom’s work and experience. They do not create
            any partnership, endorsement, or official relationship unless
            clearly stated.
          </p>

          <h2>4. Information Accuracy</h2>
          <p>
            We do our best to keep the website information accurate and updated.
            However, some details may change from time to time, and we may
            update or remove content without prior notice.
          </p>

          <h2>5. External Links</h2>
          <p>
            Our website may include links to other websites or platforms.
            Eventcom is not responsible for the content, privacy practices, or
            services of third-party websites.
          </p>

          <h2>6. Limitation of Responsibility</h2>
          <p>
            Eventcom is not responsible for any direct or indirect loss resulting
            from the use of this website or reliance on its content.
          </p>

          <h2>7. Contact</h2>
          <p>For any questions about these Terms of Use, please contact us at:</p>
          <LegalContact />
        </div>
      </section>
    </>
  );
}
