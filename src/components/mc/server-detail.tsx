'use client'

import { useEffect, useRef, useState } from 'react'
import { useApp, McServer, ConsoleLine } from '@/lib/store/app-store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { StatusBadge, ServerTypeBadge } from './status'
import { ModsTab } from './mods-tab'
import { FilesTab } from './files-tab'
import {
  ArrowLeft, Play, Square, RotateCcw, Trash2, Send, Cpu, MemoryStick,
  Users, Activity, Globe, Hash, Copy, Server, Settings, Terminal,
  Shield, Zap, Info, ExternalLink, Link2, Loader2, Wifi, RefreshCw,
  Package, FolderOpen,
} from 'lucide-react'

function fmtUptime(seconds: number): string {
  if (!seconds || seconds <= 0) return '00:00:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const WORLD_TYPES = [
  { id: 'minecraft\\default', label: 'Default' },
  { id: 'minecraft\\flat', label: 'Superflat' },
  { id: 'minecraft\\large_biomes', label: 'Large Biomes' },
  { id: 'minecraft\\amplified', label: 'Amplified' },
  { id: 'minecraft\\single_biome', label: 'Single Biome' },
]

export function ServerDetail({ server }: { server: McServer }) {
  const setView = useApp((s) => s.setView)
  const rtStats = useApp((s) => s.rtStats[server.id])
  const rtStatus = useApp((s) => s.rtStatus[server.id]) || server.status
  const rtMembers = useApp((s) => s.rtMembers[server.id]) || []
  const rtConsole = useApp((s) => s.rtConsole[server.id]) || []
  const deleteServer = useApp((s) => s.deleteServer)
  const updateServer = useApp((s) => s.updateServer)
  const subscribeRealtime = useApp((s) => s.subscribeRealtime)
  const startServerAction = useApp((s) => s.startServer)
  const stopServerAction = useApp((s) => s.stopServer)
  const restartServerAction = useApp((s) => s.restartServer)
  const sendCommandAction = useApp((s) => s.sendCommand)
  const user = useApp((s) => s.user)

  const [busy, setBusy] = useState(false)
  const [cmd, setCmd] = useState('')
  const [tunnelInfo, setTunnelInfo] = useState<any>(null)

  // Settings local state
  const [motd, setMotd] = useState(server.motd)
  const [maxPlayers, setMaxPlayers] = useState(server.maxPlayers)
  const [ramMax, setRamMax] = useState(server.ramMax)
  const [difficulty, setDifficulty] = useState(server.difficulty)
  const [gamemode, setGamemode] = useState(server.gamemode)
  const [pvp, setPvp] = useState(server.pvp)
  const [whitelist, setWhitelist] = useState(server.whitelist)
  const [hardcore, setHardcore] = useState(server.hardcore)
  const [levelType, setLevelType] = useState(server.levelType)
  const [levelSeed, setLevelSeed] = useState(server.levelSeed)
  const [generateStructures, setGenerateStructures] = useState(server.generateStructures)
  const [viewDistance, setViewDistance] = useState(server.viewDistance)
  const [simulationDistance, setSimulationDistance] = useState(server.simulationDistance)
  const [spawnProtection, setSpawnProtection] = useState(server.spawnProtection)
  const [allowNether, setAllowNether] = useState(server.allowNether)
  const [allowFlight, setAllowFlight] = useState(server.allowFlight)
  const [enableCommandBlock, setEnableCommandBlock] = useState(server.enableCommandBlock)

  const consoleRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    subRef.current = subscribeRealtime(server)
    return () => { if (subRef.current) { subRef.current(); subRef.current = null } }
  }, [server.id, subscribeRealtime])

  // Fetch tunnel info periodically
  useEffect(() => {
    let mounted = true
    const fetchTunnel = () => {
      fetch(`/api/servers/${server.id}/tunnel`, { cache: 'no-store' })
        .then(r => r.json())
        .then(d => { if (mounted) setTunnelInfo(d) })
        .catch(() => {})
    }
    fetchTunnel()
    const t = setInterval(fetchTunnel, 4000)
    return () => { mounted = false; clearInterval(t) }
  }, [server.id])

  useEffect(() => {
    if (consoleRef.current) {
      const el = consoleRef.current
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
      if (nearBottom) el.scrollTop = el.scrollHeight
    }
  }, [rtConsole.length])

  const stats = rtStats || { cpu: server.cpu, ram: server.ram, players: server.players, uptime: server.uptime, tickRate: server.tickRate, status: server.status, playitAddress: server.playitAddress, javaVersion: 17 }
  const currentTunnel = stats.playitAddress || tunnelInfo?.tunnelAddress || server.playitAddress || null

  const startServer = async () => {
    setBusy(true)
    try {
      await startServerAction(server.id)
      toast.success('Server is booting — real Java process starting...')
    } catch (e: any) {
      toast.error(e?.message || 'Failed to start server')
    } finally { setBusy(false) }
  }

  const stopServer = async () => {
    setBusy(true)
    try {
      await stopServerAction(server.id)
      toast.info('Sending "stop" command to Java process...')
    } catch (e: any) {
      toast.error(e?.message || 'Failed to stop server')
    } finally { setBusy(false) }
  }

  const restartServer = async () => {
    setBusy(true)
    try {
      await restartServerAction(server.id)
      toast.info('Restarting server...')
    } catch (e: any) {
      toast.error(e?.message || 'Failed to restart server')
    } finally { setBusy(false) }
  }

  const sendCommand = async () => {
    if (!cmd.trim()) return
    if (rtStatus !== 'online') { toast.error('Server must be online to run commands'); return }
    try {
      await sendCommandAction(server.id, cmd)
      setCmd('')
    } catch (e: any) {
      toast.error(e?.message || 'Failed to send command')
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Delete server "${server.name}"? This cannot be undone and the world will be lost.`)) return
    await deleteServer(server.id)
    setView('dashboard')
    toast.success('Server deleted')
  }

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied`)
    } catch {
      toast.error('Copy failed — your browser blocked clipboard access')
    }
  }

  const saveSettings = async () => {
    setBusy(true)
    try {
      const ok = await updateServer(server.id, {
        motd, maxPlayers, ramMax, difficulty, gamemode, pvp, whitelist, hardcore,
        levelType, levelSeed, generateStructures,
        viewDistance, simulationDistance, spawnProtection,
        allowNether, allowFlight, enableCommandBlock,
      })
      if (ok) toast.success('Settings saved — restart the server to apply world changes')
      else toast.error('Failed to save settings')
    } finally { setBusy(false) }
  }

  const [resetBusy, setResetBusy] = useState(false)

  // Reset the playit claim: cancels any pending claim, stops the running agent,
  // clears the user's saved secret, and starts a fresh claim flow that
  // generates a new https://playit.gg/claim/<code> URL in the console.
  const resetPlayitLink = async () => {
    if (!confirm('Reset the playit.gg link? This will:\n• Cancel any pending claim\n• Stop the running playit agent\n• Clear your saved playit secret\n• Generate a fresh claim URL\n\nPlayers currently connected via the old tunnel will be disconnected.')) return
    setResetBusy(true)
    try {
      const res = await fetch('/api/playit/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serverId: server.id, startNew: true }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || 'Failed to reset')
        return
      }
      if (data.newClaim?.url) {
        toast.success(`New claim URL generated: ${data.newClaim.url}`)
      } else {
        toast.success('Playit reset. The next server start will generate a new claim URL.')
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to reset')
    } finally { setResetBusy(false) }
  }

  const ramPct = server.ramMax > 0 ? Math.min(100, (stats.ram / Math.min(server.ramMax, 768)) * 100) : 0

  return (
    <div className="fade-up">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="sm" onClick={() => setView('dashboard')} className="mt-0.5 gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{server.name}</h1>
              <StatusBadge status={rtStatus} pulse />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <ServerTypeBadge type={server.type} />
              <span className="text-zinc-600">·</span>
              <span>v{server.version}</span>
              <span className="text-zinc-600">·</span>
              <span>Owner: {server.ownerName}</span>
              <span className="text-zinc-600">·</span>
              <span>Created {new Date(server.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {rtStatus === 'offline' || rtStatus === 'crashed' ? (
            <Button size="sm" disabled={busy} onClick={startServer} className="gap-1.5 bg-emerald-500 text-black hover:bg-emerald-400">
              <Play className="h-3.5 w-3.5" /> Start
            </Button>
          ) : (
            <>
              <Button size="sm" disabled={busy} onClick={restartServer} className="gap-1.5 bg-amber-500 text-black hover:bg-amber-400">
                <RotateCcw className="h-3.5 w-3.5" /> Restart
              </Button>
              <Button size="sm" variant="outline" disabled={busy} onClick={stopServer} className="gap-1.5 border-red-500/30 text-red-300 hover:bg-red-500/10">
                <Square className="h-3.5 w-3.5" /> Stop
              </Button>
            </>
          )}
          <Button size="sm" variant="ghost" onClick={handleDelete} className="gap-1.5 text-muted-foreground hover:text-red-300 hover:bg-red-500/10">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      {/* Real-server banner */}
      <Card className="mt-4 border-emerald-500/30 bg-emerald-500/5 p-3">
        <div className="flex items-start gap-2 text-sm">
          <Wifi className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <div className="flex-1">
            <div className="font-medium text-emerald-300">
              Real Java {stats.javaVersion || 17} server · listening on <span className="font-mono">0.0.0.0:{server.port}</span>
            </div>
            <div className="mt-0.5 text-xs text-emerald-200/80">
              The console below streams actual output from a real <span className="font-mono">java -jar server.jar</span> process.
              This server is <span className="font-medium text-amber-300">private</span> — only reachable on the local network by default.
              To expose it publicly, open the <span className="font-medium">Tunnel</span> tab and start a playit.gg tunnel.
            </div>
          </div>
        </div>
      </Card>

      {/* Connection bar — playit public address (servers are private by default, no local address shown) */}
      <div className="mt-4">
        <Card className={`flex items-center gap-3 border p-3 ${currentTunnel ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border/60'}`}>
          <Link2 className={`h-4 w-4 shrink-0 ${currentTunnel ? 'text-emerald-400' : 'text-muted-foreground'}`} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
              playit.gg public address
              {tunnelInfo?.installed && (
                <Badge variant="outline" className="px-1 py-0 text-[9px] text-emerald-300">installed</Badge>
              )}
            </div>
            {currentTunnel ? (
              <div className="truncate font-mono text-sm text-emerald-300">{currentTunnel}</div>
            ) : (
              <div className="truncate text-sm text-muted-foreground">
                {user?.hasPlayit ? 'Waiting for tunnel assignment…' : 'Not configured — set playit secret in account settings'}
              </div>
            )}
          </div>
          {currentTunnel && (
            <Button size="sm" variant="outline" onClick={() => copyText(currentTunnel, 'Public address')} className="gap-1.5">
              <Copy className="h-3.5 w-3.5" /> Copy
            </Button>
          )}
        </Card>
      </div>

      {/* Stat cards */}
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={<Cpu />} label="CPU Usage" value={`${stats.cpu.toFixed(1)}%`} accent="bg-emerald-500" pct={stats.cpu} />
        <StatCard icon={<MemoryStick />} label="Memory" value={`${Math.round(stats.ram)} / ${Math.min(server.ramMax, 768)} MB`} accent="bg-amber-400" pct={ramPct} />
        <StatCard icon={<Users />} label="Players" value={`${stats.players} / ${server.maxPlayers}`} accent="bg-sky-400" pct={(stats.players / Math.max(server.maxPlayers, 1)) * 100} />
        <StatCard icon={<Activity />} label="TPS / Uptime" value={rtStatus === 'online' ? `${stats.tickRate.toFixed(1)} tps` : '—'} sub={fmtUptime(stats.uptime)} accent="bg-emerald-500" pct={rtStatus === 'online' ? Math.min(100, (stats.tickRate / 20) * 100) : 0} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="console" className="mt-4">
        <TabsList className="bg-muted/40">
          <TabsTrigger value="console" className="gap-1.5"><Terminal className="h-4 w-4" /> Console</TabsTrigger>
          <TabsTrigger value="players" className="gap-1.5"><Users className="h-4 w-4" /> Players</TabsTrigger>
          <TabsTrigger value="mods" className="gap-1.5"><Package className="h-4 w-4" /> Mods</TabsTrigger>
          <TabsTrigger value="files" className="gap-1.5"><FolderOpen className="h-4 w-4" /> Files</TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5"><Settings className="h-4 w-4" /> Settings</TabsTrigger>
          <TabsTrigger value="tunnel" className="gap-1.5"><Link2 className="h-4 w-4" /> Tunnel</TabsTrigger>
        </TabsList>

        {/* Console */}
        <TabsContent value="console">
          <Card className="overflow-hidden border-border/60 p-0">
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-3 py-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Server className="h-3.5 w-3.5 text-emerald-400" />
                {server.type} {server.version} · {rtConsole.length} lines
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" /> {fmtUptime(stats.uptime)}
              </div>
            </div>

            <div ref={consoleRef} className="console-scroll h-[420px] overflow-y-auto bg-[oklch(0.12_0.005_145)] p-3 font-mono text-[11px] leading-relaxed">
              {rtConsole.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                  <Terminal className="mb-2 h-8 w-8 opacity-40" />
                  <p className="text-sm">Console is empty.</p>
                  <p className="mt-1 text-xs">Start the server to see live output from the real Java process.</p>
                </div>
              ) : (
                rtConsole.map((line) => <ConsoleRow key={line.id} line={line} />)
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-border/60 bg-muted/30 p-2">
              <span className="font-mono text-xs text-emerald-400">{'>'}</span>
              <Input value={cmd} onChange={(e) => setCmd(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') sendCommand() }}
                placeholder={rtStatus === 'online' ? 'Type a command (try: help, list, say hello, time set day, op Steve)' : 'Start the server to enable console commands'}
                disabled={rtStatus !== 'online'} className="border-transparent bg-background font-mono text-xs" />
              <Button size="sm" onClick={sendCommand} disabled={rtStatus !== 'online' || !cmd.trim()} className="gap-1.5 bg-emerald-500 text-black hover:bg-emerald-400">
                <Send className="h-3.5 w-3.5" /> Run
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Players */}
        <TabsContent value="players">
          <Card className="border-border/60 p-4">
            <div>
              <h3 className="text-sm font-medium">Online players</h3>
              <p className="text-xs text-muted-foreground">{rtMembers.length} of {server.maxPlayers} slots used. Parsed live from the server's console output.</p>
            </div>
            <div className="mt-3 min-h-[200px] rounded-md border border-border/50 bg-muted/20 p-2">
              {rtMembers.length === 0 ? (
                <div className="flex h-[200px] flex-col items-center justify-center text-center text-muted-foreground">
                  <Users className="mb-2 h-8 w-8 opacity-40" />
                  <p className="text-sm">No players online</p>
                  <p className="mt-1 text-xs">Players connect via the Minecraft client to the playit address (or local port {server.port} on this host).</p>
                </div>
              ) : (
                <ul className="divide-y divide-border/40">
                  {rtMembers.map((name) => (
                    <li key={name} className="flex items-center gap-3 py-2">
                      <div className="grid h-8 w-8 place-items-center rounded bg-emerald-500/15 font-mono text-xs font-medium text-emerald-300">{name.slice(0, 2).toUpperCase()}</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">{name}</div>
                        <div className="text-xs text-muted-foreground">Online</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* Mods */}
        <TabsContent value="mods">
          <ModsTab server={server} />
        </TabsContent>

        {/* Files */}
        <TabsContent value="files">
          <FilesTab server={server} />
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings">
          <Card className="border-border/60 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Settings className="h-4 w-4 text-emerald-400" /> Server Settings
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Changes are written to <span className="font-mono">server.properties</span>. World settings require a restart.</p>

            <div className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="set-motd">MOTD (Message of the Day)</Label>
                <Textarea id="set-motd" value={motd} onChange={(e) => setMotd(e.target.value)} maxLength={59} rows={2} />
              </div>

              {/* World settings */}
              <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">World</div>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">World type</Label>
                    <Select value={levelType} onValueChange={setLevelType}>
                      <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {WORLD_TYPES.map((w) => <SelectItem key={w.id} value={w.id}>{w.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">World seed</Label>
                    <Input value={levelSeed} onChange={(e) => setLevelSeed(e.target.value)} placeholder="Random" className="text-xs font-mono" />
                  </div>
                </div>
                <label className="mt-3 flex cursor-pointer items-center justify-between rounded-md bg-muted/40 px-3 py-2">
                  <div>
                    <div className="text-xs font-medium">Generate structures</div>
                    <div className="text-[10px] text-muted-foreground">Villages, dungeons, strongholds</div>
                  </div>
                  <Switch checked={generateStructures} onCheckedChange={setGenerateStructures} />
                </label>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between"><Label>Max players</Label><span className="text-sm font-mono text-emerald-300">{maxPlayers}</span></div>
                  <Slider value={[maxPlayers]} min={1} max={50} step={1} onValueChange={(v) => setMaxPlayers(v[0])} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between"><Label>RAM (MB)</Label><span className="text-sm font-mono text-emerald-300">{ramMax} MB</span></div>
                  <Slider value={[ramMax]} min={256} max={768} step={64} onValueChange={(v) => setRamMax(v[0])} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between"><Label>View distance</Label><span className="text-sm font-mono text-emerald-300">{viewDistance}</span></div>
                  <Slider value={[viewDistance]} min={3} max={32} step={1} onValueChange={(v) => setViewDistance(v[0])} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between"><Label>Simulation distance</Label><span className="text-sm font-mono text-emerald-300">{simulationDistance}</span></div>
                  <Slider value={[simulationDistance]} min={3} max={32} step={1} onValueChange={(v) => setSimulationDistance(v[0])} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between"><Label>Spawn protection</Label><span className="text-sm font-mono text-emerald-300">{spawnProtection}</span></div>
                  <Slider value={[spawnProtection]} min={0} max={16} step={1} onValueChange={(v) => setSpawnProtection(v[0])} />
                </div>
                <div className="space-y-1.5">
                  <Label>Difficulty</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['peaceful', 'easy', 'normal', 'hard'].map((d) => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Gamemode</Label>
                <Select value={gamemode} onValueChange={setGamemode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['survival', 'creative', 'adventure', 'spectator'].map((g) => <SelectItem key={g} value={g} className="capitalize">{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3">
                <ToggleRow icon={<Shield className="h-3.5 w-3.5 text-amber-400" />} label="PvP" desc="Allow player combat" checked={pvp} onChange={setPvp} />
                <ToggleRow icon={<Zap className="h-3.5 w-3.5 text-emerald-400" />} label="Whitelist" desc="Only listed players can join" checked={whitelist} onChange={setWhitelist} />
                <ToggleRow icon={<Shield className="h-3.5 w-3.5 text-red-400" />} label="Hardcore" desc="One life — permadeath" checked={hardcore} onChange={setHardcore} />
                <ToggleRow icon={<Globe className="h-3.5 w-3.5 text-sky-400" />} label="Allow Nether" desc="Enable Nether dimension" checked={allowNether} onChange={setAllowNether} />
                <ToggleRow icon={<Activity className="h-3.5 w-3.5 text-emerald-400" />} label="Allow flight" desc="Players can fly in survival" checked={allowFlight} onChange={setAllowFlight} />
                <ToggleRow icon={<Terminal className="h-3.5 w-3.5 text-amber-400" />} label="Command blocks" desc="Enable redstone command blocks" checked={enableCommandBlock} onChange={setEnableCommandBlock} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" onClick={() => {
                  setMotd(server.motd); setMaxPlayers(server.maxPlayers); setRamMax(server.ramMax)
                  setDifficulty(server.difficulty); setGamemode(server.gamemode)
                  setPvp(server.pvp); setWhitelist(server.whitelist); setHardcore(server.hardcore)
                  setLevelType(server.levelType); setLevelSeed(server.levelSeed); setGenerateStructures(server.generateStructures)
                  setViewDistance(server.viewDistance); setSimulationDistance(server.simulationDistance); setSpawnProtection(server.spawnProtection)
                  setAllowNether(server.allowNether); setAllowFlight(server.allowFlight); setEnableCommandBlock(server.enableCommandBlock)
                }}>Reset</Button>
                <Button onClick={saveSettings} disabled={busy} className="bg-emerald-500 text-black hover:bg-emerald-400">Save changes</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Tunnel */}
        <TabsContent value="tunnel">
          <Card className="border-border/60 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Link2 className="h-4 w-4 text-emerald-400" /> playit.gg Public Tunnel
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Expose your server to the internet without port forwarding. Players connect via a public <span className="font-mono">*.playit.gg</span> address.
            </p>

            <div className="mt-4 space-y-3">
              {/* Status */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatusPill label="Playit binary" value={tunnelInfo?.installed ? 'Installed' : 'Missing'} ok={tunnelInfo?.installed} />
                <StatusPill label="Agent status" value={tunnelInfo?.agentStatus || 'unknown'} ok={tunnelInfo?.agentStatus === 'running'} />
                <StatusPill label="Your account" value={user?.hasPlayit ? 'Has secret' : 'No secret'} ok={Boolean(user?.hasPlayit)} />
              </div>

              {/* Private-by-default notice + Start tunnel button */}
              {!currentTunnel && !tunnelInfo?.pendingClaim && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                  <div className="flex items-start gap-2">
                    <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-amber-300">This server is private</div>
                      <p className="mt-0.5 text-xs text-amber-200/80">
                        Only players on your local network can connect. To make it reachable from the internet, start a playit.gg tunnel below.
                      </p>
                      <Button
                        size="sm"
                        onClick={async () => {
                          setResetBusy(true)
                          try {
                            const res = await fetch('/api/playit/claim', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ serverId: server.id }),
                            })
                            const data = await res.json()
                            if (!res.ok) {
                              toast.error(data?.error || 'Failed to start tunnel')
                            } else if (data.url) {
                              toast.success(`Tunnel started! Visit ${data.url} to pair.`)
                            } else {
                              toast.success('Tunnel started with your saved secret.')
                            }
                          } catch (e: any) {
                            toast.error(e?.message || 'Failed to start tunnel')
                          } finally {
                            setResetBusy(false)
                          }
                        }}
                        disabled={resetBusy || !tunnelInfo?.installed}
                        className="mt-2 gap-1.5 bg-emerald-500 text-black hover:bg-emerald-400"
                      >
                        {resetBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Link2 className="h-3.5 w-3.5" />}
                        Start public tunnel
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reset button — shown when there's a saved secret or running agent but no pending claim */}
              {!tunnelInfo?.pendingClaim && (user?.hasPlayit || tunnelInfo?.agentStatus === 'running') && (
                <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3">
                  <div>
                    <div className="text-sm font-medium">Want to pair a different playit.gg account?</div>
                    <div className="text-xs text-muted-foreground">Reset clears your saved secret, stops the agent, and generates a fresh claim URL.</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetPlayitLink}
                    disabled={resetBusy}
                    className="gap-1.5 border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                  >
                    {resetBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                    Reset & generate new link
                  </Button>
                </div>
              )}

              {/* Pending claim URL — shown when a claim flow is active OR completed */}
              {tunnelInfo?.pendingClaim && (
                <div className={`rounded-lg border p-4 ${
                  tunnelInfo.pendingClaim.status === 'completed' ? 'border-emerald-500/40 bg-emerald-500/10' :
                  tunnelInfo.pendingClaim.status === 'rejected' || tunnelInfo.pendingClaim.status === 'error' ? 'border-red-500/40 bg-red-500/10' :
                  'border-amber-500/40 bg-amber-500/10'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-amber-300">
                      <Link2 className="h-3.5 w-3.5" />
                      {tunnelInfo.pendingClaim.status === 'waiting_for_visit' && 'Waiting for you to open this link'}
                      {tunnelInfo.pendingClaim.status === 'waiting_for_approval' && 'Waiting for you to approve'}
                      {tunnelInfo.pendingClaim.status === 'exchanging' && 'Exchanging claim for secret...'}
                      {tunnelInfo.pendingClaim.status === 'completed' && 'Claim completed — agent starting'}
                      {tunnelInfo.pendingClaim.status === 'rejected' && 'Claim rejected'}
                      {tunnelInfo.pendingClaim.status === 'error' && 'Claim failed'}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={resetPlayitLink}
                      disabled={resetBusy}
                      className="gap-1.5 border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                    >
                      {resetBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                      Reset link
                    </Button>
                  </div>
                  {tunnelInfo.pendingClaim.url && tunnelInfo.pendingClaim.status !== 'completed' && (
                    <a
                      href={tunnelInfo.pendingClaim.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center gap-2 rounded-md bg-background/60 px-3 py-2 font-mono text-sm text-emerald-300 underline-offset-2 hover:underline"
                    >
                      {tunnelInfo.pendingClaim.url}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    This URL also appears in the Minecraft server console. Open it in your browser, click "Approve", and your server will be publicly reachable via a *.playit.gg address.
                  </p>
                </div>
              )}

              {/* Current tunnel address */}
              {currentTunnel && (
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3">
                  <div className="text-[10px] uppercase tracking-wide text-emerald-300">Public address</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-lg text-emerald-300">{currentTunnel}</span>
                    <Button size="sm" variant="outline" onClick={() => copyText(currentTunnel, 'Public address')} className="ml-auto gap-1.5 border-emerald-500/30">
                      <Copy className="h-3.5 w-3.5" /> Copy
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-emerald-200/80">
                    Share this address with your friends. They add it as a server in their Minecraft client.
                  </p>
                </div>
              )}

              {/* Setup instructions */}
              {!user?.hasPlayit && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-amber-300">
                    <Info className="h-3.5 w-3.5" /> How to enable playit.gg
                  </div>
                  <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-amber-200/80">
                    <li>Create a free account at <a href="https://playit.gg" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">playit.gg</a></li>
                    <li>In the playit dashboard, create an agent and copy its secret key</li>
                    <li>Open BlockHost account settings (top-right avatar) and paste the secret</li>
                    <li>Start your Minecraft server — the agent will tunnel it publicly</li>
                  </ol>
                </div>
              )}

              {tunnelInfo?.agentError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                  Agent error: <span className="font-mono">{tunnelInfo.agentError}</span>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ConsoleRow({ line }: { line: ConsoleLine }) {
  const color = line.level === 'ERROR' ? 'text-red-400' : line.level === 'WARN' ? 'text-amber-400' : line.level === 'CMD' ? 'text-sky-300' : 'text-zinc-300'
  return (
    <div className={`${color} break-words`}>
      <span className="select-none text-zinc-600">[{new Date(line.ts).toLocaleTimeString()}] </span>
      {line.text}
    </div>
  )
}

function StatCard({ icon, label, value, sub, accent, pct }: { icon: React.ReactNode; label: string; value: string; sub?: string; accent: string; pct: number }) {
  return (
    <Card className="border-border/60 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-emerald-400 [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
        {label}
      </div>
      <div className="mt-1.5 font-mono text-lg font-semibold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      <div className="mt-2 h-1 w-full overflow-hidden rounded bg-zinc-700">
        <div className={`h-full rounded ${accent}`} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
      </div>
    </Card>
  )
}

function ToggleRow({ icon, label, desc, checked, onChange }: { icon: React.ReactNode; label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
      <div>
        <div className="flex items-center gap-1.5 text-sm font-medium">{icon}{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  )
}

function StatusPill({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="rounded-md border border-border/60 bg-muted/30 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-center gap-1.5 text-sm font-medium">
        <span className={`h-1.5 w-1.5 rounded-full ${ok ? 'bg-emerald-400 pulse-dot' : 'bg-zinc-600'}`} />
        <span className="font-mono">{value}</span>
      </div>
    </div>
  )
}
