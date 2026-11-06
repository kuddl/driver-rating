import { getQuery } from 'h3'
import questions from '../../data/questions.json'
import { requireAuth } from '../../utils/auth'
import { DRIVER_ID, getEnv } from '../../utils/env'

// Dashboard (#10): Gesamtergebnis, Durchschnitt pro Frage, Top/Flop 5, Pseudonym-Ranglisten,
// Fahrtenliste. Filter: ?month=YYYY-MM und ?trip=ID (beide optional, wirken zusammen).
export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = getEnv(event).driver_rating_db
  const q = getQuery<{ month?: string, trip?: string }>(event)
  const month = /^\d{4}-\d{2}$/.test(q.month ?? '') ? q.month! : ''
  const trip = /^\d+$/.test(q.trip ?? '') ? Number(q.trip) : null

  // Filter für Bewertungen (über Antworten -> Bewertung -> Fahrt)
  const rConds: string[] = []
  const rArgs: unknown[] = []
  if (month) { rConds.push(`strftime('%Y-%m', r.created_at, 'unixepoch') = ?`); rArgs.push(month) }
  if (trip !== null) { rConds.push('r.trip_id = ?'); rArgs.push(trip) }
  const rWhere = rConds.length ? `WHERE ${rConds.join(' AND ')}` : ''
  const fromRatings = 'FROM answers a JOIN ratings r ON r.id = a.rating_id'

  const totals = await db.prepare(`SELECT COUNT(DISTINCT r.id) AS ratings, COUNT(DISTINCT r.trip_id) AS trips, AVG(a.score) AS avg ${fromRatings} ${rWhere}`)
    .bind(...rArgs).first()

  const perQ = await db.prepare(`SELECT a.question_id AS id, AVG(a.score) AS avg, COUNT(*) AS n ${fromRatings} ${rWhere} GROUP BY a.question_id`)
    .bind(...rArgs).all()
  const textOf = new Map(questions.map(x => [x.id, x.text]))
  const perQuestion = (perQ.results as any[])
    .map(r => ({ id: Number(r.id), text: textOf.get(Number(r.id)) ?? '', avg: Number(r.avg), n: Number(r.n) }))
    .sort((a, b) => a.id - b.id)
  const byBest = [...perQuestion].sort((a, b) => b.avg - a.avg || a.id - b.id)
  const top = byBest.slice(0, 5)
  const flop = [...byBest].reverse().slice(0, 5)

  // Pseudonym-Ranglisten: Durchschnitt pro Pseudonym, ab 2 Bewertungen
  const pseudo = await db.prepare(`SELECT r.alias, r.icon, AVG(a.score) AS avg, COUNT(DISTINCT r.id) AS n ${fromRatings} ${rWhere} GROUP BY r.alias, r.icon HAVING n >= 2`)
    .bind(...rArgs).all()
  const pseudoRows = (pseudo.results as any[]).map(r => ({ alias: r.alias, icon: r.icon, avg: Number(r.avg), n: Number(r.n) }))
  const fans = [...pseudoRows].sort((a, b) => b.avg - a.avg).slice(0, 3)
  const critics = [...pseudoRows].sort((a, b) => a.avg - b.avg).slice(0, 3)

  // Fahrtenliste: Filter Monat über das Fahrtdatum, Fahrt über die ID
  const tConds = ['t.driver_id = ?']
  const tArgs: unknown[] = [DRIVER_ID]
  if (month) { tConds.push('substr(t.date, 1, 7) = ?'); tArgs.push(month) }
  if (trip !== null) { tConds.push('t.id = ?'); tArgs.push(trip) }
  const trips = await db.prepare(`SELECT t.id, t.name, t.destination, t.city, t.date, t.started_at,
      COUNT(r.id) AS ratings
    FROM trips t LEFT JOIN ratings r ON r.trip_id = t.id
    WHERE ${tConds.join(' AND ')}
    GROUP BY t.id ORDER BY t.started_at DESC`)
    .bind(...tArgs).all()

  const months = await db.prepare(`SELECT DISTINCT substr(date, 1, 7) AS m FROM trips WHERE driver_id = ? ORDER BY m DESC`)
    .bind(DRIVER_ID).all()
  const allTrips = await db.prepare(`SELECT id, name FROM trips WHERE driver_id = ? ORDER BY started_at DESC`)
    .bind(DRIVER_ID).all()

  return {
    totals: {
      ratings: Number(totals?.ratings ?? 0),
      trips: Number(totals?.trips ?? 0),
      avg: totals?.avg == null ? null : Number(totals.avg),
    },
    perQuestion,
    top,
    flop,
    fans,
    critics,
    trips: trips.results,
    filters: {
      months: (months.results as any[]).map(m => m.m).filter(Boolean),
      trips: allTrips.results,
    },
  }
})
