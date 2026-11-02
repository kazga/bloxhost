'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/lib/store/app-store'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Box, Sparkles, Loader2, Globe, Layers, Settings2, ChevronDown, ChevronUp } from 'lucide-react'

const SERVER_TYPES = [
  { id: 'vanilla', label: 'Vanilla',  desc: 'Pure Minecraft, no mods.',     tag: 'Most compatible' },
  { id: 'paper',   label: 'Paper',    desc: 'High-performance Spigot fork (uses vanilla jar).', tag: 'Recommended' },
  { id: 'spigot',  label: 'Spigot',   desc: 'Plugins support, optimized (uses vanilla jar).',   tag: 'Plugins' },
  { id: 'forge',   label: 'Forge',    desc: 'Mod loader (vanilla fallback).', tag: 'Mods' },
  { id: 'fabric',  label: 'Fabric',   desc: 'Lightweight mod loader (vanilla fallback).',       tag: 'Modern mods' },
]

const WORLD_TYPES = [
  { id: 'minecraft\\default',     label: 'Default',       desc: 'Standard world generation' },
  { id: 'minecraft\\flat',        label: 'Superflat',     desc: 'Flat world — fastest to boot' },
  { id: 'minecraft\\large_biomes', label: 'Large Biomes', desc: 'Biomes scaled 4× larger' },
  { id: 'minecraft\\amplified',   label: 'Amplified',     desc: 'Tall, dramatic terrain' },
  { id: 'minecraft\\single_biome', label: 'Single Biome', desc: 'Entire world is one biome' },
]

const DIFFICULTIES = ['peaceful', 'easy', 'normal', 'hard']
const GAMEMODES = ['survival', 'creative', 'adventure', 'spectator']

interface VersionOption { id: string; available: boolean; latest?: boolean }

