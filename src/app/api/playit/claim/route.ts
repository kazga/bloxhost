import { NextResponse } from 'next/server'
import { getPlayitAgent } from '@/lib/mc/playit'
import { getEngine } from '@/lib/mc/engine'
import { db } from '@/lib/db-v2'
import { getCurrentUser } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

// POST /api/playit/claim — start a playit claim flow that surfaces the URL in
// the Minecraft server's console. Body: { serverId: string }
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: 'Sign in to set up playit.gg' }, { status: 401 })
    const body = await req.json()
    const { serverId } = body || {}
    if (!serverId) return NextResponse.json({ error: 'serverId is required' }, { status: 400 })

    const server = await db.server.findUnique({ where: { id: serverId } })
    if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 })

    // If user already has a secret, just start the agent with it
    if (user.playitSecret) {
      const agent = getPlayitAgent()
      const result = agent.ensureRunning(user.playitSecret)
      if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })
      return NextResponse.json({ ok: true, message: 'Agent started with existing secret' })
    }

    // Otherwise start a fresh claim flow
    const engine = getEngine()
    const agent = getPlayitAgent()
    const claim = agent.startClaimFlow({
      log: (level, text) => {
        const state = engine.getState(serverId)
        if (state) {
          ;(engine as any).pushLine(state, level, text)
          ;(engine as any).emit(serverId)
        }
      },
      onComplete: async (secret, error) => {
        if (secret) {
          // Save the secret to the user's account so it persists across sessions
          await db.user.update({ where: { id: user.id }, data: { playitSecret: secret } })
        }
      },
    })
    return NextResponse.json({ ok: true, code: claim.code, url: claim.url })
  } catch (e) {
    console.error('POST /api/playit/claim error:', e)
    return NextResponse.json({ error: 'Failed to start claim flow' }, { status: 500 })
  }
}
