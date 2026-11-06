import { createError } from 'h3'
import questions from '../../../data/questions.json'
import pseudonyms from '../../../data/pseudonyms.json'
import { requireAuth } from '../../../utils/auth'
import { getEnv } from '../../../utils/env'

// Detailansicht einer Fahrt (#10): Kopf der Fahrt, Bewertungen mit Pseudonym und Antworten.
export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = getEnv(event).driver_rating_db
  const id = Number(event.context.params?.id)
  if (!Number.isInteger(id)) throw createError({ statusCode: 404, message: 'Fahrt nicht gefunden' })

  const trip = await db.prepare('SELECT * FROM trips WHERE id = ?').bind(id).first()
  if (!trip) throw createError({ statusCode: 404, message: 'Fahrt nicht gefunden' })

  const ratings = (await db.prepare('SELECT id, created_at, alias, icon FROM ratings WHERE trip_id = ? ORDER BY created_at, id')
    .bind(id).all()).results as any[]
  const answers = (await db.prepare(`SELECT a.rating_id, a.question_id, a.score FROM answers a
      JOIN ratings r ON r.id = a.rating_id WHERE r.trip_id = ?`).bind(id).all()).results as any[]

  const textOf = new Map(questions.map(x => [x.id, x.text]))
  const emojiOf = new Map(pseudonyms.map(p => [p.icon, p.emoji]))
  const byRating = new Map<number, { questionId: number, text: string, score: number }[]>()
  for (const a of answers) {
    const list = byRating.get(a.rating_id) ?? []
    list.push({ questionId: Number(a.question_id), text: textOf.get(Number(a.question_id)) ?? '', score: Number(a.score) })
    byRating.set(a.rating_id, list)
  }

  const all = answers.map(a => Number(a.score))
  return {
    trip,
    avg: all.length ? all.reduce((s, x) => s + x, 0) / all.length : null,
    ratings: ratings.map(r => ({
      id: r.id,
      createdAt: r.created_at,
      alias: r.alias,
      emoji: emojiOf.get(r.icon) ?? '🙂',
      answers: byRating.get(r.id) ?? [],
    })),
  }
})
