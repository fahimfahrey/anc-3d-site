/** One scroll chapter. `index` is both the rail position and the 3D beat. */
export function Panel({ id, index, side = 'left', width = 'default', className = '', children }) {
  const col =
    width === 'wide' ? 'col-wide' : width === 'full' ? 'col-full' : side === 'right' ? 'col-right' : 'col-left'
  return (
    <section className={`panel ${className}`} id={id} data-chapter={index}>
      <div className="panel__inner">
        <div className="grid12">
          <div className={`chapter rise ${col} ${side === 'right' ? 'chapter--right' : ''}`}>
            <div className="chapter__scrim" aria-hidden="true" />
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Kicker({ n, children }) {
  return (
    <p className="chapter__kicker">
      <i>{String(n).padStart(2, '0')}</i>
      {children}
    </p>
  )
}

export function Facts({ items }) {
  return (
    <dl className="chapter__facts">
      {items.map(([k, v]) => (
        <div className="chapter__fact" key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Metric({ n, unit }) {
  return (
    <p className="metric">
      <span className="stat-num metric__n">{n}</span>
      <span className="metric__u">{unit}</span>
    </p>
  )
}
