import { ServerStatus } from '@/lib/store/app-store'

const MAP: Record<ServerStatus, { label: string; color: string; bg: string; dot: string }> = {
  offline:  { label: 'Offline',  color: 'text-zinc-400',  bg: 'bg-zinc-500/15',  dot: 'bg-zinc-500' },
  starting: { label: 'Starting', color: 'text-amber-300', bg: 'bg-amber-500/15', dot: 'bg-amber-400' },
  online:   { label: 'Online',   color: 'text-emerald-300', bg: 'bg-emerald-500/15', dot: 'bg-emerald-400' },
  stopping: { label: 'Stopping', color: 'text-orange-300', bg: 'bg-orange-500/15', dot: 'bg-orange-400' },
  crashed:  { label: 'Crashed',  color: 'text-red-300',   bg: 'bg-red-500/15',   dot: 'bg-red-500' },
}

export function StatusBadge({ status, pulse = false }: { status: ServerStatus; pulse?: boolean }) {
  const cfg = MAP[status] || MAP.offline
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} ${pulse && (status === 'online' || status === 'starting' || status === 'stopping') ? 'pulse-dot' : ''}`} />
      {cfg.label}
    </span>
  )
}

export function ServerTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    vanilla: 'bg-zinc-500/15 text-zinc-300',
    paper:   'bg-emerald-500/15 text-emerald-300',
    spigot:  'bg-amber-500/15 text-amber-300',
    forge:   'bg-orange-500/15 text-orange-300',
    fabric:  'bg-rose-500/15 text-rose-300',
  }
  const label = type.charAt(0).toUpperCase() + type.slice(1)
  return <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${colors[type] || colors.vanilla}`}>{label}</span>
}
