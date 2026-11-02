'use client'

import { useState, useEffect, useRef } from 'react'
import { useApp, McServer } from '@/lib/store/app-store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Search, Download, Trash2, Loader2, Package, Star, Calendar, FileText,
  AlertCircle, CheckCircle2, Folder, RefreshCw, ChevronLeft, ChevronRight,
} from 'lucide-react'

interface ModHit {
  id: string
  slug: string
  title: string
  description: string
  author: string
  downloads: number
  follows: number
  icon: string | null
  versions: string[]
  categories: string[]
  dateModified: string
  license: string
}

interface InstalledMod {
  name: string
  size: number
  modified: number
}

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(2)} MB`
}

function fmtDownloads(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return `${n}`
}

export function ModsTab({ server }: { server: McServer }) {
  const PAGE_SIZE = 20
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<ModHit[]>([])
  const [totalHits, setTotalHits] = useState(0)
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(0) // 0-indexed
  const [installing, setInstalling] = useState<string | null>(null)
  const [installed, setInstalled] = useState<InstalledMod[]>([])
  const [loadingInstalled, setLoadingInstalled] = useState(true)
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isModded = server.type === 'fabric' || server.type === 'forge' || server.type === 'quilt'

  // Fetch installed mods
  const fetchInstalled = async () => {
    try {
      const res = await fetch(`/api/servers/${server.id}/mods`)
      const data = await res.json()
      if (res.ok) setInstalled(data.mods || [])
    } catch {}
    setLoadingInstalled(false)
  }

  useEffect(() => {
    fetchInstalled()
  }, [server.id])

  // Debounced search — when the query is empty, browse popular mods (no query
  // sent to Modrinth, which returns mods sorted by popularity/downloads)
  useEffect(() => {
    // Reset to page 0 whenever the query or filters change
    setPage(0)
  }, [q, server.version, server.type])

  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(() => doSearch(), 400)
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current) }
  }, [q, server.version, server.type, page])

  const doSearch = async () => {
    setSearching(true)
    setSearched(true)
    try {
      const loader = server.type === 'fabric' ? 'fabric' : server.type === 'forge' ? 'forge' : ''
      const query = q.trim()
      const offset = page * PAGE_SIZE
      const url = `/api/mods/search?q=${encodeURIComponent(query)}&version=${encodeURIComponent(server.version)}&loader=${loader}&limit=${PAGE_SIZE}&offset=${offset}`
      const res = await fetch(url, { cache: 'no-store' })
      const data = await res.json()
      if (res.ok) {
        setHits(data.hits || [])
        setTotalHits(data.totalHits || 0)
      } else {
        toast.error(data?.error || 'Search failed')
      }
    } catch (e: any) {
      toast.error(e?.message || 'Search failed')
    } finally {
      setSearching(false)
    }
  }

  const installMod = async (mod: ModHit) => {
    setInstalling(mod.id)
    try {
      const res = await fetch(`/api/servers/${server.id}/mods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: mod.id, mcVersion: server.version }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || 'Failed to install mod')
        return
      }
      toast.success(`Installed "${mod.title}" v${data.installed?.versionNumber || ''}`)
      fetchInstalled()
    } catch (e: any) {
      toast.error(e?.message || 'Failed to install mod')
    } finally {
      setInstalling(null)
    }
  }

  const deleteMod = async (filename: string) => {
    if (!confirm(`Delete mod "${filename}"? Restart the server to apply changes.`)) return
    try {
      const res = await fetch(`/api/servers/${server.id}/mods?filename=${encodeURIComponent(filename)}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data?.error || 'Failed to delete mod')
        return
      }
      toast.success(`Deleted ${filename}`)
      fetchInstalled()
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete mod')
    }
  }

  // For non-modded servers (vanilla/paper/spigot), mods don't apply
  if (!isModded) {
    return (
      <Card className="border-border/60 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <h3 className="text-sm font-medium">Mods require a modded server type</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              This server is running <span className="font-medium text-foreground">{server.type}</span>, which doesn&apos;t support mods.
              Create a new server with type <span className="font-medium">Fabric</span> or <span className="font-medium">Forge</span> to install mods.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Vanilla servers can use datapacks (drop them in <span className="font-mono">world/datapacks/</span> via the Files tab) but not mods.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Installed mods */}
      <Card className="border-border/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-medium">Installed mods</h3>
            <Badge variant="outline" className="text-[10px]">{installed.length}</Badge>
          </div>
          <Button size="sm" variant="ghost" onClick={fetchInstalled} className="h-7 gap-1 text-xs">
            <RefreshCw className="h-3 w-3" /> Refresh
          </Button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Mods go in the <span className="font-mono">mods/</span> folder. Restart the server after adding or removing mods.
        </p>

        <div className="mt-3 min-h-[80px] rounded-md border border-border/50 bg-muted/20 p-2">
          {loadingInstalled ? (
            <div className="flex h-20 items-center justify-center text-xs text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading installed mods...
            </div>
          ) : installed.length === 0 ? (
            <div className="flex h-20 flex-col items-center justify-center text-center text-xs text-muted-foreground">
              <Package className="mb-1 h-5 w-5 opacity-40" />
              No mods installed yet. Search below to add some.
            </div>
          ) : (
            <ul className="divide-y divide-border/40">
              {installed.map((mod) => (
                <li key={mod.name} className="flex items-center gap-3 py-2">
                  <FileText className="h-4 w-4 shrink-0 text-amber-400" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{mod.name}</div>
                    <div className="text-xs text-muted-foreground">{fmtBytes(mod.size)} · modified {new Date(mod.modified).toLocaleDateString()}</div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => deleteMod(mod.name)} className="h-7 gap-1 text-xs text-muted-foreground hover:text-red-300">
                    <Trash2 className="h-3 w-3" /> Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      {/* Search */}
      <Card className="border-border/60 p-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-medium">Search mods</h3>
          <span className="text-xs text-muted-foreground">via Modrinth</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Searching for mods compatible with <span className="font-medium text-emerald-300">MC {server.version}</span> on <span className="font-medium text-emerald-300">{server.type}</span>.
        </p>

        <div className="mt-3 relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search mods (or browse popular below) — e.g. sodium, lithium, jei, create..."
            className="pl-9"
            onKeyDown={(e) => { if (e.key === 'Enter') doSearch() }}
          />
          {searching && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
        </div>

        {/* Results */}
        <div className="mt-3">
          {!searched && (
            <div className="flex h-32 flex-col items-center justify-center text-center text-xs text-muted-foreground">
              <Loader2 className="mb-1 h-5 w-5 animate-spin opacity-60" />
              Loading popular mods...
            </div>
          )}

          {searched && !searching && hits.length === 0 && (
            <div className="flex h-32 flex-col items-center justify-center text-center text-xs text-muted-foreground">
              <AlertCircle className="mb-1 h-6 w-6 opacity-40" />
              No mods found{q.trim() ? ` for "${q.trim()}"` : ''}. Try a different search term or check that the mod supports MC {server.version} / {server.type}.
            </div>
          )}

          {hits.length > 0 && (
            <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              <div className="text-xs text-muted-foreground">
                {q.trim() ? `${totalHits} mods found for "${q.trim()}", showing first ${hits.length}:` : `Popular mods for MC ${server.version} / ${server.type} (showing ${hits.length} of ${totalHits}):`}
              </div>
              {hits.map((mod) => (
                <div key={mod.id} className="rounded-md border border-border/60 bg-muted/20 p-3 transition-colors hover:border-emerald-500/30">
                  <div className="flex items-start gap-3">
                    {mod.icon ? (
                      <img src={mod.icon} alt={mod.title} className="h-10 w-10 shrink-0 rounded object-cover" />
                    ) : (
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded bg-emerald-500/15 text-emerald-300">
                        <Package className="h-5 w-5" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`https://modrinth.com/mod/${mod.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-sm font-medium hover:text-emerald-300 hover:underline"
                        >
                          {mod.title}
                        </a>
                        {mod.categories?.slice(0, 3).map((c) => (
                          <span key={c} className="rounded bg-muted px-1 py-0 text-[9px] uppercase text-muted-foreground">{c}</span>
                        ))}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        by <span className="font-medium text-foreground">{mod.author}</span>
                        <span className="mx-1.5">·</span>
                        <span className="inline-flex items-center gap-0.5"><Download className="h-3 w-3" /> {fmtDownloads(mod.downloads)}</span>
                        {mod.follows > 0 && (
                          <>
                            <span className="mx-1.5">·</span>
                            <span className="inline-flex items-center gap-0.5"><Star className="h-3 w-3" /> {fmtDownloads(mod.follows)}</span>
                          </>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{mod.description}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => installMod(mod)}
                      disabled={installing === mod.id}
                      className="shrink-0 gap-1.5 bg-emerald-500 text-black hover:bg-emerald-400"
                    >
                      {installing === mod.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                      Install
                    </Button>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalHits > PAGE_SIZE && (
                <div className="sticky bottom-0 flex items-center justify-between gap-2 border-t border-border/60 bg-background/80 p-2 backdrop-blur">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0 || searching}
                    className="gap-1.5"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Prev
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Page <span className="font-medium text-foreground">{page + 1}</span> of <span className="font-medium text-foreground">{Math.max(1, Math.ceil(totalHits / PAGE_SIZE))}</span>
                    <span className="mx-1.5">·</span>
                    <span className="text-[10px]">{page * PAGE_SIZE + 1}–{Math.min(totalHits, (page + 1) * PAGE_SIZE)} of {totalHits}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={(page + 1) * PAGE_SIZE >= totalHits || searching}
                    className="gap-1.5"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
