import { NextResponse } from 'next/server'
import { listRecommendedVersions, listVersions, getLatestVersion } from '@/lib/mc/versions'

export const dynamic = 'force-dynamic'

// GET /api/versions — returns available Minecraft versions
// Query: ?filter=recommended|release|snapshot|all
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const filter = (url.searchParams.get('filter') || 'recommended') as 'recommended' | 'release' | 'snapshot' | 'all'
    if (filter === 'recommended') {
      const [recommended, latest] = await Promise.all([listRecommendedVersions(), getLatestVersion()])
      return NextResponse.json({ latest, versions: recommended })
    }
    const versions = await listVersions(filter)
    const latest = await getLatestVersion()
    return NextResponse.json({ latest, versions })
  } catch (e) {
    console.error('GET /api/versions error:', e)
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 })
  }
}
