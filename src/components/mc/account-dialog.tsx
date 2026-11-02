'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/lib/store/app-store'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, Settings, ExternalLink, Globe, Shield, Zap } from 'lucide-react'

export function AccountDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const user = useApp((s) => s.user)
  const updateAccount = useApp((s) => s.updateAccount)
  const logout = useApp((s) => s.logout)
  const [name, setName] = useState('')
  const [playitSecret, setPlayitSecret] = useState('')
  const [playitStatus, setPlayitStatus] = useState<string>('unknown')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (open && user) {
      setName(user.name)
      setPlayitSecret('')
      // Fetch live playit status
      fetch('/api/account').then(r => r.json()).then(d => {
        if (d?.playit) setPlayitStatus(d.playit.status)
      }).catch(() => {})
    }
  }, [open, user])

  if (!user) return null

  const save = async () => {
    setBusy(true)
    try {
      const patch: any = { name }
      if (playitSecret.trim()) {
        patch.playitSecret = playitSecret.trim()
      }
      const result = await updateAccount(patch)
      if (!result.ok) {
        toast.error(result.error || 'Failed to save')
        return
      }
      toast.success('Account updated')
      setPlayitSecret('')
      onOpenChange(false)
    } finally { setBusy(false) }
  }

  const handleLogout = async () => {
    await logout()
    onOpenChange(false)
    toast.success('Logged out')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/60 bg-card sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Settings className="h-5 w-5 text-emerald-400" />
            Account settings
          </DialogTitle>
          <DialogDescription>
            Signed in as <span className="font-medium text-foreground">{user.email}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Display name */}
          <div className="space-y-1.5">
            <Label htmlFor="acct-name">Display name</Label>
            <Input id="acct-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={32} />
          </div>

          {/* Playit secret */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <Globe className="mt-0.5 h-5 w-5 text-emerald-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">playit.gg tunneling</span>
                    {user.hasPlayit ? (
                      <Badge className="bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/15">Configured</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Not set</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Lets players from the internet join your Minecraft server via a public <span className="font-mono">*.playit.gg</span> address.
                    No port forwarding required.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <Label htmlFor="acct-playit" className="text-xs">Playit agent secret</Label>
              <Input
                id="acct-playit"
                type="password"
                value={playitSecret}
                onChange={(e) => setPlayitSecret(e.target.value)}
                placeholder={user.playitMasked ? `Current: ${user.playitMasked}` : 'Paste your playit secret here'}
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-muted-foreground">
                Don&apos;t have one? <a href="https://playit.gg" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-emerald-400 hover:underline">Sign up at playit.gg <ExternalLink className="h-3 w-3" /></a>, create an agent, and copy the secret.
              </p>
              {playitStatus !== 'unknown' && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className={`h-1.5 w-1.5 rounded-full ${playitStatus === 'running' ? 'bg-emerald-400 pulse-dot' : playitStatus === 'starting' ? 'bg-amber-400 pulse-dot' : playitStatus === 'error' ? 'bg-red-500' : 'bg-zinc-600'}`} />
                  Agent: <span className="font-mono">{playitStatus}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Shield className="h-3.5 w-3.5 text-amber-400" /> What does playit.gg do?
            </div>
            <p className="mt-1">
              This sandbox only exposes HTTPS — Minecraft players need raw TCP port 25565 to connect.
              The playit agent tunnels your local TCP port through their global proxy network, giving you
              a public address players can join from anywhere.
            </p>
          </div>
        </div>

        <DialogFooter className="flex justify-between gap-2 sm:justify-between">
          <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-red-300">
            Log out
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={save} disabled={busy} className="gap-2 bg-emerald-500 text-black hover:bg-emerald-400">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              Save changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
