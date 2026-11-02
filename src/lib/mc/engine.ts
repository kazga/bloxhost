// Real Minecraft server process engine.
// Spawns actual `java -jar server.jar` processes for any Mojang version,
// supports all standard server.properties fields, and integrates with
// the playit.gg agent for public tunneling.
//
// Sandbox note: the Caddy gateway only proxies HTTPS, so external Minecraft
// clients cannot reach the server directly via TCP. With playit.gg enabled,
// the server is reachable at the assigned *.playit.gg address.

import { spawn, ChildProcess } from 'child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync, symlinkSync, rmSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { ensureServerJar } from './versions'
import { getPlayitAgent } from './playit'
import { installFabric, isFabricInstalled, getFabricLaunchJar } from './fabric'

// Resolve paths relative to the project root (works on any OS — Windows, Mac, Linux)
const PROJECT_ROOT = process.cwd()
const BASE_DIR = join(PROJECT_ROOT, 'mc-bin')
const SERVERS_DIR = join(PROJECT_ROOT, 'mc-servers')
const JDK_17_DIR = join(PROJECT_ROOT, 'jdk', 'jdk-17.0.13+11')
const JDK_25_DIR = join(PROJECT_ROOT, 'jdk', 'jdk-25.0.5+8')

const MAX_RUNNING = 1 // Resource constraint: only one Java server at a time
const MAX_CONSOLE_LINES = 500
const STOP_TIMEOUT_MS = 12000

// Pick the right JDK binary for a required major Java version.
// Minecraft versions specify their required javaVersion (e.g. 17, 21, 25).
// We bundle Temurin 17 (for MC 1.18-1.20.4), use system Java 21 (for MC 1.20.5-1.21.x),
// and Temurin 25 (for the new 26.x series).
function pickJavaBin(requiredMajor: number): string {
  if (requiredMajor <= 17) {
    const bin = join(JDK_17_DIR, 'bin', 'java')
    if (existsSync(bin)) return bin
  }
  if (requiredMajor >= 25) {
    const bin = join(JDK_25_DIR, 'bin', 'java')
    if (existsSync(bin)) return bin
  }
  // 18-24: use system Java (21) — works for MC 1.20.5 through 1.21.x
  return 'java'
}

export interface ServerOpts {
  id: string
  name: string
  type: string // vanilla | paper | spigot | forge | fabric (only vanilla spawns real Java for now)
  version: string
  ramMax: number
  maxPlayers: number
  motd: string
  difficulty: string
  gamemode: string
  pvp: boolean
  whitelist: boolean
  port: number
  // The user's playit.gg agent secret (null if they haven't set one up yet).
  // When null, the engine auto-starts a claim flow that surfaces a
  // https://playit.gg/claim/<code> URL in the Minecraft server's console.
  playitSecret?: string | null
  // World settings
  levelType: string
  levelSeed: string
  generateStructures: boolean
  // Performance
  viewDistance: number
  simulationDistance: number
  spawnProtection: number
  maxWorldSize: number
  maxTickTime: number
  // Behavior
  hardcore: boolean
  allowNether: boolean
  allowFlight: boolean
  enableCommandBlock: boolean
  enforceSecureProfile: boolean
  onlineMode: boolean
  // Resource pack
  resourcePack: string
  resourcePackSha1: string
  requireResourcePack: boolean
}

export interface ProcessState {
  id: string
  proc: ChildProcess | null
  pid: number | null
  status: 'offline' | 'starting' | 'online' | 'stopping' | 'crashed'
  consoleLines: { id: string; ts: number; level: 'INFO' | 'WARN' | 'ERROR' | 'CMD'; text: string }[]
  startedAt: number | null
  stoppedAt: number | null
  lastCpuTime: number | null
  lastSampleAt: number | null
  cpu: number
  ram: number
  members: string[]
  pendingForceKill: ReturnType<typeof setTimeout> | null
  jarPath: string | null
  javaVersion: number
  playitAddress: string | null
}

type GlobalThisWithEngine = typeof globalThis & { __mcEngine?: McEngine }

class McEngine {
  private processes = new Map<string, ProcessState>()
  private serverDirs = new Map<string, string>()
  private listeners = new Map<string, Set<(s: ProcessState) => void>>()
  private statsTimer: ReturnType<typeof setInterval> | null = null
  private playitTimer: ReturnType<typeof setInterval> | null = null

