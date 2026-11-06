import { isAuthed } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  return { authenticated: await isAuthed(event) }
})
