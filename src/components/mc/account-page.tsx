'use client'

import { useEffect, useState } from 'react'
import { useApp } from '@/lib/store/app-store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'
import {
  ArrowLeft, Cpu, MemoryStick, Users, Server, Activity, Wifi, Clock,
  RefreshCw, Settings, LogOut, Zap, HardDrive, TrendingUp, Globe,
} from 'lucide-react'

interface SystemStats {
  cpuPercent: number
  memory: { totalMb: number; availableMb: number; usedMb: number; usedPercent: number }
  loadAverage: number[]
  uptime: number
}

interface PlatformStats {
  activeSessions: number
  totalUsers: number
  totalServers: number
  serversRunning: number
  serversOffline: number
  serversStopping: number
  totalPlayers: number
  runningServerIds: string[]
}

interface EngineStats {
  totalCpuPercent: number
  totalRamMb: number
  runningCount: number
}

interface Stats {
  system: SystemStats
  platform: PlatformStats
  engine: EngineStats
}

function fmtUptime(seconds: number): string {
  if (!seconds) return '—'
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function AccountPage() {
  const setView = useApp((s) => s.setView)
  const user = useApp((s) => s.user)
  const logout = useApp((s) => s.logout)
  const servers = useApp((s) => s.servers)
  const openServer = useApp((s) => s.openServer)
  const fetchServers = useApp((s) => s.fetchServers)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats/system', { cache: 'no-store' })
      const data = await res.json()
      if (res.ok) setStats(data)
    } catch (e) {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchServers()
    const t = setInterval(fetchStats, 3000) // refresh every 3s
    return () => clearInterval(t)
  }, [fetchServers])

  if (!user) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Sign in to view your account.</p>
        <Button onClick={() => setView('home')} className="mt-3">Back to home</Button>
      </div>
    )
  }

  const myServers = servers.filter((s) => s.ownerId === user.id || s.ownerId === 'guest')
  const myRunning = myServers.filter((s) => s.status === 'online' || s.status === 'starting').length
  const myOffline = myServers.filter((s) => s.status === 'offline' || s.status === 'crashed').length

  return (
    <div className="fade-up">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="sm" onClick={() => setView('home')} className="mt-0.5 gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-emerald-500/15 text-base font-medium text-emerald-300">
              {user.name?.slice(0, 2).toUpperCase() || user.email?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchStats} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button variant="ghost" size="sm" onClick={async () => { await logout(); setView('home'); toast.success('Logged out') }} className="gap-1.5 text-red-300 hover:text-red-200 hover:bg-red-500/10">
            <LogOut className="h-3.5 w-3.5" /> Log out
          </Button>
        </div>
      </div>

      {/* System resource cards */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ResourceCard
          icon={<Cpu className="h-4 w-4" />}
          label="Host CPU Usage"
          value={loading ? '…' : `${stats?.system.cpuPercent.toFixed(1) || '0'}%`}
          sub={loading ? '' : `Load: ${(stats?.system.loadAverage || [0, 0, 0]).map((l) => l.toFixed(2)).join(' · ')}`}
          progress={loading ? 0 : stats?.system.cpuPercent || 0}
          accent="emerald"
        />
        <ResourceCard
          icon={<MemoryStick className="h-4 w-4" />}
          label="Host Memory"
          value={loading ? '…' : `${stats?.system.memory.usedMb || 0} / ${stats?.system.memory.totalMb || 0} MB`}
          sub={loading ? '' : `${stats?.system.memory.availableMb || 0} MB available`}
          progress={loading ? 0 : stats?.system.memory.usedPercent || 0}
          accent="amber"
        />
        <ResourceCard
          icon={<Server className="h-4 w-4" />}
          label="Engine CPU (servers)"
          value={loading ? '…' : `${stats?.engine.totalCpuPercent.toFixed(1) || 0}%`}
          sub={loading ? '' : `${stats?.engine.runningCount || 0} Java process${(stats?.engine.runningCount || 0) === 1 ? '' : 'es'} · ${stats?.engine.totalRamMb || 0} MB RAM`}
          progress={loading ? 0 : stats?.engine.totalCpuPercent || 0}
          accent="emerald"
        />
        <ResourceCard
          icon={<Users className="h-4 w-4" />}
          label="Active on website"
          value={loading ? '…' : String(stats?.platform.activeSessions || 0)}
          sub={`of ${stats?.platform.totalUsers || 0} registered users`}
          progress={loading ? 0 : Math.min(100, (stats?.platform.activeSessions || 0) * 10)}
          accent="sky"
        />
      </div>

      {/* Server counts */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <CountCard
          icon={<Activity className="h-4 w-4 text-emerald-400" />}
          label="Servers running"
          value={loading ? '…' : String(stats?.platform.serversRunning || 0)}
          sub={`of ${stats?.platform.totalServers || 0} total`}
          accent="emerald"
        />
        <CountCard
          icon={<Server className="h-4 w-4 text-zinc-400" />}
          label="Servers offline"
          value={loading ? '…' : String(stats?.platform.serversOffline || 0)}
          sub={`${stats?.platform.serversStopping || 0} stopping`}
          accent="zinc"
        />
        <CountCard
          icon={<Users className="h-4 w-4 text-sky-400" />}
          label="Players online"
          value={loading ? '…' : String(stats?.platform.totalPlayers || 0)}
          sub="across all servers"
          accent="sky"
        />
        <CountCard
          icon={<Clock className="h-4 w-4 text-amber-400" />}
          label="Host uptime"
          value={loading ? '…' : fmtUptime(stats?.system.uptime || 0)}
          sub="since last boot"
          accent="amber"
        />
      </div>

      {/* My servers */}
      <Card className="mt-4 border-border/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-medium">My servers</h3>
            <Badge variant="outline" className="text-[10px]">{myServers.length}</Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="text-emerald-300">{myRunning} running</span>
            <span className="mx-1.5">·</span>
            <span className="text-zinc-400">{myOffline} offline</span>
          </div>
        </div>

        <div className="mt-3 min-h-[100px] rounded-md border border-border/50 bg-muted/20 p-2">
          {myServers.length === 0 ? (
            <div className="flex h-[100px] flex-col items-center justify-center text-center text-xs text-muted-foreground">
              <Server className="mb-1 h-5 w-5 opacity-40" />
              You don&apos;t have any servers yet. Create one from the dashboard.
            </div>
          ) : (
            <ul className="divide-y divide-border/40">
              {myServers.map((s) => {
                const isRunning = s.status === 'online' || s.status === 'starting'
                return (
                  <li key={s.id} className="flex items-center gap-3 py-2">
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isRunning ? 'bg-emerald-400 pulse-dot' : 'bg-zinc-600'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{s.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.type} · v{s.version} · {s.status} · {s.players}/{s.maxPlayers} players · port {s.port}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => openServer(s.id)} className="text-xs">
                      Manage
                    </Button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </Card>

      {/* Account details */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card className="border-border/60 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Settings className="h-4 w-4 text-emerald-400" /> Account details
          </div>
          <dl className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Display name</dt>
              <dd className="font-medium">{user.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-mono">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">User ID</dt>
              <dd className="font-mono text-[10px]">{user.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">playit.gg</dt>
              <dd>{user.hasPlayit ? <Badge className="bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/15">Configured</Badge> : <Badge variant="outline" className="text-muted-foreground">Not set</Badge>}</dd>
            </div>
          </dl>
        </Card>

        <Card className="border-border/60 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="h-4 w-4 text-emerald-400" /> Platform totals
          </div>
          <dl className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Total users</dt>
              <dd className="font-medium">{stats?.platform.totalUsers ?? '…'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Total servers</dt>
              <dd className="font-medium">{stats?.platform.totalServers ?? '…'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Running servers</dt>
              <dd className="font-medium text-emerald-300">{stats?.platform.serversRunning ?? '…'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Offline servers</dt>
              <dd className="font-medium text-zinc-400">{stats?.platform.serversOffline ?? '…'}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  )
}

function ResourceCard({ icon, label, value, sub, progress, accent }: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  progress: number
  accent: 'emerald' | 'amber' | 'sky' | 'zinc'
}) {
  const colorMap = {
    emerald: 'text-emerald-300',
    amber: 'text-amber-300',
    sky: 'text-sky-300',
    zinc: 'text-zinc-300',
  }
  const barColor = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    sky: 'bg-sky-500',
    zinc: 'bg-zinc-500',
  }
  return (
    <Card className="border-border/60 p-3">
      <div className={`flex items-center gap-2 text-xs text-muted-foreground ${colorMap[accent]}`}>
        <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
        {label}
      </div>
      <div className="mt-1.5 font-mono text-lg font-semibold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      <Progress value={Math.max(0, Math.min(100, progress))} className={`mt-2 h-1.5 ${barColor[accent]}`} />
    </Card>
  )
}

function CountCard({ icon, label, value, sub, accent }: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  accent: 'emerald' | 'amber' | 'sky' | 'zinc'
}) {
  return (
    <Card className="border-border/60 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1.5 font-mono text-xl font-bold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </Card>
  )
}