  constructor() {
    if (typeof window === 'undefined') {
      this.statsTimer = setInterval(() => this.sampleStats(), 2000)
      if (!existsSync(SERVERS_DIR)) mkdirSync(SERVERS_DIR, { recursive: true })
      // Periodically refresh playit tunnel info into process state
      this.playitTimer = setInterval(() => this.refreshPlayit(), 3000)
    }
  }

  private serverDir(id: string): string {
    let dir = this.serverDirs.get(id)
    if (!dir) {
      dir = join(SERVERS_DIR, id)
      this.serverDirs.set(id, dir)
    }
    return dir
  }

  private ensureServerDir(id: string): string {
    const dir = this.serverDir(id)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    return dir
  }

  private writeServerProperties(opts: ServerOpts) {
    const dir = this.ensureServerDir(opts.id)
    // Symlink shared libraries (1.20.4's libraries work for many versions, but
    // each version extracts its own on first boot — let the server do it)
    const libsLink = join(dir, 'libraries')
    if (!existsSync(libsLink)) {
      try { symlinkSafe(join(BASE_DIR, 'libraries'), libsLink) } catch {}
    }
    // Always accept the EULA (we acknowledge Mojang's terms on behalf of the host operator)
    writeFileSync(join(dir, 'eula.txt'), 'eula=true\n')

    // Build server.properties from the user's settings
    const props: Record<string, string> = {
      'motd': opts.motd.slice(0, 59),
      'max-players': String(opts.maxPlayers),
      'server-port': String(opts.port),
      'difficulty': opts.difficulty,
      'gamemode': opts.gamemode,
      'pvp': String(opts.pvp),
      'enforce-whitelist': String(opts.whitelist),
      'white-list': String(opts.whitelist),
      'level-name': 'world',
      'online-mode': String(opts.onlineMode),
      'enable-status': 'true',
      // World generation
      'level-type': opts.levelType,
      'generate-structures': String(opts.generateStructures),
      'level-seed': opts.levelSeed || '',
      // Performance
      'view-distance': String(opts.viewDistance),
      'simulation-distance': String(opts.simulationDistance),
      'spawn-protection': String(opts.spawnProtection),
      'max-world-size': String(opts.maxWorldSize),
      'max-tick-time': String(opts.maxTickTime),
      // Behavior
      'hardcore': String(opts.hardcore),
      'allow-nether': String(opts.allowNether),
      'allow-flight': String(opts.allowFlight),
      'enable-command-block': String(opts.enableCommandBlock),
      'enforce-secure-profile': String(opts.enforceSecureProfile),
      // Resource pack
      'resource-pack': opts.resourcePack || '',
      'resource-pack-sha1': opts.resourcePackSha1 || '',
      'require-resource-pack': String(opts.requireResourcePack),
      // Misc
      'allow-flight': String(opts.allowFlight),
      'broadcast-console-to-ops': 'true',
      'enable-query': 'false',
      'enable-rcon': 'false',
      'network-compression-threshold': '256',
      'op-permission-level': '4',
      'function-permission-level': '2',
      'prevent-proxy-connections': 'false',
      'use-native-transport': 'true',
      'snooper-enabled': 'false',
    }
    const lines = Object.entries(props).map(([k, v]) => `${k}=${v}`)
    writeFileSync(join(dir, 'server.properties'), `#Minecraft server properties\n#Generated by BlockHost\n${lines.join('\n')}\n`)
  }

  private pushLine(state: ProcessState, level: 'INFO' | 'WARN' | 'ERROR' | 'CMD', text: string) {
    state.consoleLines.push({ id: Math.random().toString(36).slice(2, 11), ts: Date.now(), level, text })
    if (state.consoleLines.length > MAX_CONSOLE_LINES) {
      state.consoleLines.splice(0, state.consoleLines.length - MAX_CONSOLE_LINES)
    }
  }

  private emit(id: string) {
    const state = this.processes.get(id)
    if (!state) return
    const subs = this.listeners.get(id)
    if (!subs) return
    for (const l of subs) {
      try { l(state) } catch (e) { console.error('listener error', e) }
    }
  }

