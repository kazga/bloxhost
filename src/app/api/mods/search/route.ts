import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/mods/search?q=<query>&version=<mc_version>&loader=<fabric|forge|...>&limit=20
// Proxies the Modrinth public search API. No auth required.
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const q = url.searchParams.get('q') || ''
    const version = url.searchParams.get('version')
    const loader = url.searchParams.get('loader') || 'fabric'
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 50)
    const offset = parseInt(url.searchParams.get('offset') || '0', 10)

    // Build Modrinth facets: project_type:mod + loader + game_version
    const facets: string[][] = [['project_type:mod']]
    if (loader && loader !== 'any') {
      facets.push([`categories:${loader}`])
    }
    if (version) {
      facets.push([`versions:${version}`])
    }

    const params = new URLSearchParams({
      query: q || '',
      limit: String(limit),
      offset: String(offset),
      facets: JSON.stringify(facets),
      index: 'relevance',
    })

    const res = await fetch(`https://api.modrinth.com/v2/search?${params.toString()}`, {
      headers: { 'User-Agent': 'BlockHost/1.0 (minecraft server hosting)' },
      cache: 'no-store',
    })
    if (!res.ok) {
      return NextResponse.json({ error: `Modrinth search failed: ${res.status}` }, { status: 502 })
    }
    const data = await res.json()
    return NextResponse.json({
      hits: (data.hits || []).map((h: any) => ({
        id: h.project_id,
        slug: h.slug,
        title: h.title,
        description: h.description,
        author: h.author,
        downloads: h.downloads,
        follows: h.follows,
        icon: h.icon_url,
        versions: h.versions || [],
        categories: h.categories || [],
        dateModified: h.date_modified,
        license: h.license?.id,
      })),
      totalHits: data.total_hits || 0,
      limit,
      offset,
    })
  } catch (e) {
    console.error('GET /api/mods/search error:', e)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
