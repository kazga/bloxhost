import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

// GET /api/auth/me — returns the currently logged-in user (or null)
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ user: null })
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      playitSecret: user.playitSecret ? `${user.playitSecret.slice(0, 4)}…${user.playitSecret.slice(-4)}` : null,
      hasPlayit: Boolean(user.playitSecret),
    },
  })
}
