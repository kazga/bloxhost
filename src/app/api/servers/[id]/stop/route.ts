import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db-v2'
import { getEngine } from '@/lib/mc/engine'

export const dynamic = 'force-dynamic'

// POST /api/servers/[id]/stop - gracefully stop the Java process
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const server = await db.server.findUnique({ where: { id } })
    if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 })

    const engine = getEngine()
    const result = engine.stop(id)
    if (!result.ok) {
      return NextResponse.json({ error: result.error || 'Failed to stop server' }, { status: 400 })
    }

    await db.server.update({
      where: { id },
      data: { status: 'stopping', players: 0 },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('POST /api/servers/[id]/stop error:', e)
    return NextResponse.json({ error: 'Failed to stop server' }, { status: 500 })
  }
}
