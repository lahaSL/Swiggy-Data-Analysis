export default function TopList({ items }) {
  const max = Math.max(...items.map(i => i.value), 1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item, i) => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6, background: 'var(--panel-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, color: 'var(--text-muted)', flexShrink: 0,
          }}>{i + 1}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.label}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.sub} · {item.meta}</div>
          </div>
          <div style={{ width: 100, flexShrink: 0 }}>
            <div style={{ height: 6, borderRadius: 3, background: 'var(--panel-2)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 3, background: '#FC8019',
                width: `${(item.value / max) * 100}%`,
              }} />
            </div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, width: 32, textAlign: 'right' }}>{item.value.toFixed(1)}</div>
        </div>
      ))}
    </div>
  )
}