  register(opts: ServerOpts) {
    let state = this.processes.get(opts.id)
    if (!state) {
      state = {
        id: opts.id,
        proc: null,
        pid: null,
        status: 'offline',
        consoleLines: [],
        startedAt: null,
        stoppedAt: null,
        lastCpuTime: null,
        lastSampleAt: null,
        cpu: 0,
        ram: 0,
        members: [],
        pendingForceKill: null,
        jarPath: null,
        javaVersion: 17,
        playitAddress: null,
      }
      this.processes.set(opts.id, state)
    }
    this.writeServerProperties(opts)
    return state
  }

  getState(id: string): ProcessState | undefined {
    return this.processes.get(id)
  }

  async start(opts: ServerOpts): Promise<{ ok: boolean; error?: string }> {
    const state = this.register(opts)

    if (state.status === 'online' || state.status === 'starting') {
      return { ok: false, error: 'Server is already running' }
    }

    // Enforce the one-running-server limit
    let runningCount = 0
    for (const s of this.processes.values()) {
      if (s.status === 'online' || s.status === 'starting') runningCount++
    }
    if (runningCount >= MAX_RUNNING) {
      for (const [otherId, s] of this.processes.entries()) {
        if ((s.status === 'online' || s.status === 'starting') && otherId !== opts.id) {
          this.stop(otherId)
        }
      }
    }

    // Ensure the right server.jar is downloaded for this version
    const ramMax = Math.min(opts.ramMax, 768)
    const dir = this.serverDir(opts.id)
    this.pushLine(state, 'INFO', `[BlockHost/INFO]: Preparing Minecraft ${opts.version} ${opts.type} server`)
    this.emit(opts.id)
    const jarInfo = await ensureServerJar(opts.version)
    if (jarInfo.error || !jarInfo.path) {
      this.pushLine(state, 'ERROR', `[BlockHost/ERROR]: ${jarInfo.error || 'Failed to download server.jar'}`)
      state.status = 'crashed'
      this.emit(opts.id)
      return { ok: false, error: jarInfo.error || 'Failed to download server.jar' }
    }
    state.jarPath = jarInfo.path
    state.javaVersion = jarInfo.javaVersion

    // If this is a Fabric server, run the Fabric installer to generate the
    // launch jar + libraries (only needed once per server dir; subsequent
    // starts reuse the existing fabric-server-launch.jar).
    let runJarName = 'server.jar' // which jar to run with java -jar
    if (opts.type === 'fabric') {
      if (!isFabricInstalled(dir)) {
        this.pushLine(state, 'INFO', `[BlockHost/INFO]: Installing Fabric loader for MC ${opts.version}...`)
        this.emit(opts.id)
        const fabricResult = await installFabric(dir, opts.version)
        if (!fabricResult.ok) {
          this.pushLine(state, 'ERROR', `[BlockHost/ERROR]: Fabric install failed: ${fabricResult.error}`)
          state.status = 'crashed'
          this.emit(opts.id)
          return { ok: false, error: fabricResult.error || 'Fabric install failed' }
        }
        this.pushLine(state, 'INFO', `[BlockHost/INFO]: Fabric loader ${fabricResult.loaderVersion} installed. Mods go in the "mods/" folder.`)
      } else {
        this.pushLine(state, 'INFO', `[BlockHost/INFO]: Using existing Fabric installation.`)
      }
      runJarName = getFabricLaunchJar()
    }

    // Reset state for a fresh boot
    state.consoleLines = []
    state.members = []
    state.cpu = 0
    state.ram = 0
    state.lastCpuTime = null
    state.lastSampleAt = null
    state.status = 'starting'
    state.startedAt = Date.now()
    state.stoppedAt = null
    state.playitAddress = null
    if (state.pendingForceKill) { clearTimeout(state.pendingForceKill); state.pendingForceKill = null }

    // Pick the right JDK for the version. Minecraft versions specify a required
    // major Java version (e.g. 1.20.4 → Java 17, 1.20.5+ → Java 21, 26.x → Java 25).
    // We bundle Temurin JDK 17 and JDK 25 in the jdk/ folder, and fall
    // back to the system Java 21 for anything in between.
    const javaBin = pickJavaBin(state.javaVersion)

    this.pushLine(state, 'INFO', `[BlockHost/INFO]: Starting real Minecraft server (Java ${state.javaVersion})`)
    this.pushLine(state, 'INFO', `[BlockHost/INFO]: Working directory: ${dir}`)
    this.pushLine(state, 'INFO', `[BlockHost/INFO]: JVM heap: -Xmx${ramMax}M`)
    this.pushLine(state, 'INFO', `[BlockHost/INFO]: JDK: ${javaBin}`)
    this.pushLine(state, 'INFO', `[BlockHost/INFO]: World type: ${opts.levelType.replace(/minecraft\\/, '')}${opts.levelSeed ? ', seed: ' + opts.levelSeed : ''}`)
    this.emit(opts.id)

    // Build the Java command
    // For vanilla servers: symlink the version-specific server.jar into the server's directory.
    // For Fabric servers: the installer already downloaded server.jar + libs + launch jar, so we just run the launch jar.
    if (opts.type !== 'fabric') {
      const jarLink = join(dir, 'server.jar')
      try {
        if (existsSync(jarLink)) rmSync(jarLink)
        symlinkSafe(state.jarPath, jarLink)
      } catch {}
    }

    const args = [
      `-Xmx${ramMax}M`,
      `-Xms${Math.min(256, ramMax)}M`,
      '-Dlog4j2.formatMsgNoLookups=true',
      '-jar', runJarName,
      'nogui',
    ]

    let proc: ChildProcess
    try {
      // Prepend the JDK's bin dir to PATH so the JVM can find its own tools
      const jdkDir = dirname(javaBin)
      const env = { ...process.env, MALLOC_ARENA_MAX: '2' }
      env.PATH = `${jdkDir}:${env.PATH || ''}`
      // JAVA_HOME helps some Minecraft versions find their runtime
      env.JAVA_HOME = jdkDir.replace('/bin', '')
      proc = spawn(javaBin, args, {
        cwd: dir,
        stdio: ['pipe', 'pipe', 'pipe'],
        env,
        detached: false,
      })
    } catch (e: any) {
      state.status = 'crashed'
      this.pushLine(state, 'ERROR', `[BlockHost/ERROR]: Failed to spawn Java process: ${e?.message || e}`)
      this.emit(opts.id)
      return { ok: false, error: 'Failed to start Java process' }
    }

    state.proc = proc
    state.pid = proc.pid ?? null

    let stdoutBuf = ''
    let stderrBuf = ''

    const parseAndAppend = (raw: string, stream: 'stdout' | 'stderr') => {
      const combined = (stream === 'stdout' ? stdoutBuf : stderrBuf) + raw
      const lines = combined.split('\n')
      if (stream === 'stdout') stdoutBuf = lines.pop() || ''
      else stderrBuf = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.replace(/\r$/, '')
        if (!trimmed) continue
        const parsed = this.parseLogLine(trimmed)
        this.pushLine(state!, parsed.level, parsed.text)
        // Detect "Done" message → server is online
        if (parsed.text.includes('Done (') && parsed.text.includes(')! For help, type "help"')) {
          state!.status = 'online'
          state!.startedAt = state!.startedAt || Date.now()
        }
        // Detect player join/leave
        const joinMatch = parsed.text.match(/^(\w[\w_]{2,15}) joined the game$/)
        if (joinMatch) {
          const name = joinMatch[1]
          if (!state!.members.includes(name)) state!.members.push(name)
        }
        const leaveMatch = parsed.text.match(/^(\w[\w_]{2,15}) left the game$/)
        if (leaveMatch) {
          const name = leaveMatch[1]
          state!.members = state!.members.filter((n) => n !== name)
        }
      }
      this.emit(opts.id)
    }

