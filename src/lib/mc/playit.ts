// Playit.gg tunnel agent manager with inline claim flow.
//
// When the user starts a Minecraft server and doesn't have a playit secret yet,
// we generate a claim code, surface the URL in the Minecraft server's console
// (and in the website UI), then poll playit's API until the user accepts.
// Once accepted, we exchange the code for a permanent secret, store it on the
// user's account, and start the agent.
//
// API endpoints (from playit-cli source):
//   POST https://api.playit.gg/claim/setup    { code, agent_type, version } → ClaimSetupResponse
//   POST https://api.playit.gg/claim/exchange { code }                       → { secret_key }
//
// Claim flow:
//   1. Generate 5-byte hex code (10 chars)
//   2. URL = https://playit.gg/claim/<code>
//   3. Poll /claim/setup every 2s:
//        WaitingForUserVisit → user hasn't opened the URL yet
//        WaitingForUser      → user opened it, hasn't clicked "Approve"
//        UserAccepted        → ready to exchange
//        UserRejected        → user declined; abort
//   4. POST /claim/exchange → secret_key
//   5. Save secret to user account (so we don't re-claim next time)
//   6. Spawn `playit --secret <key>` as a long-running child process

import { spawn, ChildProcess } from 'child_process'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { randomBytes } from 'crypto'

const PROJECT_ROOT = process.cwd()
const PLAYIT_BIN = join(PROJECT_ROOT, 'mc-bin', 'playit')
const PLAYIT_DIR = join(PROJECT_ROOT, 'mc-bin', 'playit-data')
const SOCKET_PATH = join(PLAYIT_DIR, 'ipc.sock')
const SECRET_PATH = join(PLAYIT_DIR, 'secret.toml')
const LOG_PATH = join(PLAYIT_DIR, 'agent.log')
const API_BASE = 'https://api.playit.gg'

interface GlobalWithAgent {
  __playitAgent?: PlayitAgent
}

interface TunnelInfo {
  localPort: number
  proto: 'tcp' | 'udp'
  assignedAddress: string | null
  tunnelId?: string
}

// A pending claim flow — one at a time
interface PendingClaim {
  code: string
  url: string
  status: 'waiting_for_visit' | 'waiting_for_approval' | 'exchanging' | 'completed' | 'rejected' | 'error'
  secret?: string
  error?: string
  startedAt: number
  pollTimer: ReturnType<typeof setInterval> | null
  // Callback when claim completes (called with secret or null on failure)
  onComplete?: (secret: string | null, error?: string) => void
  // Logger function — pushes lines into the Minecraft console so the user sees the URL there
  log?: (level: 'INFO' | 'WARN' | 'ERROR', text: string) => void
}

class PlayitAgent {
  private proc: ChildProcess | null = null
  private pid: number | null = null
  private secret: string | null = null
  private status: 'stopped' | 'starting' | 'running' | 'error' = 'stopped'
  private lastError: string = ''
  private stdoutBuf = ''
  private tunnels = new Map<string, TunnelInfo>()
  private listeners = new Set<() => void>()
  private pendingClaim: PendingClaim | null = null

  isAvailable(): boolean {
    return existsSync(PLAYIT_BIN)
  }

  getStatus(): { status: string; secret: string | null; pid: number | null; lastError: string; tunnels: TunnelInfo[]; pendingClaim: PendingClaim | null } {
    return {
      status: this.status,
      secret: this.secret ? `${this.secret.slice(0, 4)}…${this.secret.slice(-4)}` : null,
      pid: this.pid,
      lastError: this.lastError,
      tunnels: Array.from(this.tunnels.values()),
      pendingClaim: this.pendingClaim ? { ...this.pendingClaim, pollTimer: undefined } : null,
    }
  }

