/** The contact block that closes the Privacy Policy and the Terms of Use. */
export default function LegalContact() {
  return (
    <dl className="legal-contact">
      <div>
        <dt>Company</dt>
        <dd>Eventcom</dd>
      </div>
      <div>
        <dt>Email</dt>
        <dd>
          <a href="mailto:hello@eventcom-me.com">hello@eventcom-me.com</a>
        </dd>
      </div>
      <div>
        <dt>Phone</dt>
        <dd>
          <a href="tel:+966570116716">+966 57 011 6716</a>
        </dd>
      </div>
      <div>
        <dt>Address</dt>
        <dd>Beirut | Dubai | Abu Dhabi | Riyadh | Jeddah</dd>
      </div>
    </dl>
  );
}
