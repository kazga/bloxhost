import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db-v2'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

// POST /api/auth/signup
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name } = body || {}
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 })
    }

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name: name.trim(),
        passwordHash,
      },
    })

    return NextResponse.json({
      ok: true,
      user: { id: user.id, email: user.email, name: user.name },
    })
  } catch (e) {
    console.error('POST /api/auth/signup error:', e)
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}
