import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter, LineChart, Line, Legend,
} from 'recharts'
import restaurantsRaw from './restaurants.json'
import ordersRaw from './orders.json'
import StatCard from './components/StatCard.jsx'
import FilterBar from './components/FilterBar.jsx'
import TopList from './components/TopList.jsx'

const COLORS = ['#FC8019', '#1D9E75', '#378ADD', '#EF9F27', '#7F77DD', '#E24B4A', '#5DCAA5', '#D4537E']

function uniqueSorted(arr) {
  return [...new Set(arr)].sort()
}

export default function App() {
  const [city, setCity] = useState('All')
  const [priceCategory, setPriceCategory] = useState('All')
  const [cuisine, setCuisine] = useState('All')
  const [minRating, setMinRating] = useState(0)

  const cities = useMemo(() => ['All', ...uniqueSorted(restaurantsRaw.map(r => r.city))], [])
  const priceCats = useMemo(() => ['All', ...uniqueSorted(restaurantsRaw.map(r => r.price_category))], [])
  const cuisines = useMemo(() => {
    const all = new Set()
    restaurantsRaw.forEach(r => r.cuisine.split(', ').forEach(c => all.add(c)))
    return ['All', ...[...all].sort()]
  }, [])

  const filteredRest = useMemo(() => {
    return restaurantsRaw.filter(r => {
      if (city !== 'All' && r.city !== city) return false
      if (priceCategory !== 'All' && r.price_category !== priceCategory) return false
      if (cuisine !== 'All' && !r.cuisine.includes(cuisine)) return false
      if (r.rating < minRating) return false
      return true
    })
  }, [city, priceCategory, cuisine, minRating])

  const filteredRestIds = useMemo(() => new Set(filteredRest.map(r => r.restaurant_id)), [filteredRest])
  const filteredOrders = useMemo(() => ordersRaw.filter(o => filteredRestIds.has(o.restaurant_id)), [filteredRestIds])

  // ── Aggregations ──────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const gmv = filteredOrders.reduce((s, o) => s + o.final_amount, 0)
    const avgRating = filteredRest.length
      ? filteredRest.reduce((s, r) => s + r.rating, 0) / filteredRest.length
      : 0
    const avgDelivery = filteredRest.length
      ? filteredRest.reduce((s, r) => s + r.avg_delivery_time, 0) / filteredRest.length
      : 0
    return {
      restaurants: filteredRest.length,
      orders: filteredOrders.length,
      gmv,
      avgRating,
      avgDelivery,
    }
  }, [filteredRest, filteredOrders])

  const cityChartData = useMemo(() => {
    const map = {}
    filteredRest.forEach(r => {
      if (!map[r.city]) map[r.city] = { city: r.city, restaurants: 0, ratingSum: 0 }
      map[r.city].restaurants += 1
      map[r.city].ratingSum += r.rating
    })
    return Object.values(map)
      .map(d => ({ city: d.city, restaurants: d.restaurants, avgRating: +(d.ratingSum / d.restaurants).toFixed(2) }))
      .sort((a, b) => b.restaurants - a.restaurants)
      .slice(0, 10)
  }, [filteredRest])

  const cuisineChartData = useMemo(() => {
    const map = {}
    filteredOrders.forEach(o => {
      map[o.cuisine] = (map[o.cuisine] || 0) + 1
    })
    return Object.entries(map)
      .map(([cuisine, orders]) => ({ cuisine, orders }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 8)
  }, [filteredOrders])

  const priceCatPie = useMemo(() => {
    const map = {}
    filteredRest.forEach(r => { map[r.price_category] = (map[r.price_category] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [filteredRest])

  const scatterData = useMemo(() => {
    return filteredRest.slice(0, 600).map(r => ({
      cost: r.avg_cost_two,
      rating: r.rating,
      category: r.price_category,
    }))
  }, [filteredRest])

  const monthlyTrend = useMemo(() => {
    const map = {}
    filteredOrders.forEach(o => {
      const month = o.order_date.slice(0, 7)
      map[month] = (map[month] || 0) + o.final_amount
    })
    return Object.entries(map)
      .map(([month, gmv]) => ({ month, gmv: Math.round(gmv / 1000) }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }, [filteredOrders])

  const topRestaurants = useMemo(() => {
    return [...filteredRest]
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 8)
      .map(r => ({ label: r.name, sub: `${r.city} · ${r.cuisine.split(', ')[0]}`, value: r.rating, meta: `${r.votes.toLocaleString()} votes` }))
  }, [filteredRest])

  return (
    <div>
      <header style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: 'var(--orange)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 18, color: '#0F1117'
          }}>S</div>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>Restaurant Analytics Dashboard</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          Interactive analysis of 2,000 restaurants &amp; 12,000 orders across 10 Indian cities (2023–2024)
        </p>
      </header>

      <FilterBar
        cities={cities} city={city} setCity={setCity}
        priceCats={priceCats} priceCategory={priceCategory} setPriceCategory={setPriceCategory}
        cuisines={cuisines} cuisine={cuisine} setCuisine={setCuisine}
        minRating={minRating} setMinRating={setMinRating}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, margin: '20px 0 28px' }}>
        <StatCard label="Restaurants" value={stats.restaurants.toLocaleString()} accent="orange" />
        <StatCard label="Orders" value={stats.orders.toLocaleString()} accent="blue" />
        <StatCard label="GMV" value={`₹${(stats.gmv / 100000).toFixed(1)}L`} accent="teal" />
        <StatCard label="Avg rating" value={stats.avgRating.toFixed(2)} accent="amber" />
        <StatCard label="Avg delivery" value={`${Math.round(stats.avgDelivery)} min`} accent="purple" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 16 }}>

        <Panel title="Top cities by restaurant count">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cityChartData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3040" horizontal={false} />
              <XAxis type="number" stroke="#8B92A3" fontSize={11} />
              <YAxis type="category" dataKey="city" stroke="#8B92A3" fontSize={11} width={90} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="restaurants" fill="#FC8019" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Top cuisines by orders">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cuisineChartData} margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3040" vertical={false} />
              <XAxis dataKey="cuisine" stroke="#8B92A3" fontSize={10} angle={-30} textAnchor="end" height={60} interval={0} />
              <YAxis stroke="#8B92A3" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="orders" fill="#1D9E75" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Price category split">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={priceCatPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}
                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                   labelLine={false} fontSize={11}>
                {priceCatPie.map((entry, i) => <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Cost vs rating">
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ left: 0, right: 20, top: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3040" />
              <XAxis type="number" dataKey="cost" name="Cost for two" stroke="#8B92A3" fontSize={11} unit="₹" />
              <YAxis type="number" dataKey="rating" name="Rating" stroke="#8B92A3" fontSize={11} domain={[1, 5]} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={scatterData} fill="#7F77DD" opacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Monthly GMV trend (₹ thousands)" span={2}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyTrend} margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3040" />
              <XAxis dataKey="month" stroke="#8B92A3" fontSize={10} />
              <YAxis stroke="#8B92A3" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="gmv" stroke="#FC8019" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Most-voted restaurants" span={2}>
          <TopList items={topRestaurants} valueLabel="rating" />
        </Panel>

      </div>

      <footer style={{ marginTop: 40, paddingTop: 20, borderTop: '0.5px solid var(--border)', color: 'var(--text-muted)', fontSize: 12, textAlign: 'center' }}>
        Built by Sharat Laha · Data Analyst &amp; M.Tech Data Science Candidate ·
        {' '}<a href="https://github.com/sololevellingg/Files-v1" style={{ color: 'var(--orange)' }}>GitHub</a>
        {' '}·{' '}
        <a href="https://linkedin.com/in/sharatlaha" style={{ color: 'var(--orange)' }}>LinkedIn</a>
      </footer>
    </div>
  )
}

function Panel({ title, children, span }) {
  return (
    <div style={{
      background: 'var(--panel)', border: '0.5px solid var(--border)',
      borderRadius: 12, padding: '16px 18px',
      gridColumn: span ? `span ${span}` : undefined
    }}>
      <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: 'var(--text)' }}>{title}</h3>
      {children}
    </div>
  )
}

const tooltipStyle = {
  background: '#1E232E', border: '1px solid #2A3040', borderRadius: 8,
  fontSize: 12, color: '#E8EAED',
}
