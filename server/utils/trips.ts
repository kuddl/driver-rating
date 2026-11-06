import { DRIVER_ID, SESSION_SECONDS, type Env } from './env'

export interface TripRow {
  id: number
  driver_id: number
  name: string
  destination: string
  city: string
  comment: string | null
  date: string
  started_at: number
  active_until: number
}

export function nowSeconds(): number {
  return Math.floor(Date.now() / 1000)
}

// Die neueste Fahrt ist die einzige, die aktiv sein kann (neue Fahrt beendet die laufende, #9).
export async function activeTrip(env: Env): Promise<TripRow | null> {
  const row = await env.driver_rating_db
    .prepare('SELECT * FROM trips WHERE driver_id = ? AND active_until > ? ORDER BY started_at DESC, id DESC LIMIT 1')
    .bind(DRIVER_ID, nowSeconds())
    .first()
  if (row) return row as TripRow
  if (!import.meta.dev) return null

  const now = nowSeconds()
  const dummy = await env.driver_rating_db
    .prepare(`INSERT INTO trips (id, driver_id, name, destination, city, comment, date, started_at, active_until)
              VALUES (-1, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET date = excluded.date,
                started_at = excluded.started_at, active_until = excluded.active_until
              RETURNING *`)
    .bind(DRIVER_ID, 'Dummy-Fahrt', 'Testziel', 'Teststadt', 'Lokale Entwicklung',
      new Date().toISOString().slice(0, 10), now, sessionEnd(now))
    .first()
  return dummy as TripRow
}

export async function tripCount(env: Env): Promise<number> {
  const row = await env.driver_rating_db
    .prepare('SELECT COUNT(*) AS n FROM trips WHERE driver_id = ?')
    .bind(DRIVER_ID)
    .first()
  return Number(row?.n ?? 0)
}

export function sessionEnd(startedAt: number): number {
  return startedAt + SESSION_SECONDS
}
