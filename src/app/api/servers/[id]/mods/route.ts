import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db-v2'
import { mkdirSync, writeFileSync, existsSync, readdirSync, statSync, unlinkSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

const SERVERS_DIR = join(process.cwd(), 'mc-servers')

function serverDir(id: string): string {
  return join(SERVERS_DIR, id)
}

// GET /api/servers/[id]/mods — list installed mods (jars in mods/)
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const server = await db.server.findUnique({ where: { id } })
    if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 })

    const modsDir = join(serverDir(id), 'mods')
    if (!existsSync(modsDir)) {
      return NextResponse.json({ mods: [], modsDir: 'mods' })
    }
    const mods = readdirSync(modsDir)
      .filter((f) => f.endsWith('.jar'))
      .map((f) => {
        const path = join(modsDir, f)
        const stat = statSync(path)
        return { name: f, size: stat.size, modified: stat.mtimeMs }
      })
      .sort((a, b) => a.name.localeCompare(b.name))
    return NextResponse.json({ mods, modsDir: 'mods' })
  } catch (e) {
    console.error('GET /api/servers/[id]/mods error:', e)
    return NextResponse.json({ error: 'Failed to list mods' }, { status: 500 })
  }
}

// POST /api/servers/[id]/mods — install a mod from Modrinth
// Body: { projectId: string, versionId?: string, mcVersion?: string }
// If versionId is omitted, we pick the latest compatible version.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const server = await db.server.findUnique({ where: { id } })
    if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 })

    const body = await req.json()
    const { projectId, versionId, mcVersion } = body || {}
    if (!projectId) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
    }

    const targetMcVersion = mcVersion || server.version
    const loader = server.type === 'fabric' ? 'fabric' :
                   server.type === 'forge' ? 'forge' :
                   server.type === 'quilt' ? 'quilt' :
                   null

    // If no specific versionId given, fetch versions list and pick the latest compatible
    let chosenVersion = versionId
    if (!chosenVersion) {
      const vRes = await fetch(
        `https://api.modrinth.com/v2/project/${projectId}/version?game_versions=["${targetMcVersion}"]${loader ? `&loaders=["${loader}"]` : ''}`,
        { headers: { 'User-Agent': 'BlockHost/1.0' } }
      )
      if (!vRes.ok) {
        return NextResponse.json({ error: `Modrinth version lookup failed: ${vRes.status}` }, { status: 502 })
      }
      const versions = await vRes.json()
      if (!Array.isArray(versions) || versions.length === 0) {
        return NextResponse.json({
          error: `No compatible version found for MC ${targetMcVersion}${loader ? ` / ${loader}` : ''}. The mod may not support this version yet.`,
        }, { status: 400 })
      }
      // Pick the newest version (Modrinth returns them newest-first)
      chosenVersion = versions[0].id
    }

    // Fetch the chosen version's details
    const verRes = await fetch(`https://api.modrinth.com/v2/version/${chosenVersion}`, {
      headers: { 'User-Agent': 'BlockHost/1.0' },
    })
    if (!verRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch version details' }, { status: 502 })
    }
    const verData = await verRes.json()
    // Pick the primary file (or the first .jar file)
    const file = (verData.files || []).find((f: any) => f.primary) || (verData.files || [])[0]
    if (!file) {
      return NextResponse.json({ error: 'No downloadable file in this version' }, { status: 400 })
    }

    // Download the file
    const fileRes = await fetch(file.url)
    if (!fileRes.ok) {
      return NextResponse.json({ error: `Failed to download mod file: ${fileRes.status}` }, { status: 502 })
    }
    const buf = Buffer.from(await fileRes.arrayBuffer())

    // Save to mods/ directory
    const modsDir = join(serverDir(id), 'mods')
    mkdirSync(modsDir, { recursive: true })
    const destPath = join(modsDir, file.filename)
    writeFileSync(destPath, buf)

    return NextResponse.json({
      ok: true,
      installed: {
        filename: file.filename,
        size: file.file_size,
        versionId: chosenVersion,
        versionNumber: verData.version_number,
        name: verData.name,
      },
    })
  } catch (e) {
    console.error('POST /api/servers/[id]/mods error:', e)
    return NextResponse.json({ error: 'Failed to install mod' }, { status: 500 })
  }
}

// DELETE /api/servers/[id]/mods?filename=<name> — remove a mod
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const server = await db.server.findUnique({ where: { id } })
    if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 })

    const url = new URL(req.url)
    const filename = url.searchParams.get('filename')
    if (!filename) {
      return NextResponse.json({ error: 'filename query param is required' }, { status: 400 })
    }
    // Prevent path traversal: filename must be a bare name
    if (filename.includes('/') || filename.includes('..') || !filename.endsWith('.jar')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }
    const path = join(serverDir(id), 'mods', filename)
    if (!existsSync(path)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    unlinkSync(path)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('DELETE /api/servers/[id]/mods error:', e)
    return NextResponse.json({ error: 'Failed to delete mod' }, { status: 500 })
  }
}
