import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db-v2'

export const dynamic = 'force-dynamic'

// GET /api/servers/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const server = await db.server.findUnique({ where: { id } })
    if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 })
    return NextResponse.json({ server })
  } catch (e) {
    console.error('GET /api/servers/[id] error:', e)
    return NextResponse.json({ error: 'Failed to fetch server' }, { status: 500 })
  }
}

// DELETE /api/servers/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const server = await db.server.findUnique({ where: { id } })
    if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 })

    // Stop the engine process if running
    const { getEngine } = await import('@/lib/mc/engine')
    getEngine().stop(id)

    // Clean up the world directory
    const { rmSync } = await import('fs')
    const { join } = await import('path')
    const dir = join('/home/z/my-project/mc-servers', id)
    try { rmSync(dir, { recursive: true, force: true }) } catch {}

    await db.server.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('DELETE /api/servers/[id] error:', e)
    return NextResponse.json({ error: 'Failed to delete server' }, { status: 500 })
  }
}

// PATCH /api/servers/[id] — update settings (also rewrites server.properties for next boot)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const server = await db.server.findUnique({ where: { id } })
    if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 })

    const num = (v: any, def: number) => v === undefined ? def : Number(v)
    const bool = (v: any, def: boolean) => v === undefined ? def : Boolean(v)

    const updated = await db.server.update({
      where: { id },
      data: {
        name: body.name ?? server.name,
        motd: body.motd ?? server.motd,
        maxPlayers: num(body.maxPlayers, server.maxPlayers),
        ramMax: Math.min(num(body.ramMax, server.ramMax), 768),
        difficulty: body.difficulty ?? server.difficulty,
        gamemode: body.gamemode ?? server.gamemode,
        pvp: bool(body.pvp, server.pvp),
        whitelist: bool(body.whitelist, server.whitelist),
        levelType: body.levelType ?? server.levelType,
        levelSeed: body.levelSeed ?? server.levelSeed,
        generateStructures: bool(body.generateStructures, server.generateStructures),
        viewDistance: num(body.viewDistance, server.viewDistance),
        simulationDistance: num(body.simulationDistance, server.simulationDistance),
        spawnProtection: num(body.spawnProtection, server.spawnProtection),
        maxWorldSize: num(body.maxWorldSize, server.maxWorldSize),
        maxTickTime: num(body.maxTickTime, server.maxTickTime),
        hardcore: bool(body.hardcore, server.hardcore),
        allowNether: bool(body.allowNether, server.allowNether),
        allowFlight: bool(body.allowFlight, server.allowFlight),
        enableCommandBlock: bool(body.enableCommandBlock, server.enableCommandBlock),
        enforceSecureProfile: bool(body.enforceSecureProfile, server.enforceSecureProfile),
        onlineMode: bool(body.onlineMode, server.onlineMode),
        resourcePack: body.resourcePack ?? server.resourcePack,
        resourcePackSha1: body.resourcePackSha1 ?? server.resourcePackSha1,
        requireResourcePack: bool(body.requireResourcePack, server.requireResourcePack),
        // Engine mirrors
        status: body.status ?? server.status,
        players: num(body.players, server.players),
        cpu: num(body.cpu, server.cpu),
        ram: num(body.ram, server.ram),
        uptime: num(body.uptime, server.uptime),
        playitAddress: body.playitAddress !== undefined ? body.playitAddress : server.playitAddress,
      },
    })

    // Re-write server.properties with the new values (effective on next boot)
    const { getEngine } = await import('@/lib/mc/engine')
    const engine = getEngine()
    engine.register({
      id: updated.id,
      name: updated.name,
      type: updated.type,
      version: updated.version,
      ramMax: updated.ramMax,
      maxPlayers: updated.maxPlayers,
      motd: updated.motd,
      difficulty: updated.difficulty,
      gamemode: updated.gamemode,
      pvp: updated.pvp,
      whitelist: updated.whitelist,
      port: updated.port,
      levelType: updated.levelType,
      levelSeed: updated.levelSeed,
      generateStructures: updated.generateStructures,
      viewDistance: updated.viewDistance,
      simulationDistance: updated.simulationDistance,
      spawnProtection: updated.spawnProtection,
      maxWorldSize: updated.maxWorldSize,
      maxTickTime: updated.maxTickTime,
      hardcore: updated.hardcore,
      allowNether: updated.allowNether,
      allowFlight: updated.allowFlight,
      enableCommandBlock: updated.enableCommandBlock,
      enforceSecureProfile: updated.enforceSecureProfile,
      onlineMode: updated.onlineMode,
      resourcePack: updated.resourcePack,
      resourcePackSha1: updated.resourcePackSha1,
      requireResourcePack: updated.requireResourcePack,
    })

    return NextResponse.json({ server: updated })
  } catch (e) {
    console.error('PATCH /api/servers/[id] error:', e)
    return NextResponse.json({ error: 'Failed to update server' }, { status: 500 })
  }
}
