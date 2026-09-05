import { PRODUCT, HIGHLIGHTS } from '../../lib/product'

export function Hero() {
  const off = Math.round((1 - PRODUCT.price / PRODUCT.compareAt) * 100)

  return (
    <section className="panel hero" id="hero" data-chapter="0">
      <div className="hero__inner">
        <div className="hero__meta rise">
          <img src="/img/logo.webp" alt="" width="26" height="26" />
          <span>ICE — second generation</span>
          <em>Bluetooth 6.0</em>
        </div>

        <h1 className="display display--hero hero__title rise">
          <span className="l1">Prime Pro</span>
          <span className="l2">ANC</span>
        </h1>

        <div className="hero__row rise">
          <div className="hero__copy">
            <p className="lede">{PRODUCT.summary}</p>
            <div className="price">
              <span className="price__now">Tk {PRODUCT.price.toLocaleString('en-US')}</span>
              <span className="price__was">Tk {PRODUCT.compareAt.toLocaleString('en-US')}</span>
              <span className="price__off">{off}% off</span>
            </div>
            <div className="buy__actions">
              <a className="btn" href="#buy">
                Buy now
              </a>
              <a className="btn btn--ghost" href="#specs">
                See the spec
              </a>
            </div>
          </div>
        </div>

        <div className="statstrip rise">
          {HIGHLIGHTS.map((h) => (
            <div className="statstrip__cell" key={h.label}>
              <p className="statstrip__v">
                {h.value}
                <em>{h.unit}</em>
              </p>
              <p className="statstrip__l">{h.label}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="scrollcue">
        Scroll <span />
      </p>
    </section>
  )
}
