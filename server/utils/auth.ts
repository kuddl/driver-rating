import { createError, deleteCookie, getCookie, setCookie, type H3Event } from 'h3'
import { getEnv, type Env } from './env'

// Anmeldung per Cookie, 30 Tage (#9). Das Cookie enthält einen HMAC-Token,
// nie das Passwort. Ändert sich das Secret, werden alle Cookies ungültig.
const COOKIE = 'jf_auth'
const MAX_AGE = 60 * 60 * 24 * 30

async function hmacHex(key: string, message: string): Promise<string> {
  const k = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(message))
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('')
}

function secretOrThrow(env: Env): string {
  if (!env.AUTH_PASSWORD) {
    throw createError({ statusCode: 500, message: 'AUTH_PASSWORD fehlt (wrangler secret put AUTH_PASSWORD)' })
  }
  return env.AUTH_PASSWORD
}

async function tokenFor(env: Env): Promise<string> {
  return hmacHex(secretOrThrow(env), 'johanna-auth-v1')
}

export async function checkPassword(event: H3Event, given: string): Promise<boolean> {
  const secret = secretOrThrow(getEnv(event))
  return (await hmacHex(secret, 'check')) === (await hmacHex(given, 'check'))
}

export async function login(event: H3Event): Promise<void> {
  const token = await tokenFor(getEnv(event))
  setCookie(event, COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export function logout(event: H3Event): void {
  deleteCookie(event, COOKIE, { path: '/' })
}

export async function isAuthed(event: H3Event): Promise<boolean> {
  const cookie = getCookie(event, COOKIE)
  if (!cookie) return false
  return cookie === (await tokenFor(getEnv(event)))
}

export async function requireAuth(event: H3Event): Promise<void> {
  if (!(await isAuthed(event))) {
    throw createError({ statusCode: 401, message: 'Nicht angemeldet' })
  }
}
