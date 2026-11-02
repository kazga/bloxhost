// Minecraft version catalog.
// Fetches the official version manifest from Mojang on first request,
// caches it in memory, and lazy-downloads each version's server.jar on demand.

import { existsSync, mkdirSync, writeFileSync, readFileSync, statSync } from 'fs'
import { join } from 'path'
import { spawn } from 'child_process'

const PROJECT_ROOT = process.cwd()
const BIN_DIR = join(PROJECT_ROOT, 'mc-bin')
const VERSIONS_CACHE_PATH = join(BIN_DIR, 'version-manifest.json')
const VERSIONS_CACHE_TTL_MS = 1000 * 60 * 60 * 6 // 6 hours

interface VersionEntry {
  id: string
  type: string // release | snapshot | old_beta | old_alpha
  url: string
}

interface VersionManifest {
  latest: { release: string; snapshot: string }
  versions: VersionEntry[]
}

interface VersionMetadata {
  id: string
  downloads: {
    server: { sha1: string; size: number; url: string }
  }
  javaVersion?: { majorVersion: number; component: string }
}

interface GlobalWithCatalog {
  __mcCatalog?: {
    manifest: VersionManifest
    fetchedAt: number
  }
}

const g = globalThis as GlobalWithCatalog

async function fetchManifest(): Promise<VersionManifest> {
  if (g.__mcCatalog && Date.now() - g.__mcCatalog.fetchedAt < VERSIONS_CACHE_TTL_MS) {
    return g.__mcCatalog.manifest
  }
  // Try disk cache first
  if (existsSync(VERSIONS_CACHE_PATH)) {
    try {
      const stat = statSync(VERSIONS_CACHE_PATH)
      if (Date.now() - stat.mtimeMs < VERSIONS_CACHE_TTL_MS) {
        const cached = JSON.parse(readFileSync(VERSIONS_CACHE_PATH, 'utf8'))
        g.__mcCatalog = { manifest: cached, fetchedAt: stat.mtimeMs }
        return cached
      }
    } catch {}
  }
  // Fetch fresh
  const res = await fetch('https://piston-meta.mojang.com/mc/game/version_manifest_v2.json')
  if (!res.ok) throw new Error(`Failed to fetch manifest: ${res.status}`)
  const manifest = (await res.json()) as VersionManifest
  mkdirSync(BIN_DIR, { recursive: true })
  writeFileSync(VERSIONS_CACHE_PATH, JSON.stringify(manifest, null, 2))
  g.__mcCatalog = { manifest, fetchedAt: Date.now() }
  return manifest
}

export async function listVersions(filter: 'release' | 'snapshot' | 'all' = 'release'): Promise<{ id: string; type: string; latest?: boolean }[]> {
  const manifest = await fetchManifest()
  const latest = manifest.latest.release
  let vs = manifest.versions
  if (filter !== 'all') vs = vs.filter((v) => v.type === filter)
  return vs.map((v) => ({ id: v.id, type: v.type, latest: v.id === latest }))
}

// Curated list of recommended versions (the ones most users actually want).
// Anything outside this list is still installable via the "all versions" dropdown.
const RECOMMENDED_VERSIONS = [
  '1.21.11', '1.21.8', '1.21.4', '1.21.1',
  '1.20.6', '1.20.4', '1.20.1',
  '1.19.4', '1.19.2',
  '1.18.2',
  '1.17.1',
  '1.16.5',
  '1.12.2',
  '1.8.9',
]

export async function listRecommendedVersions(): Promise<{ id: string; available: boolean; latest?: boolean }> {
  const manifest = await fetchManifest()
  const latest = manifest.latest.release
  const byId = new Map(manifest.versions.map((v) => [v.id, v]))
  return RECOMMENDED_VERSIONS.map((id) => ({
    id,
    available: byId.has(id),
    latest: id === latest,
  })).filter((v) => v.available)
}

// Get the latest stable version
export async function getLatestVersion(): Promise<string> {
  const manifest = await fetchManifest()
  return manifest.latest.release
}

// Download a version's server.jar if not already cached.
// Returns the local path to the server.jar file.
export async function ensureServerJar(versionId: string): Promise<{ path: string; javaVersion: number; error?: string }> {
  const safeName = `server-${versionId}.jar`
  const jarPath = join(BIN_DIR, safeName)
  if (existsSync(jarPath) && statSync(jarPath).size > 1000000) {
    // Already have it — read its metadata for Java version
    const metaPath = join(BIN_DIR, `meta-${versionId}.json`)
    if (existsSync(metaPath)) {
      try {
        const meta = JSON.parse(readFileSync(metaPath, 'utf8'))
        return { path: jarPath, javaVersion: meta.javaVersion || 17 }
      } catch {}
    }
    return { path: jarPath, javaVersion: 17 }
  }

  // Need to fetch the version's metadata to get the download URL
  const manifest = await fetchManifest()
  const version = manifest.versions.find((v) => v.id === versionId)
  if (!version) {
    return { path: '', javaVersion: 17, error: `Unknown version: ${versionId}` }
  }

  // Fetch version metadata
  const metaRes = await fetch(version.url)
  if (!metaRes.ok) {
    return { path: '', javaVersion: 17, error: `Failed to fetch version metadata: ${metaRes.status}` }
  }
  const meta = (await metaRes.json()) as VersionMetadata
  if (!meta.downloads?.server?.url) {
    return { path: '', javaVersion: 17, error: `Version ${versionId} has no server.jar` }
  }

  // Download the server.jar
  mkdirSync(BIN_DIR, { recursive: true })
  const jarRes = await fetch(meta.downloads.server.url)
  if (!jarRes.ok) {
    return { path: '', javaVersion: 17, error: `Failed to download server.jar: ${jarRes.status}` }
  }
  const jarBuf = Buffer.from(await jarRes.arrayBuffer())
  writeFileSync(jarPath, jarBuf)
  // Save metadata
  writeFileSync(join(BIN_DIR, `meta-${versionId}.json`), JSON.stringify({
    id: meta.id,
    javaVersion: meta.javaVersion?.majorVersion || 17,
    sha1: meta.downloads.server.sha1,
    size: meta.downloads.server.size,
  }, null, 2))

  // Pre-extract libraries (the server.jar's libs are unpacked on first run, but
  // we can let the actual server start do that lazily).
  return { path: jarPath, javaVersion: meta.javaVersion?.majorVersion || 17 }
}

// Warm up the manifest on server start (non-blocking)
export function warmManifest() {
  fetchManifest().catch((e) => console.error('Failed to warm MC version manifest:', e))
}
