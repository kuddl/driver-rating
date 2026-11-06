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
  return (row as TripRow | null) ?? null
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
