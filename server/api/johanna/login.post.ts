import { createError, readBody } from 'h3'
import { checkPassword, login } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ password?: string }>(event)
  const password = String(body?.password ?? '')
  if (!password || !(await checkPassword(event, password))) {
    throw createError({ statusCode: 401, message: 'Das passt nicht. Nochmal versuchen.' })
  }
  await login(event)
  return { ok: true }
})
