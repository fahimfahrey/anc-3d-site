import { Panel, Kicker } from '../Panel'
import { PRODUCT, BOX, REVIEW } from '../../lib/product'

const SHOTS = [
  ['/img/black-5-cut.webp', 'Case open, buds seated'],
  ['/img/black-1-cut.webp', 'Left and right, stems out'],
  ['/img/black-3-cut.webp', 'Closed, front light bar'],
]

export function Buy() {
  const off = Math.round((1 - PRODUCT.price / PRODUCT.compareAt) * 100)

  return (
    <Panel id="buy" index={11} width="full">
      <Kicker n={11}>Order</Kicker>
      <div className="buy">
        <div className="buy__col">
          <h2 className="display display--lg">
            Prime Pro ANC, black
          </h2>
          <div className="buy__price">
            <span className="price__now">Tk {PRODUCT.price.toLocaleString('en-US')}</span>
            <span className="price__was">Tk {PRODUCT.compareAt.toLocaleString('en-US')}</span>
            <span className="price__off">{off}% off</span>
          </div>
          <p className="copy">
            Second generation, in black with the orange tray. Cash on delivery is available across
            Bangladesh, and every unit carries a {PRODUCT.warrantyMonths}-month replacement warranty.
          </p>

          <div className="buy__actions">
            <a
              className="btn btn--lg"
              href="https://iceworld.tech/products/ice-prime-pro-anc-black-2nd-gen"
              rel="noreferrer"
            >
              Buy now — Tk {PRODUCT.price.toLocaleString('en-US')}
            </a>
            <a className="btn btn--ghost btn--lg" href="#faq">
              Read the FAQ
            </a>
          </div>

          <ul className="trust">
            <li>{PRODUCT.warrantyMonths} months replacement warranty</li>
            <li>Cash on delivery</li>
            <li>{PRODUCT.customers} customers</li>
          </ul>

          <div className="review">
            <p className="review__stars" aria-label={`${REVIEW.stars} out of 5`}>
              {'★'.repeat(REVIEW.stars)}
            </p>
            <blockquote className="review__quote">
              “{REVIEW.text}”
              <br />
              <span className="review__by">{REVIEW.name}, verified buyer</span>
            </blockquote>
          </div>
          <div className="box">
            <h3>In the box</h3>
            <ul>
              {BOX.map((b, i) => (
                <li key={b}>
                  <b>{String(i + 1).padStart(2, '0')}</b>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="shots">
        {SHOTS.map(([src, cap]) => (
          <figure key={src}>
            <img src={src} alt={cap} loading="lazy" />
            <figcaption>{cap}</figcaption>
          </figure>
        ))}
      </div>
    </Panel>
  )
}
