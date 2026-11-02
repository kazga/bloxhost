// Fabric mod loader support.
// Uses the official Fabric installer to generate a server launch jar for any
// Minecraft version that has a Fabric loader available.
//
// Flow:
//   1. Find the latest stable Fabric loader version for the requested MC version
//      via https://meta.fabricmc.net/v2/versions/loader/{mc}
//   2. Run `java -jar fabric-installer.jar server -mcversion {mc} -loader {loader} -downloadMinecraft`
//      in the server's working directory. This generates:
//        - fabric-server-launch.jar (the launcher to run with java -jar)
//        - libraries/ (Fabric libs)
//        - server.jar (the vanilla Minecraft server.jar)
//   3. Subsequent server starts use `java -jar fabric-server-launch.jar nogui`

import { spawn } from 'child_process'
import { existsSync, mkdirSync, statSync } from 'fs'
import { join } from 'path'

const PROJECT_ROOT = process.cwd()
const FABRIC_INSTALLER_PATH = join(PROJECT_ROOT, 'mc-bin', 'fabric-installer.jar')
const META_BASE = 'https://meta.fabricmc.net/v2/versions/loader'

interface LoaderVersion {
  loader: { version: string; stable: boolean }
  intermediary: { version: string }
}

// Cache: mc version → latest stable loader version
const loaderCache = new Map<string, string>()

export async function getLatestFabricLoader(mcVersion: string): Promise<string | null> {
  if (loaderCache.has(mcVersion)) return loaderCache.get(mcVersion)!
  try {
    const res = await fetch(`${META_BASE}/${encodeURIComponent(mcVersion)}`)
    if (!res.ok) return null
    const data = (await res.json()) as LoaderVersion[]
    // Pick the latest stable loader; fall back to latest unstable if none stable
    const stable = data.find((l) => l.loader.stable)
    const chosen = (stable || data[0])?.loader.version
    if (chosen) loaderCache.set(mcVersion, chosen)
    return chosen || null
  } catch (e) {
    console.error('Failed to fetch Fabric loader versions:', e)
    return null
  }
}

// Returns true if a fabric-server-launch.jar already exists in the given directory.
export function isFabricInstalled(serverDir: string): boolean {
  return existsSync(join(serverDir, 'fabric-server-launch.jar'))
}

// Run the Fabric installer in `serverDir` to generate the launch jar + libs.
// Returns the Java command args to use for actually running the server.
export async function installFabric(serverDir: string, mcVersion: string): Promise<{ ok: boolean; error?: string; loaderVersion?: string }> {
  if (!existsSync(FABRIC_INSTALLER_PATH)) {
    return { ok: false, error: 'Fabric installer jar not found' }
  }
  const loaderVersion = await getLatestFabricLoader(mcVersion)
  if (!loaderVersion) {
    return { ok: false, error: `No Fabric loader available for Minecraft ${mcVersion}` }
  }

  mkdirSync(serverDir, { recursive: true })

  return new Promise((resolve) => {
    const proc = spawn('java', [
      '-jar', FABRIC_INSTALLER_PATH,
      'server',
      '-mcversion', mcVersion,
      '-loader', loaderVersion,
      '-downloadMinecraft',
      '-nogui',
    ], {
      cwd: serverDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env },
    })

    let stdout = ''
    let stderr = ''
    proc.stdout?.on('data', (d: Buffer) => { stdout += d.toString() })
    proc.stderr?.on('data', (d: Buffer) => { stderr += d.toString() })

    proc.on('exit', (code) => {
      if (code === 0 && existsSync(join(serverDir, 'fabric-server-launch.jar'))) {
        resolve({ ok: true, loaderVersion })
      } else {
        resolve({
          ok: false,
          error: `Fabric installer exited with code ${code}. ${stderr.slice(-500) || stdout.slice(-500)}`,
          loaderVersion,
        })
      }
    })
    proc.on('error', (e) => {
      resolve({ ok: false, error: `Failed to run installer: ${e.message}` })
    })
  })
}

export function getFabricLaunchJar(): string {
  return 'fabric-server-launch.jar'
}
