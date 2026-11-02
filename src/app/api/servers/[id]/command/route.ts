import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db-v2'
import { getEngine } from '@/lib/mc/engine'

export const dynamic = 'force-dynamic'

// POST /api/servers/[id]/command - send a command to the running server's stdin
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { command } = body || {}
    if (!command || typeof command !== 'string') {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 })
    }
    const server = await db.server.findUnique({ where: { id } })
    if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 })

    const engine = getEngine()
    const result = engine.sendCommand(id, command)
    if (!result.ok) {
      return NextResponse.json({ error: result.error || 'Failed to run command' }, { status: 400 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('POST /api/servers/[id]/command error:', e)
    return NextResponse.json({ error: 'Failed to execute command' }, { status: 500 })
  }
}
