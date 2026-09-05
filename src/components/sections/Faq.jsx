import { FAQS } from '../../lib/product'

export function Faq() {
  return (
    <section className="panel" id="faq">
      <div className="panel__inner">
        <div className="grid12">
          <div className="chapter rise col-wide">
            <h2 className="display display--lg" style={{ marginBottom: '2rem' }}>
              Questions people ask
            </h2>
            <div className="faq">
              {FAQS.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
