import { NAV, PRODUCT } from '../lib/product'

export function Nav() {
  return (
    <header className="nav">
      <a className="nav__brand" href="#hero">
        <img className="nav__logo" src="/img/logo.webp" alt="" width="34" height="34" />
        <span className="nav__wordmark">
          ICE
          <span>Prime Pro ANC</span>
        </span>
      </a>
      <nav className="nav__links" aria-label="Main">
        {NAV.map((n) => (
          <a key={n.label} href={n.href}>
            {n.label}
          </a>
        ))}
      </nav>
      <a className="btn" href="#buy">
        Buy now <b>Tk {PRODUCT.price.toLocaleString('en-US')}</b>
      </a>
    </header>
  )
}
