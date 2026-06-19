const selectStyle = {
  background: 'var(--panel-2)',
  border: '0.5px solid var(--border)',
  color: 'var(--text)',
  borderRadius: 8,
  padding: '8px 12px',
  fontSize: 13,
  cursor: 'pointer',
  outline: 'none',
}

export default function FilterBar({
  cities, city, setCity,
  priceCats, priceCategory, setPriceCategory,
  cuisines, cuisine, setCuisine,
  minRating, setMinRating,
}) {
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
      background: 'var(--panel)', border: '0.5px solid var(--border)',
      borderRadius: 12, padding: '14px 16px',
    }}>
      <Field label="City">
        <select style={selectStyle} value={city} onChange={e => setCity(e.target.value)}>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>

      <Field label="Price">
        <select style={selectStyle} value={priceCategory} onChange={e => setPriceCategory(e.target.value)}>
          {priceCats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>

      <Field label="Cuisine">
        <select style={selectStyle} value={cuisine} onChange={e => setCuisine(e.target.value)}>
          {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>

      <Field label={`Min rating: ${minRating.toFixed(1)}`}>
        <input
          type="range" min="0" max="5" step="0.1" value={minRating}
          onChange={e => setMinRating(parseFloat(e.target.value))}
          style={{ width: 140, accentColor: '#FC8019' }}
        />
      </Field>

      {(city !== 'All' || priceCategory !== 'All' || cuisine !== 'All' || minRating > 0) && (
        <button
          onClick={() => { setCity('All'); setPriceCategory('All'); setCuisine('All'); setMinRating(0) }}
          style={{
            background: 'transparent', border: '0.5px solid var(--border)',
            color: 'var(--text-muted)', borderRadius: 8, padding: '8px 12px',
            fontSize: 12, cursor: 'pointer', marginLeft: 'auto',
          }}
        >
          Reset filters
        </button>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</span>
      {children}
    </div>
  )
}
