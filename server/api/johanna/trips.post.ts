import { createError, readBody } from 'h3'
import { requireAuth } from '../../utils/auth'
import { DEFAULT_PLACE, DRIVER_ID, SESSION_SECONDS, getEnv } from '../../utils/env'
import { nowSeconds, sessionEnd, tripCount } from '../../utils/trips'

interface TripInput {
  name?: string
  destination?: string
  city?: string
  comment?: string
  date?: string
}

// Startet eine neue Fahrt. Eine laufende Fahrt wird dadurch beendet (#9).
// Leere Felder bekommen den Platzhalter-Wert (Name: "Fahrt Nummer N", Ziel/Stadt: "Zu Hause").
export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const env = getEnv(event)
  const body = await readBody<TripInput>(event)

  const date = String(body?.date ?? '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw createError({ statusCode: 400, message: 'Hat nicht geklappt. Bitte nochmal tippen.' })
  }

  const clean = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max)
  const count = await tripCount(env)
  const number = count + 1
  const name = clean(body?.name, 80) || `Fahrt Nummer ${number}`
  const destination = clean(body?.destination, 80) || DEFAULT_PLACE
  const city = clean(body?.city, 80) || DEFAULT_PLACE
  const comment = clean(body?.comment, 200) || null

  const now = nowSeconds()
  try {
    const row = await env.driver_rating_db
      .prepare(`INSERT INTO trips (driver_id, name, destination, city, comment, date, started_at, active_until)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`)
      .bind(DRIVER_ID, name, destination, city, comment, date, now, now + SESSION_SECONDS)
      .first()
    return { id: row?.id, name, until: sessionEnd(now) }
  } catch {
    throw createError({ statusCode: 500, message: 'Hat nicht geklappt. Bitte nochmal tippen.' })
  }
})