  getPendingClaim(): PendingClaim | null {
    return this.pendingClaim
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  private emit() {
    for (const l of this.listeners) {
      try { l() } catch {}
    }
  }

  // Start a claim flow: generate code, surface URL in the Minecraft console,
  // poll until user accepts, exchange for secret, return it via onComplete.
  // The caller (engine) passes a `log` function that pushes lines into the
  // Minecraft server's console so the user sees the URL there.
  startClaimFlow(opts: {
    log?: (level: 'INFO' | 'WARN' | 'ERROR', text: string) => void
    onComplete: (secret: string | null, error?: string) => void
  }): { code: string; url: string } {
    // Cancel any existing claim flow
    if (this.pendingClaim?.pollTimer) {
      clearInterval(this.pendingClaim.pollTimer)
    }
    const code = randomBytes(5).toString('hex')
    const url = `https://playit.gg/claim/${code}`
    const pending: PendingClaim = {
      code,
      url,
      status: 'waiting_for_visit',
      startedAt: Date.now(),
      pollTimer: null,
      onComplete: opts.onComplete,
      log: opts.log,
    }
    this.pendingClaim = pending
    this.log(opts, 'INFO', `[BlockHost/INFO]: ── playit.gg tunnel setup ──`)
    this.log(opts, 'INFO', `[BlockHost/INFO]: To make this server public, open this URL in your browser:`)
    this.log(opts, 'INFO', `[BlockHost/INFO]: ${url}`)
    this.log(opts, 'INFO', `[BlockHost/INFO]: After you approve, your server will be reachable at a *.playit.gg address.`)
    this.emit()

    // Start polling
    let pollCount = 0
    pending.pollTimer = setInterval(async () => {
      pollCount++
      try {
        const res = await fetch(`${API_BASE}/claim/setup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: pending.code,
            agent_type: 'assignable',
            version: 'playit-blockhost-1.0',
          }),
        })
        const data = await res.json()
        // data shape: { status: 'success'|'fail', data: 'WaitingForUserVisit'|... }
        if (data.status !== 'success') {
          // Some transient API error — keep polling
          return
        }
        const setupStatus = data.data as string
        if (setupStatus === 'WaitingForUserVisit' && pending.status !== 'waiting_for_visit') {
          pending.status = 'waiting_for_visit'
          this.emit()
        } else if (setupStatus === 'WaitingForUser' && pending.status !== 'waiting_for_approval') {
          pending.status = 'waiting_for_approval'
          this.log(opts, 'INFO', `[BlockHost/INFO]: You opened the link — click "Approve" in your browser to confirm.`)
          this.emit()
        } else if (setupStatus === 'UserAccepted' && pending.status !== 'exchanging') {
          pending.status = 'exchanging'
          this.log(opts, 'INFO', `[BlockHost/INFO]: Approved! Exchanging claim for agent secret...`)
          this.emit()
          // Exchange the code for a secret
          try {
            const exRes = await fetch(`${API_BASE}/claim/exchange`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: pending.code }),
            })
            const exData = await exRes.json()
            if (exData.status !== 'success') {
              throw new Error(exData.data || 'exchange failed')
            }
            const secret = exData.data.secret_key as string
            pending.status = 'completed'
            pending.secret = secret
            if (pending.pollTimer) clearInterval(pending.pollTimer)
            this.log(opts, 'INFO', `[BlockHost/INFO]: Secret obtained. Starting playit agent...`)
            this.emit()
            // Start the agent with the new secret
            const startRes = this.start(secret)
            if (!startRes.ok) {
              this.log(opts, 'ERROR', `[BlockHost/ERROR]: Agent failed to start: ${startRes.error}`)
              opts.onComplete?.(null, startRes.error)
            } else {
              opts.onComplete?.(secret)
            }
          } catch (e: any) {
            pending.status = 'error'
            pending.error = e?.message || 'exchange failed'
            this.log(opts, 'ERROR', `[BlockHost/ERROR]: Failed to exchange claim: ${pending.error}`)
            if (pending.pollTimer) clearInterval(pending.pollTimer)
            opts.onComplete?.(null, pending.error)
            this.emit()
          }
        } else if (setupStatus === 'UserRejected' && pending.status !== 'rejected') {
          pending.status = 'rejected'
          this.log(opts, 'WARN', `[BlockHost/WARN]: You rejected the claim in your browser. Tunnel setup cancelled.`)
          if (pending.pollTimer) clearInterval(pending.pollTimer)
          opts.onComplete?.(null, 'User rejected the claim')
          this.emit()
        }
      } catch (e) {
        // Network error — keep polling
      }
      // Auto-cancel after 10 minutes
      if (pollCount > 300) {
        if (pending.pollTimer) clearInterval(pending.pollTimer)
        pending.status = 'error'
        pending.error = 'Claim timed out after 10 minutes'
        this.log(opts, 'WARN', `[BlockHost/WARN]: Claim timed out after 10 minutes. Restart the server to try again.`)
        opts.onComplete?.(null, pending.error)
        this.emit()
      }
    }, 2000)

    return { code, url }
  }

  cancelClaimFlow() {
    if (this.pendingClaim?.pollTimer) {
      clearInterval(this.pendingClaim.pollTimer)
    }
    this.pendingClaim = null
    this.emit()
  }

  // Full reset: cancel any pending claim flow AND stop the running agent.
  // Used when the user wants to start over with a fresh playit.gg account —
  // e.g., they paired to the wrong account, or they want to release the
  // current agent and claim a new one.
  // The caller is responsible for clearing the saved secret from the user's
  // account in the DB (so the next server start triggers a fresh claim flow).
  reset(): { ok: boolean } {
    // Cancel any pending claim flow
    if (this.pendingClaim?.pollTimer) {
      clearInterval(this.pendingClaim.pollTimer)
    }
    this.pendingClaim = null
    // Stop the running agent (if any)
    if (this.proc) {
      try { this.proc.kill('SIGTERM') } catch {}
      // Force kill after 3s
      setTimeout(() => {
        if (this.proc) {
          try { this.proc.kill('SIGKILL') } catch {}
        }
      }, 3000)
    }
    this.status = 'stopped'
    this.pid = null
    this.secret = null
    this.lastError = ''
    this.tunnels.clear()
    this.emit()
    return { ok: true }
  }

  private log(opts: { log?: (level: 'INFO' | 'WARN' | 'ERROR', text: string) => void }, level: 'INFO' | 'WARN' | 'ERROR', text: string) {
    try { opts.log?.(level, text) } catch {}
  }

  // Start the agent with the given secret. If already running with the same secret, no-op.
  ensureRunning(secret: string): { ok: boolean; error?: string } {
    if (!existsSync(PLAYIT_BIN)) {
      return { ok: false, error: 'playit binary not installed' }
    }
    if (!secret || secret.length < 10) {
      return { ok: false, error: 'invalid playit secret' }
    }
    if (this.status === 'running' && this.secret === secret) {
      return { ok: true }
    }
    if (this.status === 'running' && this.secret !== secret) {
      this.stop()
    }
    return this.start(secret)
  }

  private start(secret: string): { ok: boolean; error?: string } {
    mkdirSync(PLAYIT_DIR, { recursive: true })
    this.secret = secret
    this.status = 'starting'
    this.lastError = ''
    this.stdoutBuf = ''
    try {
      // NOTE: --secret and --secret-path are mutually exclusive in the playit binary.
      // When using --secret (inline), we must NOT pass --secret-path.
      this.proc = spawn(PLAYIT_BIN, [
        '--secret', secret,
        '--socket-path', SOCKET_PATH,
        '--log-path', LOG_PATH,
      ], {
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env },
        detached: false,
      })
    } catch (e: any) {
      this.status = 'error'
      this.lastError = `Failed to spawn: ${e?.message || e}`
      this.emit()
      return { ok: false, error: this.lastError }
    }
    this.pid = this.proc?.pid ?? null

    this.proc.stdout?.on('data', (data: Buffer) => {
      this.stdoutBuf += data.toString('utf8')
      let idx
      while ((idx = this.stdoutBuf.indexOf('\n')) >= 0) {
        const line = this.stdoutBuf.slice(0, idx).trim()
        this.stdoutBuf = this.stdoutBuf.slice(idx + 1)
        this.handleLine(line)
      }
    })
    this.proc.stderr?.on('data', (data: Buffer) => {
      this.stdoutBuf += data.toString('utf8')
      let idx
      while ((idx = this.stdoutBuf.indexOf('\n')) >= 0) {
        const line = this.stdoutBuf.slice(0, idx).trim()
        this.stdoutBuf = this.stdoutBuf.slice(idx + 1)
        this.handleLine(line)
      }
    })
    this.proc.on('error', (err) => {
      this.status = 'error'
      this.lastError = `Process error: ${err.message}`
      this.pid = null
      this.emit()
    })
    this.proc.on('exit', (code, signal) => {
      this.status = 'stopped'
      this.pid = null
      this.proc = null
      if (code !== 0) {
        this.lastError = `Agent exited with code ${code} (signal ${signal})`
      }
      this.emit()
    })
    setTimeout(() => {
      if (this.status === 'starting') {
        this.status = 'running'
        this.emit()
      }
    }, 5000)
    this.emit()
    return { ok: true }
  }

  private handleLine(line: string) {
    const lower = line.toLowerCase()
    if (lower.includes('playit.gg') || lower.includes('tunnel')) {
      const portMatch = line.match(/port[:\s]+(\d+)/i)
      const addrMatch = line.match(/([\w-]+(?:\.[\w-]+)+\.playit\.gg)[:\s]*(\d+)/i)
      if (portMatch && addrMatch) {
        const localPort = parseInt(portMatch[1], 10)
        const assigned = `${addrMatch[1]}:${addrMatch[2]}`
        const proto: 'tcp' | 'udp' = lower.includes('udp') ? 'udp' : 'tcp'
        const key = `${proto}:${localPort}`
        this.tunnels.set(key, { localPort, proto, assignedAddress: assigned })
        this.emit()
      }
    }
    if (line.toLowerCase().includes('error') || line.toLowerCase().includes('failed')) {
      this.lastError = line.slice(0, 200)
    }
  }

  stop() {
    if (this.proc) {
      try { this.proc.kill('SIGTERM') } catch {}
      setTimeout(() => {
        if (this.proc) {
          try { this.proc.kill('SIGKILL') } catch {}
        }
      }, 3000)
    }
    this.status = 'stopped'
    this.pid = null
    this.tunnels.clear()
    this.emit()
  }

  setTunnelAddress(localPort: number, address: string, proto: 'tcp' | 'udp' = 'tcp') {
    const key = `${proto}:${localPort}`
    this.tunnels.set(key, { localPort, proto, assignedAddress: address })
    this.emit()
  }

  getTunnelForPort(localPort: number, proto: 'tcp' | 'udp' = 'tcp'): TunnelInfo | null {
    const key = `${proto}:${localPort}`
    return this.tunnels.get(key) || null
  }
}

const g = globalThis as GlobalWithAgent
if (!g.__playitAgent) {
  g.__playitAgent = new PlayitAgent()
}

export function getPlayitAgent(): PlayitAgent {
  return (globalThis as GlobalWithAgent).__playitAgent!
}

export function isPlayitInstalled(): boolean {
  return existsSync(PLAYIT_BIN)
}
