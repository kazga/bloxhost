import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db-v2'
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync, unlinkSync, readFileSync, rmSync } from 'fs'
import { join, normalize, dirname, basename } from 'path'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SERVERS_DIR = '/home/z/my-project/mc-servers'

function serverDir(id: string): string {
  return join(SERVERS_DIR, id)
}

// Resolve a user-supplied relative path inside a server's directory.
// Rejects anything that tries to escape via .. or absolute paths.
function resolveSafe(serverId: string, relPath: string | null): string {
  const base = serverDir(serverId)
  const target = normalize(join(base, relPath || ''))
  // Ensure target is within base
  if (!target.startsWith(base + '/') && target !== base) {
    throw new Error('Path escapes server directory')
  }
  return target
}

// GET /api/servers/[id]/files?path=<relpath>
// Returns a listing of the directory at the given path (or server root if omitted).
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const server = await db.server.findUnique({ where: { id } })
    if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 })

    const url = new URL(req.url)
    const relPath = url.searchParams.get('path') || ''
    const target = resolveSafe(id, relPath)
    if (!existsSync(target)) {
      return NextResponse.json({ error: 'Path does not exist', path: relPath }, { status: 404 })
    }
    const stat = statSync(target)
    if (!stat.isDirectory()) {
      return NextResponse.json({ error: 'Not a directory', path: relPath }, { status: 400 })
    }

    const entries = readdirSync(target, { withFileTypes: true }).map((e) => {
      const fullPath = join(target, e.name)
      let size = 0
      let modified = 0
      try {
        const s = statSync(fullPath)
        size = s.size
        modified = s.mtimeMs
      } catch {}
      return {
        name: e.name,
        type: e.isDirectory() ? 'dir' : 'file',
        size,
        modified,
        extension: e.isFile() ? (e.name.split('.').pop() || '').toLowerCase() : '',
      }
    }).sort((a, b) => {
      // Directories first, then files alphabetically
      if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json({
      path: relPath || '/',
      entries,
    })
  } catch (e: any) {
    if (e?.message?.includes('escapes')) {
      return NextResponse.json({ error: 'Path not allowed' }, { status: 403 })
    }
    console.error('GET /api/servers/[id]/files error:', e)
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}

// POST /api/servers/[id]/files — upload a file or create a directory
// Body (multipart or JSON):
//   { path: "mods/foo.jar", action: "upload", content: "<base64>" }
//   { path: "mods/newfolder", action: "mkdir" }
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const server = await db.server.findUnique({ where: { id } })
    if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 })

    const contentType = req.headers.get('content-type') || ''
    let body: any
    if (contentType.includes('application/json')) {
      body = await req.json()
    } else if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      const file = form.get('file') as File | null
      const path = (form.get('path') as string) || ''
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }
      const buf = Buffer.from(await file.arrayBuffer())
      const target = resolveSafe(id, path || file.name)
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, buf)
      return NextResponse.json({
        ok: true,
        uploaded: { name: basename(target), size: buf.length },
      })
    } else {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 })
    }

    const { path, action, content } = body || {}
    if (!path) return NextResponse.json({ error: 'path is required' }, { status: 400 })

    const target = resolveSafe(id, path)

    if (action === 'mkdir') {
      mkdirSync(target, { recursive: true })
      return NextResponse.json({ ok: true, created: path })
    }

    if (action === 'upload') {
      if (!content) return NextResponse.json({ error: 'content is required for upload' }, { status: 400 })
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, Buffer.from(content, 'base64'))
      return NextResponse.json({ ok: true, uploaded: { name: basename(target), size: Buffer.from(content, 'base64').length } })
    }

    if (action === 'write_text') {
      // content is a plain string (not base64)
      if (typeof content !== 'string') {
        return NextResponse.json({ error: 'content must be a string for write_text' }, { status: 400 })
      }
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, content, 'utf8')
      return NextResponse.json({ ok: true, written: { name: basename(target), size: content.length } })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e: any) {
    if (e?.message?.includes('escapes')) {
      return NextResponse.json({ error: 'Path not allowed' }, { status: 403 })
    }
    console.error('POST /api/servers/[id]/files error:', e)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

// DELETE /api/servers/[id]/files?path=<relpath>
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const server = await db.server.findUnique({ where: { id } })
    if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 })

    const url = new URL(req.url)
    const relPath = url.searchParams.get('path')
    if (!relPath) return NextResponse.json({ error: 'path is required' }, { status: 400 })

    const target = resolveSafe(id, relPath)
    if (!existsSync(target)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    // Don't allow deleting the server root
    if (target === serverDir(id)) {
      return NextResponse.json({ error: 'Cannot delete server root' }, { status: 400 })
    }
    rmSync(target, { recursive: true, force: true })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (e?.message?.includes('escapes')) {
      return NextResponse.json({ error: 'Path not allowed' }, { status: 403 })
    }
    console.error('DELETE /api/servers/[id]/files error:', e)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}

// PATCH /api/servers/[id]/files — read or edit a file's contents
// Body: { path: "...", action: "read" | "rename", newPath?: "..." }
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const server = await db.server.findUnique({ where: { id } })
    if (!server) return NextResponse.json({ error: 'Server not found' }, { status: 404 })

    const body = await req.json()
    const { path, action, newPath } = body || {}
    if (!path) return NextResponse.json({ error: 'path is required' }, { status: 400 })

    const target = resolveSafe(id, path)

    if (action === 'read') {
      if (!existsSync(target)) return NextResponse.json({ error: 'File not found' }, { status: 404 })
      const stat = statSync(target)
      if (stat.isDirectory()) return NextResponse.json({ error: 'Cannot read a directory' }, { status: 400 })
      const buf = readFileSync(target)
      // Detect if it's a text file
      const ext = basename(target).split('.').pop()?.toLowerCase() || ''
      const textExts = ['txt', 'json', 'properties', 'yml', 'yaml', 'toml', 'log', 'cfg', 'conf', 'md', 'sh', 'mcfunction']
      const isText = textExts.includes(ext) || (buf.length < 100000 && !buf.includes(0x00))
      if (isText) {
        return NextResponse.json({
          path,
          size: buf.length,
          isText: true,
          content: buf.toString('utf8'),
        })
      } else {
        return NextResponse.json({
          path,
          size: buf.length,
          isText: false,
        })
      }
    }

    if (action === 'rename') {
      if (!newPath) return NextResponse.json({ error: 'newPath is required for rename' }, { status: 400 })
      const dest = resolveSafe(id, newPath)
      if (existsSync(dest)) return NextResponse.json({ error: 'Destination already exists' }, { status: 400 })
      mkdirSync(dirname(dest), { recursive: true })
      // Use rename — moves within the same filesystem
      try {
        const { renameSync } = await import('fs')
        renameSync(target, dest)
      } catch {
        // Fallback: copy + delete (cross-device)
        const { copyFileSync } = await import('fs')
        copyFileSync(target, dest)
        rmSync(target, { recursive: true, force: true })
      }
      return NextResponse.json({ ok: true, renamed: { from: path, to: newPath } })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (e: any) {
    if (e?.message?.includes('escapes')) {
      return NextResponse.json({ error: 'Path not allowed' }, { status: 403 })
    }
    console.error('PATCH /api/servers/[id]/files error:', e)
    return NextResponse.json({ error: 'Failed to read/rename file' }, { status: 500 })
  }
}
