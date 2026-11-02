// Simple session helpers using HTTP-only cookies with HMAC-signed user IDs.

import { cookies } from 'next/headers'
import { createHmac } from 'crypto'
import { db } from '@/lib/db-v2'
import bcrypt from 'bcryptjs'

const SESSION_COOKIE = 'blockhost_session'
const SECRET = process.env.SESSION_SECRET || 'blockhost-dev-secret-change-in-production-please'

// In-memory active-session tracker. Records the last-seen timestamp for each
// distinct user (or anonymous visitor). Entries older than SESSION_TTL_MS are
// pruned on read. Used by the /api/stats/system endpoint to show "users online".
const SESSION_TTL_MS = 5 * 60 * 1000 // 5 minutes
const activeSessions = new Map<string, number>() // key: userId or 'anon:<ip>', value: lastSeenMs

function touchSession(userId: string | null, ip: string | null) {
  const key = userId || (ip ? `anon:${ip}` : 'anon:unknown')
  activeSessions.set(key, Date.now())
}

// Returns the count of sessions seen in the last SESSION_TTL_MS, pruned.
export function getActiveSessionCount(): number {
  const now = Date.now()
  let count = 0
  for (const [key, lastSeen] of activeSessions.entries()) {
    if (now - lastSeen > SESSION_TTL_MS) {
      activeSessions.delete(key)
    } else {
      count++
    }
  }
  return count
}

function sign(value: string): string {
  return createHmac('sha256', SECRET).update(value).digest('hex').slice(0, 32)
}

function makeToken(userId: string): string {
  return `${userId}.${sign(userId)}`
}

function verifyToken(token: string): string | null {
  if (!token || typeof token !== 'string') return null
  const idx = token.lastIndexOf('.')
  if (idx < 1) return null
  const userId = token.slice(0, idx)
  const sig = token.slice(idx + 1)
  if (sign(userId) !== sig) return null
  return userId
}

function getClientIp(req?: any): string | null {
  // Try common headers (Caddy sets X-Forwarded-For)
  const headers = req?.headers
  if (headers) {
    const xff = headers.get?.('x-forwarded-for') || headers['x-forwarded-for']
    if (xff) return String(xff).split(',')[0].trim()
    const xri = headers.get?.('x-real-ip') || headers['x-real-ip']
    if (xri) return String(xri)
  }
  return null
}

export async function getCurrentUser(req?: any): Promise<{ id: string; email: string; name: string; playitSecret: string | null } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  let userId: string | null = null
  if (token) {
    userId = verifyToken(token)
  }
  // Touch the session tracker for every authenticated request
  touchSession(userId, getClientIp(req))
  if (!userId) return null
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, playitSecret: true },
  })
  if (!user) return null
  return user
}

export async function setSessionCookie(userId: string) {
  touchSession(userId, null)
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, makeToken(userId), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function login(email: string, password: string): Promise<{ ok: boolean; error?: string; user?: { id: string; email: string; name: string } }> {
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user) return { ok: false, error: 'Invalid email or password' }
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return { ok: false, error: 'Invalid email or password' }
  await setSessionCookie(user.id)
  return { ok: true, user: { id: user.id, email: user.email, name: user.name } }
}