    proc.stdout?.on('data', (data: Buffer) => parseAndAppend(data.toString('utf8'), 'stdout'))
    proc.stderr?.on('data', (data: Buffer) => parseAndAppend(data.toString('utf8'), 'stderr'))

    proc.on('error', (err) => {
      this.pushLine(state!, 'ERROR', `[BlockHost/ERROR]: Process error: ${err.message}`)
      state!.status = 'crashed'
      this.emit(opts.id)
    })

    proc.on('exit', (code, signal) => {
      if (state!.pendingForceKill) { clearTimeout(state!.pendingForceKill); state!.pendingForceKill = null }
      const wasStopping = state!.status === 'stopping'
      state!.status = 'offline'
      state!.stoppedAt = Date.now()
      state!.pid = null
      state!.proc = null
      state!.cpu = 0
      state!.ram = 0
      state!.members = []
      state!.playitAddress = null
      if (code === 0 || wasStopping) {
        this.pushLine(state!, 'INFO', `[BlockHost/INFO]: Server process exited (code ${code}).`)
      } else {
        state!.status = 'crashed'
        this.pushLine(state!, 'ERROR', `[BlockHost/ERROR]: Server process exited unexpectedly (code ${code}, signal ${signal}).`)
      }
      this.emit(opts.id)
    })

