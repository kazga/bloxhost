import { NextResponse } from 'next/server'
import { getPlayitAgent } from '@/lib/mc/playit'

export const dynamic = 'force-dynamic'

// POST /api/playit/cancel — cancel any pending playit claim flow
export async function POST() {
  try {
    getPlayitAgent().cancelClaimFlow()
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to cancel' }, { status: 500 })
  }
}
