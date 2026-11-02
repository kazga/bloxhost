'use client'

import { useState } from 'react'
import { useApp } from '@/lib/store/app-store'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, UserPlus, LogIn, Mail, Lock, User } from 'lucide-react'

type Mode = 'login' | 'signup'

export function AuthDialog({ open, onOpenChange, initialMode = 'login' }: { open: boolean; onOpenChange: (v: boolean) => void; initialMode?: Mode }) {
  const signup = useApp((s) => s.signup)
  const login = useApp((s) => s.login)
  const [mode, setMode] = useState<Mode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)

  // Sync mode when dialog opens
  const handleOpenChange = (v: boolean) => {
    if (v) setMode(initialMode)
    onOpenChange(v)
  }

  const submit = async () => {
    if (mode === 'signup') {
      if (!name.trim() || name.trim().length < 2) {
        toast.error('Name must be at least 2 characters')
        return
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        toast.error('Please enter a valid email address')
        return
      }
      if (password.length < 8) {
        toast.error('Password must be at least 8 characters')
        return
      }
    } else {
      if (!email || !password) {
        toast.error('Email and password are required')
        return
      }
    }
    setBusy(true)
    try {
      const result = mode === 'signup'
        ? await signup(email, password, name)
        : await login(email, password)
      if (!result.ok) {
        toast.error(result.error || 'Authentication failed')
        return
      }
      toast.success(mode === 'signup' ? 'Account created! Welcome to BlockHost.' : 'Logged in!')
      setEmail(''); setPassword(''); setName('')
      handleOpenChange(false)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-border/60 bg-card sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {mode === 'signup' ? <UserPlus className="h-5 w-5 text-emerald-400" /> : <LogIn className="h-5 w-5 text-emerald-400" />}
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'signup'
              ? 'Create a free BlockHost account to manage your Minecraft servers and enable playit.gg tunneling.'
              : 'Sign in to manage your Minecraft servers and account settings.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <Label htmlFor="auth-name">Display name</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="auth-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Steve" maxLength={32} className="pl-9" />
              </div>
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="auth-email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9" autoComplete="email" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="auth-password">Password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="auth-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === 'signup' ? 'At least 8 characters' : '••••••••'} className="pl-9" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
          <Button onClick={submit} disabled={busy} className="w-full gap-2 bg-emerald-500 text-black hover:bg-emerald-400">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : (mode === 'signup' ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />)}
            {mode === 'signup' ? 'Create account' : 'Sign in'}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {mode === 'signup' ? (
              <>Already have an account? <button onClick={() => setMode('login')} className="text-emerald-400 hover:underline">Sign in</button></>
            ) : (
              <>No account? <button onClick={() => setMode('signup')} className="text-emerald-400 hover:underline">Create one</button></>
            )}
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
