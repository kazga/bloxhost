import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db-v2'
import { getEngine } from '@/lib/mc/engine'
import { getPlayitAgent, isPlayitInstalled } from '@/lib/mc/playit'
import { getCurrentUser } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

// GET /api/servers/[id]/tunnel — returns the playit tunnel info for this server
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const server = await db.server.findUnique({ where: { id } })
    if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 })

    const engine = getEngine()
    const stats = engine.getStats(id)
    const user = await getCurrentUser()
    const agent = getPlayitAgent()
    const agentStatus = agent.getStatus()
    const pendingClaim = agent.getPendingClaim()

    // If the claim flow just completed and we have a secret but the user doesn't
    // have one saved yet, persist it to their account
    if (pendingClaim?.status === 'completed' && pendingClaim.secret && user && !user.playitSecret) {
      await db.user.update({
        where: { id: user.id },
        data: { playitSecret: pendingClaim.secret },
      })
    }

    const tunnel = agent.getTunnelForPort(server.port)

    return NextResponse.json({
      installed: isPlayitInstalled(),
      agentStatus: agentStatus.status,
      agentError: agentStatus.lastError || null,
      userHasSecret: Boolean(user?.playitSecret),
      serverPort: server.port,
      tunnelAddress: stats?.playitAddress || tunnel?.assignedAddress || null,
      playitAddress: server.playitAddress || null,
      // Surface the pending claim URL so the website can show it prominently
      pendingClaim: pendingClaim ? {
        url: pendingClaim.url,
        status: pendingClaim.status,
        startedAt: pendingClaim.startedAt,
      } : null,
    })
  } catch (e) {
    console.error('GET /api/servers/[id]/tunnel error:', e)
    return NextResponse.json({ error: 'Failed to fetch tunnel info' }, { status: 500 })
  }
}

// POST /api/servers/[id]/tunnel — manually set the playit address for this server
// (used when the user creates the tunnel in the playit.gg dashboard and pastes it back)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { address } = body || {}
    if (!address || typeof address !== 'string') {
      return NextResponse.json({ error: 'address is required' }, { status: 400 })
    }
    const server = await db.server.findUnique({ where: { id } })
    if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 })

    await db.server.update({ where: { id }, data: { playitAddress: address } })
    const engine = getEngine()
    engine.setPlayitAddress(id, address)
    const agent = getPlayitAgent()
    agent.setTunnelAddress(server.port, address)

    return NextResponse.json({ ok: true, address })
  } catch (e) {
    console.error('POST /api/servers/[id]/tunnel error:', e)
    return NextResponse.json({ error: 'Failed to set tunnel address' }, { status: 500 })
  }
}
