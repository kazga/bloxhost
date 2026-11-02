import { NextRequest, NextResponse } from 'next/server'
import { getPlayitAgent } from '@/lib/mc/playit'
import { getEngine } from '@/lib/mc/engine'
import { db } from '@/lib/db-v2'
import { getCurrentUser } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

// POST /api/playit/reset — full reset: cancel pending claim, stop running agent,
// clear the user's saved playit secret, and optionally start a fresh claim flow
// that surfaces a new https://playit.gg/claim/<code> URL in the console.
//
// Body: { serverId?: string, startNew?: boolean }
//   - serverId: required if startNew is true (so we can log into that server's console)
//   - startNew: if true, starts a fresh claim flow after the reset
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Sign in to reset playit' }, { status: 401 })

    const body = await req.json().catch(() => ({}))
    const { serverId, startNew } = body || {}

    const agent = getPlayitAgent()
    // Full reset: cancels pending claim + stops running agent
    agent.reset()

    // Clear the user's saved playit secret from the DB
    if (user.playitSecret) {
      await db.user.update({
        where: { id: user.id },
        data: { playitSecret: null },
      })
    }

    // Clear any persisted playitAddress on the user's servers
    if (serverId) {
      await db.server.update({
        where: { id: serverId },
        data: { playitAddress: null },
      })
      // Also clear it in the engine's in-memory state
      getEngine().setPlayitAddress(serverId, null)
    }

    // Optionally start a fresh claim flow
    let newClaim: { code: string; url: string } | null = null
    if (startNew && serverId) {
      const server = await db.server.findUnique({ where: { id: serverId } })
      if (server) {
        const engine = getEngine()
        newClaim = agent.startClaimFlow({
          log: (level, text) => {
            const state = engine.getState(serverId)
            if (state) {
              ;(engine as any).pushLine(state, level, text)
              ;(engine as any).emit(serverId)
            }
          },
          onComplete: async (secret, error) => {
            if (secret) {
              // Save the new secret to the user's account
              await db.user.update({ where: { id: user.id }, data: { playitSecret: secret } })
            }
          },
        })
      }
    }

    return NextResponse.json({
      ok: true,
      message: startNew
        ? 'Playit reset. A new claim URL has been generated.'
        : 'Playit reset. Start a server to generate a new claim URL.',
      newClaim,
    })
  } catch (e) {
    console.error('POST /api/playit/reset error:', e)
    return NextResponse.json({ error: 'Failed to reset playit' }, { status: 500 })
  }
}
