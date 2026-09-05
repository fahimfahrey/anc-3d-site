import { CONTACT, FOOTER_LINKS, PRODUCT } from '../lib/product'

export function Footer() {
  return (
    <footer className="foot" id="contact">
      <div className="foot__inner">
        <div className="foot__grid">
          <div>
            <div className="foot__brand">
              <img src="/img/logo.webp" alt="" width="40" height="40" />
              <span className="nav__wordmark">
                ICE
                <span>Technology</span>
              </span>
            </div>
            <p className="copy" style={{ fontSize: 'var(--t-sm)' }}>
              Audio hardware built and serviced in Chattogram, sold across Bangladesh.
            </p>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.items.map((i) => (
                  <li key={i}>
                    <a href="#contact">{i}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4>Reach us</h4>
            <address>
              {CONTACT.address}
              <br />
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              <br />
              <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>{CONTACT.phone}</a>
            </address>
          </div>
        </div>

        <div className="foot__legal">
          <span>© {new Date().getFullYear()} ICE Technology</span>
          <span>Trade licence {CONTACT.license}</span>
          <span>
            {PRODUCT.name} {PRODUCT.edition}
          </span>
        </div>
      </div>
    </footer>
  )
}
