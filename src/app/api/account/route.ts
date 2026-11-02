import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/session'
import { db } from '@/lib/db-v2'
import { getPlayitAgent } from '@/lib/mc/playit'

export const dynamic = 'force-dynamic'

// GET /api/account — returns the current user's profile
export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const agent = getPlayitAgent()
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      playitSecret: user.playitSecret || '',
      hasPlayit: Boolean(user.playitSecret),
      playitMasked: user.playitSecret ? `${user.playitSecret.slice(0, 4)}…${user.playitSecret.slice(-4)}` : null,
    },
    playit: agent.getStatus(),
  })
}

// PATCH /api/account — update profile (currently just playitSecret)
export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  try {
    const body = await req.json()
    const { playitSecret, name } = body || {}
    const data: any = {}
    if (typeof playitSecret === 'string') {
      // Empty string clears the secret
      data.playitSecret = playitSecret.trim() || null
    }
    if (typeof name === 'string' && name.trim().length >= 2) {
      data.name = name.trim()
    }
    const updated = await db.user.update({ where: { id: user.id }, data })

    // If a playit secret was set, ensure the agent is running with it
    if (data.playitSecret) {
      const agent = getPlayitAgent()
      agent.ensureRunning(data.playitSecret)
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        hasPlayit: Boolean(updated.playitSecret),
        playitMasked: updated.playitSecret ? `${updated.playitSecret.slice(0, 4)}…${updated.playitSecret.slice(-4)}` : null,
      },
    })
  } catch (e) {
    console.error('PATCH /api/account error:', e)
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 })
  }
}
