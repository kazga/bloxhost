import { create } from 'zustand'

export type ServerType = 'vanilla' | 'paper' | 'spigot' | 'forge' | 'fabric'
export type ServerStatus = 'offline' | 'starting' | 'online' | 'stopping' | 'crashed'

export interface McServer {
  id: string
  name: string
  type: ServerType
  version: string
  status: ServerStatus
  motd: string
  host: string
  port: number
  maxPlayers: number
  players: number
  cpu: number
  ram: number
  ramMax: number
  uptime: number
  tickRate: number
  difficulty: string
  gamemode: string
  pvp: boolean
  whitelist: boolean
  ownerId: string
  ownerName: string
  worldName: string
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
  // Tunneling
  playitAddress: string | null
  createdAt: string
  updatedAt: string
}

export interface ConsoleLine {
  id: string
  ts: number
  level: 'INFO' | 'WARN' | 'ERROR' | 'CMD'
  text: string
}

export interface CurrentUser {
  id: string
  email: string
  name: string
  hasPlayit: boolean
  playitMasked: string | null
}

type View = 'home' | 'dashboard' | 'detail' | 'account'

interface AppState {
  view: View
  activeServerId: string | null
  setView: (v: View) => void
  openServer: (id: string) => void

  // Auth
  user: CurrentUser | null
  authLoading: boolean
  fetchUser: () => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<{ ok: boolean; error?: string }>
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  updateAccount: (patch: { playitSecret?: string; name?: string }) => Promise<{ ok: boolean; error?: string }>

  // Servers
  servers: McServer[]
  loadingServers: boolean
  fetchServers: () => Promise<void>
  createServer: (input: any) => Promise<McServer | null>
  deleteServer: (id: string) => Promise<boolean>
  updateServer: (id: string, patch: any) => Promise<boolean>

  // Realtime
  rtStats: Record<string, { cpu: number; ram: number; players: number; uptime: number; tickRate: number; status: string; playitAddress?: string | null; javaVersion?: number }>
  rtStatus: Record<string, ServerStatus>
  rtMembers: Record<string, string[]>
  rtConsole: Record<string, ConsoleLine[]>
  subscribeRealtime: (server: McServer) => () => void

  // Server actions
  startServer: (id: string) => Promise<boolean>
  stopServer: (id: string) => Promise<boolean>
  restartServer: (id: string) => Promise<boolean>
  sendCommand: (id: string, cmd: string) => Promise<boolean>
  setTunnelAddress: (id: string, address: string) => Promise<boolean>
}

const pollJobs = new Map<string, { timer: ReturnType<typeof setInterval> }>()