    // Servers are PRIVATE by default — they only listen on the local network
    // (0.0.0.0:<port>) and are not exposed to the internet. Players on the same
    // LAN can connect directly. To expose a server publicly, the user must opt
    // in via the Tunnel tab (which starts the playit agent explicitly).
    this.pushLine(state, 'INFO', `[BlockHost/INFO]: Server will listen on 0.0.0.0:${opts.port} (private — LAN only by default)`)
    this.pushLine(state, 'INFO', `[BlockHost/INFO]: To expose this server publicly, open the Tunnel tab and start a playit.gg tunnel.`)
    // Note: playit agent is NOT auto-started here. The Tunnel tab drives it.

    return { ok: true }
  }

  stop(id: string): { ok: boolean; error?: string } {
    const state = this.processes.get(id)
    if (!state) return { ok: false, error: 'Server not registered' }
    if (!state.proc || state.status === 'offline' || state.status === 'stopping') {
      return { ok: false, error: 'Server is not running' }
    }
    state.status = 'stopping'
    this.pushLine(state, 'CMD', `[CONSOLE]: stop`)
    this.pushLine(state, 'INFO', `[Server thread/INFO]: Stopping the server`)
    this.emit(id)
    try {
      state.proc.stdin?.write('stop\n')
      state.proc.stdin?.end()
    } catch {}
    if (state.pendingForceKill) clearTimeout(state.pendingForceKill)
    state.pendingForceKill = setTimeout(() => {
      const s = this.processes.get(id)
      if (s && s.proc && s.status !== 'offline') {
        try {
          this.pushLine(s, 'WARN', `[BlockHost/WARN]: Server did not stop gracefully within ${STOP_TIMEOUT_MS / 1000}s — force killing.`)
          s.proc.kill('SIGKILL')
        } catch {}
        this.emit(id)
      }
    }, STOP_TIMEOUT_MS)
    return { ok: true }
  }

  async restart(opts: ServerOpts): Promise<{ ok: boolean; error?: string }> {
    const state = this.processes.get(opts.id)
    if (!state) {
      return await this.start(opts)
    }
    if (state.status === 'online' || state.status === 'starting') {
      this.stop(opts.id)
      await new Promise((r) => setTimeout(r, 4000))
      return await this.start(opts)
    } else {
      return await this.start(opts)
    }
  }

  sendCommand(id: string, command: string): { ok: boolean; error?: string } {
    const state = this.processes.get(id)
    if (!state) return { ok: false, error: 'Server not registered' }
    if (state.status !== 'online' || !state.proc) {
      return { ok: false, error: 'Server is not online' }
    }
    this.pushLine(state, 'CMD', `[CONSOLE]: ${command}`)
    this.emit(id)
    try {
      state.proc.stdin?.write(command + '\n')
    } catch (e: any) {
      return { ok: false, error: 'Failed to write to stdin: ' + e?.message }
    }
    return { ok: true }
  }

  private parseLogLine(line: string): { level: 'INFO' | 'WARN' | 'ERROR' | 'CMD'; text: string } {
    const m = line.match(/^\[\d{2}:\d{2}:\d{2}\]\s*\[([^\]]+)\/([^\]]+)\]:\s*(.*)$/)
    if (m) {
      const level = m[2].toUpperCase()
      const text = m[3]
      if (level === 'ERROR' || level === 'FATAL') return { level: 'ERROR', text }
      if (level === 'WARN') return { level: 'WARN', text }
      return { level: 'INFO', text }
    }
    if (/error|exception|failed/i.test(line)) return { level: 'ERROR', text: line }
    if (/warn/i.test(line)) return { level: 'WARN', text: line }
    return { level: 'INFO', text: line }
  }

  private sampleStats() {
    for (const [id, state] of this.processes.entries()) {
      if (!state.pid || state.status === 'offline' || state.status === 'crashed') continue
      try {
        const status = readFileSync(`/proc/${state.pid}/status`, 'utf8')
        const rssMatch = status.match(/^VmRSS:\s*(\d+)\s*kB/m)
        if (rssMatch) {
          state.ram = Math.round(parseInt(rssMatch[1], 10) / 1024)
        }
        const stat = readFileSync(`/proc/${state.pid}/stat`, 'utf8')
        const commEnd = stat.lastIndexOf(')')
        const afterComm = stat.slice(commEnd + 2).trim().split(/\s+/)
        const utime = parseInt(afterComm[11], 10)
        const stime = parseInt(afterComm[12], 10)
        const totalTicks = utime + stime
        const now = Date.now()
        if (state.lastCpuTime !== null && state.lastSampleAt !== null) {
          const dticks = totalTicks - state.lastCpuTime
          const dms = now - state.lastSampleAt
          const hz = 100
          const cpuPct = (dticks / hz) / (dms / 1000) * 100
          state.cpu = Math.max(0, Math.min(100, Math.round(cpuPct * 10) / 10))
        }
        state.lastCpuTime = totalTicks
        state.lastSampleAt = now
        this.emit(id)
      } catch (e) {
        // Process might have exited — ignore
      }
    }
  }

  private refreshPlayit() {
    const agent = getPlayitAgent()
    for (const [id, state] of this.processes.entries()) {
      if (state.status !== 'online' || !state.proc) continue
      // We don't know the port from ProcessState directly, but we can read it
      // from server.properties in the server dir
      const dir = this.serverDirs.get(id)
      if (!dir) continue
      try {
        const props = readFileSync(join(dir, 'server.properties'), 'utf8')
        const portMatch = props.match(/^server-port=(\d+)$/m)
        if (!portMatch) continue
        const port = parseInt(portMatch[1], 10)
        const tunnel = agent.getTunnelForPort(port)
        if (tunnel && tunnel.assignedAddress && tunnel.assignedAddress !== state.playitAddress) {
          state.playitAddress = tunnel.assignedAddress
          this.pushLine(state, 'INFO', `[BlockHost/INFO]: Public tunnel established: ${tunnel.assignedAddress}`)
          this.emit(id)
        }
      } catch {}
    }
  }

  // Allow the API to set the playit address manually (for tunnels created via the playit.gg web UI)
  setPlayitAddress(id: string, address: string | null) {
    const state = this.processes.get(id)
    if (!state) return
    state.playitAddress = address
    if (address) {
      this.pushLine(state, 'INFO', `[BlockHost/INFO]: Public playit.gg address set: ${address}`)
    }
    this.emit(id)
  }

  subscribe(id: string, listener: (s: ProcessState) => void): () => void {
    if (!this.listeners.has(id)) this.listeners.set(id, new Set())
    this.listeners.get(id)!.add(listener)
    const state = this.processes.get(id)
    if (state) listener(state)
    return () => {
      this.listeners.get(id)?.delete(listener)
    }
  }

  getConsoleSince(id: string, sinceTs: number) {
    const state = this.processes.get(id)
    if (!state) return []
    return state.consoleLines.filter((l) => l.ts > sinceTs)
  }

  getStats(id: string) {
    const state = this.processes.get(id)
    if (!state) return null
    const uptime = state.startedAt && (state.status === 'online' || state.status === 'starting' || state.status === 'stopping')
      ? Math.floor((Date.now() - state.startedAt) / 1000)
      : 0
    return {
      cpu: state.cpu,
      ram: state.ram,
      players: state.members.length,
      uptime,
      status: state.status,
      tickRate: state.status === 'online' ? 20.0 : 0,
      members: [...state.members],
      playitAddress: state.playitAddress,
      javaVersion: state.javaVersion,
    }
  }

  dispose() {
    if (this.statsTimer) clearInterval(this.statsTimer)
    if (this.playitTimer) clearInterval(this.playitTimer)
    for (const [, state] of this.processes.entries()) {
      if (state.pendingForceKill) clearTimeout(state.pendingForceKill)
      try { state.proc?.kill('SIGTERM') } catch {}
    }
    this.processes.clear()
    this.listeners.clear()
  }
}

function symlinkSafe(target: string, link: string) {
  try {
    symlinkSync(target, link, 'file')
  } catch (e: any) {
    // Try as a directory if file fails
    try { symlinkSync(target, link, 'dir') } catch {}
  }
}

const g = globalThis as GlobalThisWithEngine
if (!g.__mcEngine) {
  g.__mcEngine = new McEngine()
}

export function getEngine(): McEngine {
  return (globalThis as GlobalThisWithEngine).__mcEngine!
}
