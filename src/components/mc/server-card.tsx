'use client'

import { useApp, McServer } from '@/lib/store/app-store'
import { useState } from 'react'
import { StatusBadge, ServerTypeBadge } from './status'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Cpu, MemoryStick, Users, Play, Square, RotateCcw, Trash2,
  ChevronRight, Globe, Hash, Activity, Box,
} from 'lucide-react'
import { toast } from 'sonner'

export function ServerCard({ server }: { server: McServer }) {
  const openServer = useApp((s) => s.openServer)
  const rtStats = useApp((s) => s.rtStats[server.id])
  const rtStatus = useApp((s) => s.rtStatus[server.id]) || server.status
  const rtMembers = useApp((s) => s.rtMembers[server.id]) || []
  const deleteServer = useApp((s) => s.deleteServer)
  const startServer = useApp((s) => s.startServer)
  const stopServer = useApp((s) => s.stopServer)
  const restartServer = useApp((s) => s.restartServer)
  const subscribeRealtime = useApp((s) => s.subscribeRealtime)
  const [busy, setBusy] = useState(false)

  const stats = rtStats || { cpu: server.cpu, ram: server.ram, players: server.players, uptime: server.uptime, tickRate: server.tickRate, status: server.status }

  const handleStart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setBusy(true)
    try {
      subscribeRealtime(server)
      await startServer(server.id)
      toast.success('Server is booting — real Java process starting...')
    } catch (e: any) {
      toast.error(e?.message || 'Failed to start server')
    } finally { setBusy(false) }
  }

  const handleStop = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setBusy(true)
    try {
      await stopServer(server.id)
      toast.info('Sending stop command to Java process...')
    } catch (e: any) {
      toast.error(e?.message || 'Failed to stop server')
    } finally { setBusy(false) }
  }

  const handleRestart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setBusy(true)
    try {
      await restartServer(server.id)
      toast.info('Restarting server...')
    } catch (e: any) {
      toast.error(e?.message || 'Failed to restart server')
    } finally { setBusy(false) }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Delete server "${server.name}"? This cannot be undone and the world will be lost.`)) return
    await deleteServer(server.id)
  }

  const ramPct = server.ramMax > 0 ? Math.min(100, (stats.ram / server.ramMax) * 100) : 0

  return (
    <Card
      onClick={() => openServer(server.id)}
      className="group relative cursor-pointer overflow-hidden border-border/60 bg-card/80 p-0 transition-all hover:border-primary/40 hover:bg-card/90 fade-up"
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${rtStatus === 'online' ? 'bg-emerald-500' : rtStatus === 'starting' ? 'bg-amber-400' : rtStatus === 'stopping' ? 'bg-orange-400' : rtStatus === 'crashed' ? 'bg-red-500' : 'bg-zinc-700'}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded bg-emerald-500/15 text-emerald-300">
                <Box className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold">{server.name}</h3>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ServerTypeBadge type={server.type} />
                  <span className="text-zinc-600">·</span>
                  <span>v{server.version}</span>
                </div>
              </div>
            </div>
          </div>
          <StatusBadge status={rtStatus} pulse />
        </div>

        {/* Host */}
        <div className="mt-3 flex items-center gap-1.5 rounded-md bg-muted/40 px-2 py-1.5 text-xs font-mono text-muted-foreground">
          <Globe className="h-3.5 w-3.5 text-emerald-400" />
          <span className="truncate">{server.host}</span>
          <span className="ml-auto inline-flex items-center gap-1 text-zinc-500">
            <Hash className="h-3 w-3" />{server.port}
          </span>
        </div>

        {/* Stats grid */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Stat icon={<Cpu className="h-3.5 w-3.5" />} label="CPU" value={rtStatus === 'offline' ? '—' : `${stats.cpu.toFixed(0)}%`} />
          <Stat icon={<MemoryStick className="h-3.5 w-3.5" />} label="RAM" value={rtStatus === 'offline' ? '—' : `${Math.round(stats.ram)} / ${Math.min(server.ramMax, 768)} MB`} bar={ramPct} />
          <Stat icon={<Users className="h-3.5 w-3.5" />} label="Players" value={`${stats.players} / ${server.maxPlayers}`} />
          <Stat icon={<Activity className="h-3.5 w-3.5" />} label="TPS" value={rtStatus === 'online' ? `${stats.tickRate.toFixed(1)}` : '—'} />
        </div>

        {/* Members preview */}
        {rtMembers.length > 0 && (
          <div className="mt-3 flex items-center gap-1 overflow-hidden text-xs text-muted-foreground">
            <Activity className="h-3 w-3 shrink-0 text-emerald-400" />
            <span className="truncate">{rtMembers.slice(0, 6).join(', ')}{rtMembers.length > 6 ? ` +${rtMembers.length - 6}` : ''}</span>
          </div>
        )}

        {/* Controls */}
        <div className="mt-4 flex items-center gap-1.5">
          {rtStatus === 'offline' || rtStatus === 'crashed' ? (
            <Button size="sm" variant="default" disabled={busy} onClick={handleStart} className="gap-1.5 bg-emerald-500 text-black hover:bg-emerald-400">
              <Play className="h-3.5 w-3.5" /> Start
            </Button>
          ) : rtStatus === 'online' ? (
            <Button size="sm" variant="default" disabled={busy} onClick={handleRestart} className="gap-1.5 bg-amber-500 text-black hover:bg-amber-400">
              <RotateCcw className="h-3.5 w-3.5" /> Restart
            </Button>
          ) : (
            <Button size="sm" variant="secondary" disabled className="gap-1.5">
              <Activity className="h-3.5 w-3.5" /> Busy…
            </Button>
          )}

          {(rtStatus === 'online' || rtStatus === 'starting') && (
            <Button size="sm" variant="outline" disabled={busy} onClick={handleStop} className="gap-1.5 border-red-500/30 text-red-300 hover:bg-red-500/10">
              <Square className="h-3.5 w-3.5" /> Stop
            </Button>
          )}

          <Button size="sm" variant="ghost" onClick={handleDelete} className="ml-auto gap-1.5 text-muted-foreground hover:text-red-300 hover:bg-red-500/10">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => openServer(server.id)} className="gap-1 text-emerald-300 hover:bg-emerald-500/10">
            Manage <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

function Stat({ icon, label, value, bar }: { icon: React.ReactNode; label: string; value: string; bar?: number }) {
  return (
    <div className="rounded-md bg-muted/40 px-2.5 py-2">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-xs font-medium font-mono">{value}</div>
      {bar !== undefined && (
        <div className="mt-1 h-1 w-full overflow-hidden rounded bg-zinc-700">
          <div className="h-full rounded bg-emerald-500" style={{ width: `${bar}%` }} />
        </div>
      )}
    </div>
  )
}
