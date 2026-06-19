const ACCENTS = {
  orange: '#FC8019',
  blue:   '#378ADD',
  teal:   '#1D9E75',
  amber:  '#EF9F27',
  purple: '#7F77DD',
}

export default function StatCard({ label, value, accent = 'orange' }) {
  return (
    <div style={{
      background: 'var(--panel)',
      border: '0.5px solid var(--border)',
      borderRadius: 12,
      padding: '14px 16px',
      borderLeft: `3px solid ${ACCENTS[accent]}`,
    }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
    </div>
  )
}
