'use client'

import { useState, useEffect } from 'react'
import { useApp, McServer } from '@/lib/store/app-store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  Folder, File as FileIcon, ChevronRight, RefreshCw, Upload, Trash2, Download,
  Edit3, Loader2, Home, ArrowLeft, FileText, ImageIcon, FileArchive, Plus,
} from 'lucide-react'

interface FileEntry {
  name: string
  type: 'dir' | 'file'
  size: number
  modified: number
  extension: string
}

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(2)} MB`
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function fileIcon(entry: FileEntry) {
  if (entry.type === 'dir') return <Folder className="h-4 w-4 shrink-0 text-amber-400" />
  const ext = entry.extension
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return <ImageIcon className="h-4 w-4 shrink-0 text-emerald-400" />
  if (['jar', 'zip', 'gz', 'tar'].includes(ext)) return <FileArchive className="h-4 w-4 shrink-0 text-amber-400" />
  if (['json', 'properties', 'yml', 'yaml', 'toml', 'txt', 'log', 'cfg', 'conf', 'mcfunction'].includes(ext)) return <FileText className="h-4 w-4 shrink-0 text-emerald-400" />
  return <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
}

export function FilesTab({ server }: { server: McServer }) {
  const [currentPath, setCurrentPath] = useState('')
  const [entries, setEntries] = useState<FileEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEntry, setSelectedEntry] = useState<FileEntry | null>(null)
  const [uploading, setUploading] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editPath, setEditPath] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const [newFolderOpen, setNewFolderOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  const fetchDir = async (path: string) => {
    setLoading(true)
    try {
      const url = `/api/servers/${server.id}/files?path=${encodeURIComponent(path)}`
      const res = await fetch(url, { cache: 'no-store' })
      const data = await res.json()
      if (res.ok) {
        setEntries(data.entries || [])
        setCurrentPath(data.path || '/')
      } else {
        toast.error(data?.error || 'Failed to list files')
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to list files')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDir('')
  }, [server.id])

  const navigate = (entry: FileEntry) => {
    if (entry.type !== 'dir') return
    const newPath = currentPath === '/' || currentPath === ''
      ? entry.name
      : `${currentPath.replace(/\/$/, '')}/${entry.name}`
    fetchDir(newPath)
    setSelectedEntry(null)
  }

  const breadcrumb = () => {
    const parts = currentPath === '/' ? [] : currentPath.split('/').filter(Boolean)
    return [
      { name: 'root', path: '' },
      ...parts.map((p, i) => ({ name: p, path: parts.slice(0, i + 1).join('/') })),
    ]
  }

  const openFile = async (entry: FileEntry) => {
    if (entry.type !== 'file') return
    const path = currentPath === '/' || currentPath === ''
      ? entry.name
      : `${currentPath.replace(/\/$/, '')}/${entry.name}`
    try {
      const res = await fetch(`/api/servers/${server.id}/files`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, action: 'read' }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || 'Failed to read file')
        return
      }
      if (data.isText) {
        setEditPath(path)
        setEditContent(data.content)
        setEditOpen(true)
      } else {
        toast.info(`"${entry.name}" is a binary file (${fmtBytes(entry.size)}). Use the download button to save it locally.`)
      }
    } catch (e: any) {
      toast.error(e?.message || 'Failed to read file')
    }
  }

  const saveEdit = async () => {
    setEditLoading(true)
    try {
      const res = await fetch(`/api/servers/${server.id}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: editPath, action: 'write_text', content: editContent }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || 'Failed to save')
        return
      }
      toast.success(`Saved ${editPath}`)
      setEditOpen(false)
      fetchDir(currentPath)
    } catch (e: any) {
      toast.error(e?.message || 'Failed to save')
    } finally {
      setEditLoading(false)
    }
  }

  const deleteEntry = async (entry: FileEntry) => {
    if (!confirm(`Delete "${entry.name}"?${entry.type === 'dir' ? ' This will recursively delete all contents.' : ''}`)) return
    const path = currentPath === '/' || currentPath === ''
      ? entry.name
      : `${currentPath.replace(/\/$/, '')}/${entry.name}`
    try {
      const res = await fetch(`/api/servers/${server.id}/files?path=${encodeURIComponent(path)}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data?.error || 'Failed to delete')
        return
      }
      toast.success(`Deleted ${entry.name}`)
      fetchDir(currentPath)
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete')
    }
  }

  const downloadEntry = async (entry: FileEntry) => {
    const path = currentPath === '/' || currentPath === ''
      ? entry.name
      : `${currentPath.replace(/\/$/, '')}/${entry.name}`
    // Read the file via the PATCH endpoint and trigger a browser download
    try {
      const res = await fetch(`/api/servers/${server.id}/files`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, action: 'read' }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || 'Failed to read file for download')
        return
      }
      if (!data.isText) {
        toast.info('Binary file downloads are not yet supported in the web UI. Try opening the file directly.')
        return
      }
      const blob = new Blob([data.content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = entry.name
      a.click()
      URL.revokeObjectURL(url)
    } catch (e: any) {
      toast.error(e?.message || 'Download failed')
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('path', currentPath === '/' ? file.name : `${currentPath.replace(/\/$/, '')}/${file.name}`)
      const res = await fetch(`/api/servers/${server.id}/files`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || 'Upload failed')
        return
      }
      toast.success(`Uploaded ${file.name}`)
      fetchDir(currentPath)
    } catch (e: any) {
      toast.error(e?.message || 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const createFolder = async () => {
    if (!newFolderName.trim()) return
    const path = currentPath === '/' ? newFolderName.trim() : `${currentPath.replace(/\/$/, '')}/${newFolderName.trim()}`
    try {
      const res = await fetch(`/api/servers/${server.id}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, action: 'mkdir' }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || 'Failed to create folder')
        return
      }
      toast.success(`Created ${newFolderName}`)
      setNewFolderOpen(false)
      setNewFolderName('')
      fetchDir(currentPath)
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create folder')
    }
  }

  return (
    <div className="space-y-3">
      {/* Breadcrumb + actions */}
      <Card className="border-border/60 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-1 flex-wrap items-center gap-0.5 text-sm overflow-x-auto">
            {breadcrumb().map((b, i) => (
              <button
                key={i}
                onClick={() => fetchDir(b.path)}
                className="flex items-center gap-0.5 rounded px-1.5 py-0.5 hover:bg-muted/60"
              >
                {i === 0 && <Home className="h-3.5 w-3.5 text-emerald-400" />}
                <span className={i === breadcrumb().length - 1 ? 'font-medium text-foreground' : 'text-muted-foreground'}>{b.name}</span>
                {i < breadcrumb().length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={() => fetchDir(currentPath)} className="h-7 gap-1 text-xs">
              <RefreshCw className="h-3 w-3" /> Refresh
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setNewFolderOpen(true)} className="h-7 gap-1 text-xs">
              <Plus className="h-3 w-3" /> Folder
            </Button>
            <label className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-md border border-border bg-background px-3 text-xs font-medium hover:bg-muted/40">
              {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
              Upload
              <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>
        </div>
      </Card>

      {/* File list */}
      <Card className="border-border/60 p-0">
        <div className="max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading files...
            </div>
          ) : entries.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center text-center text-xs text-muted-foreground">
              <Folder className="mb-1 h-6 w-6 opacity-40" />
              This folder is empty.
            </div>
          ) : (
            <ul className="divide-y divide-border/40">
              {currentPath !== '/' && (
                <li>
                  <button
                    onClick={() => {
                      const parts = currentPath.split('/').filter(Boolean)
                      parts.pop()
                      fetchDir(parts.join('/'))
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted/40"
                  >
                    <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">.. (up one level)</span>
                  </button>
                </li>
              )}
              {entries.map((entry) => (
                <li
                  key={entry.name}
                  className={`group flex items-center gap-2 px-3 py-2 hover:bg-muted/30 ${selectedEntry?.name === entry.name ? 'bg-muted/40' : ''}`}
                  onClick={() => setSelectedEntry(entry)}
                >
                  {fileIcon(entry)}
                  <button
                    onClick={(e) => { e.stopPropagation(); if (entry.type === 'dir') navigate(entry); else openFile(entry) }}
                    className="min-w-0 flex-1 truncate text-left text-sm"
                  >
                    <span className={entry.type === 'dir' ? 'font-medium' : ''}>{entry.name}</span>
                  </button>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {entry.type === 'file' ? fmtBytes(entry.size) : ''}
                  </span>
                  <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    {entry.type === 'file' && (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); openFile(entry) }} className="rounded p-1 hover:bg-muted" title="Edit/View">
                          <Edit3 className="h-3 w-3 text-muted-foreground" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); downloadEntry(entry) }} className="rounded p-1 hover:bg-muted" title="Download">
                          <Download className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); deleteEntry(entry) }} className="rounded p-1 hover:bg-red-500/10" title="Delete">
                      <Trash2 className="h-3 w-3 text-muted-foreground hover:text-red-300" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>

      {/* Help text */}
      <p className="text-xs text-muted-foreground">
        This is the real server working directory. Common files: <span className="font-mono">server.properties</span> (settings), <span className="font-mono">eula.txt</span>, <span className="font-mono">world/</span> (saves), <span className="font-mono">mods/</span> (for Fabric/Forge), <span className="font-mono">ops.json</span> (operators), <span className="font-mono">whitelist.json</span>.
      </p>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-hidden border-border/60 bg-card sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Edit3 className="h-4 w-4 text-emerald-400" />
              <span className="truncate font-mono text-sm">{editPath}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 overflow-hidden">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[400px] flex-1 resize-none font-mono text-xs"
              spellCheck={false}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit} disabled={editLoading} className="gap-1.5 bg-emerald-500 text-black hover:bg-emerald-400">
              {editLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Edit3 className="h-3.5 w-3.5" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New folder dialog */}
      <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
        <DialogContent className="border-border/60 bg-card sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Plus className="h-4 w-4 text-emerald-400" /> New folder
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder name</Label>
            <Input
              id="folder-name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g. mods, config, backups"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') createFolder() }}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setNewFolderOpen(false)}>Cancel</Button>
            <Button onClick={createFolder} className="bg-emerald-500 text-black hover:bg-emerald-400">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