export function CreateServerDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const createServer = useApp((s) => s.createServer)
  const openServer = useApp((s) => s.openServer)
  const setView = useApp((s) => s.setView)

  const [name, setName] = useState('')
  const [type, setType] = useState('paper')
  const [version, setVersion] = useState('1.20.4')
  const [versions, setVersions] = useState<VersionOption[]>([])
  const [showAllVersions, setShowAllVersions] = useState(false)
  const [allVersions, setAllVersions] = useState<VersionOption[]>([])
  const [motd, setMotd] = useState('Welcome to my Minecraft server!')
  const [maxPlayers, setMaxPlayers] = useState(20)
  const [ramMax, setRamMax] = useState(768)
  const [difficulty, setDifficulty] = useState('normal')
  const [gamemode, setGamemode] = useState('survival')
  const [pvp, setPvp] = useState(true)
  const [whitelist, setWhitelist] = useState(false)
  const [hardcore, setHardcore] = useState(false)

  // World settings
  const [levelType, setLevelType] = useState('minecraft\\default')
  const [levelSeed, setLevelSeed] = useState('')
  const [generateStructures, setGenerateStructures] = useState(true)

  // Performance
  const [viewDistance, setViewDistance] = useState(8)
  const [simulationDistance, setSimulationDistance] = useState(8)
  const [spawnProtection, setSpawnProtection] = useState(16)

  // Behavior
  const [allowNether, setAllowNether] = useState(true)
  const [allowFlight, setAllowFlight] = useState(false)
  const [enableCommandBlock, setEnableCommandBlock] = useState(false)
  const [onlineMode, setOnlineMode] = useState(false)

  // Advanced
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [busy, setBusy] = useState(false)

  // Fetch version list when dialog opens
  useEffect(() => {
    if (open) {
      fetch('/api/versions?filter=recommended').then(r => r.json()).then(d => {
        if (d?.versions) setVersions(d.versions)
        if (d?.latest && !version) setVersion(d.latest)
      }).catch(() => {})
    }
  }, [open])

  const loadAllVersions = () => {
    if (allVersions.length > 0) {
      setShowAllVersions(true)
      return
    }
    fetch('/api/versions?filter=release').then(r => r.json()).then(d => {
      if (d?.versions) {
        setAllVersions(d.versions)
        setShowAllVersions(true)
      }
    }).catch(() => {})
  }

  const visibleVersions = showAllVersions ? allVersions : versions

  const reset = () => {
    setName(''); setType('paper'); setVersion('1.20.4'); setMotd('Welcome to my Minecraft server!')
    setMaxPlayers(20); setRamMax(768); setDifficulty('normal'); setGamemode('survival')
    setPvp(true); setWhitelist(false); setHardcore(false)
    setLevelType('minecraft\\default'); setLevelSeed(''); setGenerateStructures(true)
    setViewDistance(8); setSimulationDistance(8); setSpawnProtection(16)
    setAllowNether(true); setAllowFlight(false); setEnableCommandBlock(false); setOnlineMode(false)
    setShowAdvanced(false); setShowAllVersions(false)
  }

  const submit = async () => {
    if (!name.trim()) { toast.error('Server name is required'); return }
    if (name.length > 32) { toast.error('Name must be 32 characters or less'); return }
    setBusy(true)
    try {
      const server = await createServer({
        name, type, version, motd, maxPlayers, ramMax, difficulty, gamemode, pvp, whitelist, hardcore,
        levelType, levelSeed, generateStructures,
        viewDistance, simulationDistance, spawnProtection,
        allowNether, allowFlight, enableCommandBlock, onlineMode,
      })
      toast.success(`Server "${server.name}" created! Real Java process ready to boot.`)
      reset()
      onOpenChange(false)
      setView('dashboard')
      openServer(server.id)
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create server')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-border/60 bg-card sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            Create a new server
          </DialogTitle>
          <DialogDescription>
            Free tier — up to 10 servers per account, 768MB RAM each. 100% free, no payment required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Server name */}
          <div className="space-y-1.5">
            <Label htmlFor="mc-name">Server name</Label>
            <Input id="mc-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Awesome Server" maxLength={32} autoFocus />
            <p className="text-xs text-muted-foreground">Visible to players in the server list. {name.length}/32 chars.</p>
          </div>

          {/* Server type */}
          <div className="space-y-2">
            <Label>Server type</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SERVER_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`relative flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                    type === t.id ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/40' : 'border-border bg-muted/30 hover:border-emerald-500/30 hover:bg-muted/50'
                  }`}
                >
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded ${type === t.id ? 'bg-emerald-500 text-black' : 'bg-muted text-muted-foreground'}`}>
                    <Box className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">{t.label}</span>
                      <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-emerald-300">{t.tag}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Version + difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Minecraft version</Label>
              <Select value={version} onValueChange={setVersion}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-[280px]">
                  {visibleVersions.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      <span className="flex items-center gap-2">
                        {v.id}
                        {v.latest && <Badge className="ml-1 bg-emerald-500/15 px-1 text-[9px] text-emerald-300">latest</Badge>}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!showAllVersions ? (
                <button type="button" onClick={loadAllVersions} className="text-[11px] text-emerald-400 hover:underline">
                  Show all versions ({allVersions.length || '…'})
                </button>
              ) : (
                <button type="button" onClick={() => setShowAllVersions(false)} className="text-[11px] text-muted-foreground hover:underline">
                  Show recommended only
                </button>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* World settings */}
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Globe className="h-4 w-4 text-emerald-400" /> World settings
            </div>
            <div className="mt-3 space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">World type</Label>
                <Select value={levelType} onValueChange={setLevelType}>
                  <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {WORLD_TYPES.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        <span className="text-xs">{w.label} — <span className="text-muted-foreground">{w.desc}</span></span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="mc-seed" className="text-xs">World seed (optional)</Label>
                  <Input id="mc-seed" value={levelSeed} onChange={(e) => setLevelSeed(e.target.value)} placeholder="Random" className="text-xs font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Gamemode</Label>
                  <Select value={gamemode} onValueChange={setGamemode}>
                    <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {GAMEMODES.map((g) => <SelectItem key={g} value={g} className="capitalize">{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <label className="flex cursor-pointer items-center justify-between rounded-md bg-muted/40 px-3 py-2">
                <div>
                  <div className="text-xs font-medium">Generate structures</div>
                  <div className="text-[10px] text-muted-foreground">Villages, dungeons, strongholds, etc.</div>
                </div>
                <Switch checked={generateStructures} onCheckedChange={setGenerateStructures} />
              </label>
            </div>
          </div>

          {/* MOTD + sliders */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="mc-motd">MOTD (Message of the Day)</Label>
              <Textarea id="mc-motd" value={motd} onChange={(e) => setMotd(e.target.value)} placeholder="Welcome to my Minecraft server!" maxLength={59} rows={2} />
              <p className="text-xs text-muted-foreground">{motd.length}/59 chars (max in Minecraft)</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Max players</Label>
                  <span className="text-sm font-mono text-emerald-300">{maxPlayers}</span>
                </div>
                <Slider value={[maxPlayers]} min={1} max={50} step={1} onValueChange={(v) => setMaxPlayers(v[0])} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>RAM (MB)</Label>
                  <span className="text-sm font-mono text-emerald-300">{ramMax} MB</span>
                </div>
                <Slider value={[ramMax]} min={256} max={768} step={64} onValueChange={(v) => setRamMax(v[0])} />
                <p className="text-[10px] text-muted-foreground">Sandbox cap: 768 MB. Real VPS deployments can use up to 12 GB.</p>
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-3">
            <Toggle label="PvP" desc="Allow player combat" checked={pvp} onChange={setPvp} />
            <Toggle label="Whitelist" desc="Only listed players can join" checked={whitelist} onChange={setWhitelist} />
            <Toggle label="Hardcore" desc="One life — permadeath" checked={hardcore} onChange={setHardcore} />
            <Toggle label="Online mode" desc="Verify Mojang accounts (blocks offline players)" checked={onlineMode} onChange={setOnlineMode} />
          </div>

          {/* Advanced */}
          <div className="rounded-lg border border-border/60">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex w-full items-center justify-between px-3 py-2 text-sm font-medium"
            >
              <span className="flex items-center gap-1.5">
                <Settings2 className="h-4 w-4 text-amber-400" /> Advanced settings
              </span>
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showAdvanced && (
              <div className="space-y-3 border-t border-border/60 p-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">View distance</Label>
                    <Input type="number" value={viewDistance} onChange={(e) => setViewDistance(Number(e.target.value) || 8)} min={3} max={32} className="text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Sim distance</Label>
                    <Input type="number" value={simulationDistance} onChange={(e) => setSimulationDistance(Number(e.target.value) || 8)} min={3} max={32} className="text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Spawn protection</Label>
                    <Input type="number" value={spawnProtection} onChange={(e) => setSpawnProtection(Number(e.target.value) || 16)} min={0} max={16} className="text-xs" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Toggle label="Allow Nether" desc="" checked={allowNether} onChange={setAllowNether} compact />
                  <Toggle label="Allow flight" desc="" checked={allowFlight} onChange={setAllowFlight} compact />
                  <Toggle label="Command blocks" desc="" checked={enableCommandBlock} onChange={setEnableCommandBlock} compact />
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button>
          <Button onClick={submit} disabled={busy} className="gap-2 bg-emerald-500 text-black hover:bg-emerald-400">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {busy ? 'Creating...' : 'Create Server'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Toggle({ label, desc, checked, onChange, compact }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void; compact?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {desc && <div className="text-xs text-muted-foreground">{desc}</div>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  )
}
