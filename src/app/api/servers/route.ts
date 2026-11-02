import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db-v2'
import { getCurrentUser } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

// GET /api/servers — list servers for the current user (or all if not logged in)
export async function GET() {
  try {
    const user = await getCurrentUser()
    let servers
    if (user) {
      // Show user's servers + any orphan "guest" servers from before login
      servers = await db.server.findMany({
        where: { OR: [{ ownerId: user.id }, { ownerId: 'guest' }] },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      servers = await db.server.findMany({
        where: { ownerId: 'guest' },
        orderBy: { createdAt: 'desc' },
      })
    }
    return NextResponse.json({ servers, user })
  } catch (e) {
    console.error('GET /api/servers error:', e)
    return NextResponse.json({ error: 'Failed to fetch servers' }, { status: 500 })
  }
}

// POST /api/servers — create a new server
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    const ownerId = user?.id || 'guest'
    const ownerName = user?.name || 'Guest'

    const body = await req.json()
    const {
      name,
      type = 'vanilla',
      version = '1.20.4',
      motd = 'A Minecraft Server',
      maxPlayers = 20,
      ramMax = 768,
      difficulty = 'normal',
      gamemode = 'survival',
      pvp = true,
      whitelist = false,
      levelType = 'minecraft\\default',
      levelSeed = '',
      generateStructures = true,
      viewDistance = 8,
      simulationDistance = 8,
      spawnProtection = 16,
      maxWorldSize = 29999984,
      maxTickTime = 60000,
      hardcore = false,
      allowNether = true,
      allowFlight = false,
      enableCommandBlock = false,
      enforceSecureProfile = false,
      onlineMode = false,
      resourcePack = '',
      resourcePackSha1 = '',
      requireResourcePack = false,
    } = body || {}

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Server name is required' }, { status: 400 })
    }
    if (name.length > 32) {
      return NextResponse.json({ error: 'Server name must be 32 characters or less' }, { status: 400 })
    }

    // Per-user limit: max 10 servers
    const count = await db.server.count({ where: { ownerId } })
    if (count >= 10) {
      return NextResponse.json({ error: 'Server limit reached (10 per account). Delete an existing server first.' }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'server'
    const host = `${slug}.freemc.host`

    const server = await db.server.create({
      data: {
        name: name.trim(),
        type,
        version,
        motd,
        maxPlayers: Number(maxPlayers) || 20,
        ramMax: Math.min(Number(ramMax) || 768, 768),
        difficulty,
        gamemode,
        pvp: Boolean(pvp),
        whitelist: Boolean(whitelist),
        ownerId,
        ownerName,
        host,
        port: 25565 + Math.floor(Math.random() * 1000),
        status: 'offline',
        levelType,
        levelSeed,
        generateStructures: Boolean(generateStructures),
        viewDistance: Number(viewDistance) || 8,
        simulationDistance: Number(simulationDistance) || 8,
        spawnProtection: Number(spawnProtection) || 16,
        maxWorldSize: Number(maxWorldSize) || 29999984,
        maxTickTime: Number(maxTickTime) || 60000,
        hardcore: Boolean(hardcore),
        allowNether: Boolean(allowNether),
        allowFlight: Boolean(allowFlight),
        enableCommandBlock: Boolean(enableCommandBlock),
        enforceSecureProfile: Boolean(enforceSecureProfile),
        onlineMode: Boolean(onlineMode),
        resourcePack,
        resourcePackSha1,
        requireResourcePack: Boolean(requireResourcePack),
      },
    })

    return NextResponse.json({ server })
  } catch (e) {
    console.error('POST /api/servers error:', e)
    return NextResponse.json({ error: 'Failed to create server' }, { status: 500 })
  }
}
