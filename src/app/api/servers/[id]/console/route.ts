import { NextRequest, NextResponse } from 'next/server'
import { getEngine, ServerOpts } from '@/lib/mc/engine'
import { db } from '@/lib/db-v2'

export const dynamic = 'force-dynamic'

// GET /api/servers/[id]/console?since=<timestamp>
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const url = new URL(req.url)
    const sinceParam = url.searchParams.get('since')
    const since = sinceParam ? Number(sinceParam) : 0

    const server = await db.server.findUnique({ where: { id } })
    if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 })

    const engine = getEngine()
    const opts: ServerOpts = {
      id: server.id,
      name: server.name,
      type: server.type,
      version: server.version,
      ramMax: server.ramMax,
      maxPlayers: server.maxPlayers,
      motd: server.motd,
      difficulty: server.difficulty,
      gamemode: server.gamemode,
      pvp: server.pvp,
      whitelist: server.whitelist,
      port: server.port,
      levelType: server.levelType,
      levelSeed: server.levelSeed,
      generateStructures: server.generateStructures,
      viewDistance: server.viewDistance,
      simulationDistance: server.simulationDistance,
      spawnProtection: server.spawnProtection,
      maxWorldSize: server.maxWorldSize,
      maxTickTime: server.maxTickTime,
      hardcore: server.hardcore,
      allowNether: server.allowNether,
      allowFlight: server.allowFlight,
      enableCommandBlock: server.enableCommandBlock,
      enforceSecureProfile: server.enforceSecureProfile,
      onlineMode: server.onlineMode,
      resourcePack: server.resourcePack,
      resourcePackSha1: server.resourcePackSha1,
      requireResourcePack: server.requireResourcePack,
    }
    engine.register(opts)

    const lines = engine.getConsoleSince(id, since)
    const stats = engine.getStats(id)

    return NextResponse.json({
      lines,
      status: stats?.status || server.status,
      stats: stats || {
        cpu: server.cpu,
        ram: server.ram,
        players: server.players,
        uptime: server.uptime,
        status: server.status,
        tickRate: 0,
        members: [],
        playitAddress: server.playitAddress,
        javaVersion: 17,
      },
      serverTs: Date.now(),
    })
  } catch (e) {
    console.error('GET /api/servers/[id]/console error:', e)
    return NextResponse.json({ error: 'Failed to fetch console' }, { status: 500 })
  }
}
