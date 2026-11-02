import { NextRequest, NextResponse } from 'next/server'
import { getEngine } from '@/lib/mc/engine'
import { db } from '@/lib/db-v2'

export const dynamic = 'force-dynamic'

// GET /api/servers/[id]/stats - returns live CPU/RAM/players/uptime/status
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const server = await db.server.findUnique({ where: { id } })
    if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 })

    const engine = getEngine()
    const stats = engine.getStats(id)
    if (!stats) {
      return NextResponse.json({
        cpu: server.cpu,
        ram: server.ram,
        players: server.players,
        uptime: server.uptime,
        status: server.status,
        tickRate: 0,
        members: [],
      })
    }
    return NextResponse.json(stats)
  } catch (e) {
    console.error('GET /api/servers/[id]/stats error:', e)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
