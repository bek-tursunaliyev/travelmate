// GET /api/events → { events, source }.
// iTicket.uz has no public API. When you receive partner access, set ITICKET_API_URL (endpoint that
// lists events as JSON) and ITICKET_API_KEY, then adjust mapEvent() to their field names.
// Until then (or if the request fails) the site shows the events managed in the admin panel.

const TIMEOUT_MS = 8000

// Maps one iTicket record to the site's event shape. Field names are placeholders until the
// real API schema is known.
function mapEvent(e) {
  return {
    id: `iticket-${e.id}`,
    title: e.title || e.name,
    photo: e.image || e.poster || '',
    date: String(e.date || e.start_date || '').slice(0, 10),
    time: String(e.time || e.start_time || '').slice(0, 5),
    hall: e.hall || e.place || '',
    venueName: e.venue?.name || e.venue_name || '',
    venueCity: e.venue?.city || e.city || '',
    lat: Number(e.venue?.lat ?? e.lat) || null,
    lng: Number(e.venue?.lng ?? e.lng) || null,
    price: Number(e.min_price ?? e.price) || 0,
    seats: Number(e.available ?? e.seats) || 0,
    genre: e.category || e.genre || '',
    url: e.url || '',
  }
}

export async function GET() {
  const url = process.env.ITICKET_API_URL
  if (!url) return Response.json({ events: null, source: 'admin' })
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json', ...(process.env.ITICKET_API_KEY ? { Authorization: `Bearer ${process.env.ITICKET_API_KEY}` } : {}) },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    const list = Array.isArray(data) ? data : data.events || data.data || []
    return Response.json({ events: list.map(mapEvent).filter((e) => e.title), source: 'iticket' }, {
      headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' },
    })
  } catch {
    return Response.json({ events: null, source: 'admin', error: 'iTicket unavailable' })
  }
}