export const useApp = create<AppState>((set, get) => ({
  view: 'home',
  activeServerId: null,
  setView: (v) => set({ view: v }),
  openServer: (id) => set({ view: 'detail', activeServerId: id }),

  user: null,
  authLoading: true,

  async fetchUser() {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      const data = await res.json()
      set({ user: data.user, authLoading: false })
    } catch {
      set({ authLoading: false })
    }
  },

  async signup(email, password, name) {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data?.error || 'Signup failed' }
      // Auto-login after signup
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!loginRes.ok) return { ok: false, error: 'Account created but auto-login failed' }
      await get().fetchUser()
      await get().fetchServers()
      return { ok: true }
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Signup failed' }
    }
  },

  async login(email, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data?.error || 'Login failed' }
      await get().fetchUser()
      await get().fetchServers()
      return { ok: true }
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Login failed' }
    }
  },

  async logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    set({ user: null })
    await get().fetchServers()
  },

  async updateAccount(patch) {
    try {
      const res = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: data?.error || 'Update failed' }
      await get().fetchUser()
      return { ok: true }
    } catch (e: any) {
      return { ok: false, error: e?.message || 'Update failed' }
    }
  },

  servers: [],
  loadingServers: false,

  async fetchServers() {
    set({ loadingServers: true })
    try {
      const res = await fetch('/api/servers', { cache: 'no-store' })
      if (!res.ok) throw new Error('fetch failed')
      const data = await res.json()
      const servers: McServer[] = data.servers || []
      const rtStats = { ...get().rtStats }
      const rtStatus = { ...get().rtStatus }
      for (const s of servers) {
        rtStats[s.id] = rtStats[s.id] || { cpu: s.cpu, ram: s.ram, players: s.players, uptime: s.uptime, tickRate: s.tickRate, status: s.status, playitAddress: s.playitAddress }
        rtStatus[s.id] = rtStatus[s.id] || s.status
      }
      set({ servers, rtStats, rtStatus, loadingServers: false })
    } catch (e) {
      console.error('fetchServers error', e)
      set({ loadingServers: false })
    }
  },

  async createServer(input) {
    const res = await fetch('/api/servers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || 'Failed to create server')
    await get().fetchServers()
    return data.server as McServer
  },

  async deleteServer(id) {
    try {
      const res = await fetch(`/api/servers/${id}`, { method: 'DELETE' })
      if (!res.ok) return false
      const job = pollJobs.get(id)
      if (job) { clearInterval(job.timer); pollJobs.delete(id) }
      const cur = get().servers.filter((s) => s.id !== id)
      const rtStats = { ...get().rtStats }
      const rtStatus = { ...get().rtStatus }
      const rtConsole = { ...get().rtConsole }
      const rtMembers = { ...get().rtMembers }
      delete rtStats[id]
      delete rtStatus[id]
      delete rtConsole[id]
      delete rtMembers[id]
      set({ servers: cur, rtStats, rtStatus, rtConsole, rtMembers })
      return true
    } catch (e) {
      console.error('deleteServer error', e)
      return false
    }
  },

  async updateServer(id, patch) {
    try {
      const res = await fetch(`/api/servers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      if (!res.ok) return false
      await get().fetchServers()
      return true
    } catch (e) {
      console.error('updateServer error', e)
      return false
    }
  },

  rtStats: {},
  rtStatus: {},
  rtMembers: {},
  rtConsole: {},

  subscribeRealtime(server) {
    if (pollJobs.has(server.id)) return () => {}
    let sinceTs = 0
    const existing = get().rtConsole[server.id]
    if (existing && existing.length > 0) {
      sinceTs = existing[existing.length - 1].ts
    }

    const poll = async () => {
      try {
        const res = await fetch(`/api/servers/${server.id}/console?since=${sinceTs}`, { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        const newLines: ConsoleLine[] = (data.lines || []).map((l: any) => ({
          id: l.id, ts: l.ts, level: l.level as ConsoleLine['level'], text: l.text,
        }))
        if (newLines.length > 0) {
          sinceTs = newLines[newLines.length - 1].ts
          set((state) => {
            const prev = state.rtConsole[server.id] || []
            const merged = [...prev, ...newLines]
            if (merged.length > 500) merged.splice(0, merged.length - 500)
            return { rtConsole: { ...state.rtConsole, [server.id]: merged } }
          })
        }
        if (data.status) {
          set((state) => ({ rtStatus: { ...state.rtStatus, [server.id]: data.status as ServerStatus } }))
        }
        if (data.stats) {
          const s = data.stats
          set((state) => ({
            rtStats: { ...state.rtStats, [server.id]: { cpu: s.cpu, ram: s.ram, players: s.players, uptime: s.uptime, tickRate: s.tickRate, status: s.status, playitAddress: s.playitAddress, javaVersion: s.javaVersion } },
            rtMembers: { ...state.rtMembers, [server.id]: s.members || [] },
          }))
        }
      } catch (e) {
        // network error, retry next tick
      }
    }

    poll()
    const timer = setInterval(poll, 1500)
    pollJobs.set(server.id, { timer })

    return () => {
      const job = pollJobs.get(server.id)
      if (job) {
        clearInterval(job.timer)
        pollJobs.delete(server.id)
      }
    }
  },

  async startServer(id) {
    const res = await fetch(`/api/servers/${id}/start`, { method: 'POST' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data?.error || 'Failed to start')
    }
    set((state) => ({ rtStatus: { ...state.rtStatus, [id]: 'starting' } }))
    return true
  },

  async stopServer(id) {
    const res = await fetch(`/api/servers/${id}/stop`, { method: 'POST' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data?.error || 'Failed to stop')
    }
    set((state) => ({ rtStatus: { ...state.rtStatus, [id]: 'stopping' } }))
    return true
  },

  async restartServer(id) {
    const res = await fetch(`/api/servers/${id}/restart`, { method: 'POST' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data?.error || 'Failed to restart')
    }
    set((state) => ({ rtStatus: { ...state.rtStatus, [id]: 'starting' } }))
    return true
  },

  async sendCommand(id, cmd) {
    const res = await fetch(`/api/servers/${id}/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: cmd }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data?.error || 'Failed to send command')
    }
    return true
  },

  async setTunnelAddress(id, address) {
    const res = await fetch(`/api/servers/${id}/tunnel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    })
    if (!res.ok) return false
    set((state) => {
      const stats = state.rtStats[id]
      if (stats) {
        return { rtStats: { ...state.rtStats, [id]: { ...stats, playitAddress: address } } }
      }
      return state
    })
    return true
  },
}))
