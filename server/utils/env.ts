import { createError, type H3Event } from 'h3'

// Bindings aus wrangler.jsonc und Secrets (wrangler secret put AUTH_PASSWORD)
export interface Env {
  driver_rating_db: any
  AUTH_PASSWORD?: string
}

export function getEnv(event: H3Event): Env {
  const env = (event.context as any).cloudflare?.env as Env | undefined
  if (!env?.driver_rating_db) {
    throw createError({ statusCode: 500, message: 'D1-Binding driver_rating_db fehlt' })
  }
  return env
}

export const DRIVER_ID = 1 // Johanna, einzige Fahrerin (Startscreen mit Auswahl ist offen)
export const SESSION_SECONDS = 15 * 60 // fest ab Start, siehe #9
export const DEFAULT_PLACE = 'Zu Hause'
