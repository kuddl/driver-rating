import { getEnv } from '../../utils/env'
import { activeTrip, sessionEnd } from '../../utils/trips'

export default defineEventHandler(async (event) => {
  const trip = await activeTrip(getEnv(event))
  if (!trip) return { active: false }
  return { active: true, until: sessionEnd(trip.started_at) }
})
