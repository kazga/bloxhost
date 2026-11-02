import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db-v2'
import { getEngine } from '@/lib/mc/engine'
import { getCurrentUser } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// POST /api/servers/[id]/restart
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const server = await db.server.findUnique({ where: { id } })
    if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 })

    const user = await getCurrentUser()

    const engine = getEngine()
    const result = await engine.restart({
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
      playitSecret: user?.playitSecret || null,
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
    })

    if (!result.ok) {
      return NextResponse.json({ error: result.error || 'Failed to restart server' }, { status: 400 })
    }

    await db.server.update({
      where: { id },
      data: { status: 'starting', players: 0 },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('POST /api/servers/[id]/restart error:', e)
    return NextResponse.json({ error: 'Failed to restart server' }, { status: 500 })
  }
}
