import { Panel, Kicker } from '../Panel'
import { SPECS } from '../../lib/product'

export function SpecSheet() {
  return (
    <Panel id="specs" index={10} width="wide">
      <Kicker n={10}>Full specification</Kicker>
      <h2 className="display display--lg" style={{ marginBottom: '2.4rem' }}>
        Every number, in one place
      </h2>
      <div className="specs">
        {SPECS.map((g) => (
          <section className="specgroup" key={g.group}>
            <h3 className="specgroup__name">{g.group}</h3>
            <dl className="specgroup__rows">
              {g.rows.map(([k, v]) => (
                <div className="specrow" key={k}>
                  <dt>{k}</dt>
                  <i aria-hidden="true" />
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </Panel>
  )
}
