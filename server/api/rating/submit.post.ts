import questions from '../../data/questions.json'
import pseudonyms from '../../data/pseudonyms.json'
import { createError, readBody } from 'h3'
import { getEnv } from '../../utils/env'
import { activeTrip, nowSeconds } from '../../utils/trips'

interface Answer { questionId: number, score: number }

// Speichert eine komplette Bewertung (5 Antworten) anonym mit Pseudonym (#6).
export default defineEventHandler(async (event) => {
  const env = getEnv(event)
  const body = await readBody<{ answers?: Answer[], characterIcon?: string }>(event)
  const answers = body?.answers

  const validIds = new Set(questions.map(q => q.id))
  const ok = Array.isArray(answers)
    && answers.length === 5
    && new Set(answers.map(a => a.questionId)).size === 5
    && answers.every(a => validIds.has(a.questionId) && [1, 2, 3].includes(a.score))
  if (!ok || !answers) {
    throw createError({ statusCode: 400, message: 'Ungültige Antworten' })
  }

  const trip = await activeTrip(env)
  if (!trip) {
    throw createError({ statusCode: 409, message: 'Gerade keine Fahrt aktiv' })
  }

  const p = body?.characterIcon === undefined
    ? pseudonyms[Math.floor(Math.random() * pseudonyms.length)]!
    : pseudonyms.find(character => character.icon === body.characterIcon)
  if (!p) {
    throw createError({ statusCode: 400, message: 'Ungültiger Charakter' })
  }
  const inserted = await env.driver_rating_db
    .prepare('INSERT INTO ratings (trip_id, created_at, alias, icon) VALUES (?, ?, ?, ?) RETURNING id')
    .bind(trip.id, nowSeconds(), p.alias, p.icon)
    .first()
  const ratingId = Number(inserted?.id)

  await env.driver_rating_db.batch(
    answers.map(a => env.driver_rating_db
      .prepare('INSERT INTO answers (rating_id, question_id, score) VALUES (?, ?, ?)')
      .bind(ratingId, a.questionId, a.score)),
  )

  return { alias: p.alias, icon: p.icon, emoji: p.emoji }
})
