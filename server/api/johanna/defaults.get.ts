import { requireAuth } from '../../utils/auth'
import { getEnv } from '../../utils/env'
import { activeTrip, sessionEnd, tripCount } from '../../utils/trips'

// Platzhalter-Daten fürs Startformular (#9): laufende Nummer und aktive Fahrt.
export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const env = getEnv(event)
  const [count, trip] = await Promise.all([tripCount(env), activeTrip(env)])
  return {
    nextNumber: count + 1,
    active: trip ? { name: trip.name, until: sessionEnd(trip.started_at) } : null,
  }
})
