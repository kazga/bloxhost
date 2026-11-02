import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/lib/auth/session'

export const dynamic = 'force-dynamic'

// POST /api/auth/login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body || {}
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }
    const result = await login(email, password)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }
    return NextResponse.json({ ok: true, user: result.user })
  } catch (e) {
    console.error('POST /api/auth/login error:', e)
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 })
  }
}
