import questions from '../../data/questions.json'
import pseudonyms from '../../data/pseudonyms.json'
import { getEnv } from '../../utils/env'
import { activeTrip } from '../../utils/trips'
import { createError } from 'h3'

// Zieht 5 zufällige Fragen aus dem Pool (#6/#10). Nur bei aktiver Fahrt.
export default defineEventHandler(async (event) => {
  const trip = await activeTrip(getEnv(event))
  if (!trip) {
    throw createError({ statusCode: 409, message: 'Gerade keine Fahrt aktiv' })
  }
  const pool = [...questions]
  const picked: { id: number, text: string }[] = []
  while (picked.length < 5 && pool.length) {
    picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]!)
  }
  const character = pseudonyms[Math.floor(Math.random() * pseudonyms.length)]!
  return { questions: picked, character }
})
