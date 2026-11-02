'use client'

import { useEffect, useState } from 'react'
import { useApp } from '@/lib/store/app-store'
import { CreateServerDialog } from '@/components/mc/create-server-dialog'
import { AuthDialog } from '@/components/mc/auth-dialog'
import { AccountDialog } from '@/components/mc/account-dialog'
import { ServerCard } from '@/components/mc/server-card'
import { ServerDetail } from '@/components/mc/server-detail'
import { AccountPage } from '@/components/mc/account-page'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import {
  Blocks, Server, Sparkles, Zap, Globe, Shield, Cpu, MemoryStick,
  Users, Terminal, ArrowRight, Plus, Search, Github, Twitter,
  CheckCircle2, Clock, HardDrive, Wifi, Activity, Gift, Boxes,
  PlayCircle, Star, ChevronRight, Menu, X, UserCircle, LogOut, Settings, LogIn, UserPlus,
} from 'lucide-react'

export default function Home() {
  const view = useApp((s) => s.view)
  const setView = useApp((s) => s.setView)
  const servers = useApp((s) => s.servers)
  const loadingServers = useApp((s) => s.loadingServers)
  const fetchServers = useApp((s) => s.fetchServers)
  const fetchUser = useApp((s) => s.fetchUser)
  const user = useApp((s) => s.user)
  const activeServerId = useApp((s) => s.activeServerId)
  const [createOpen, setCreateOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [accountOpen, setAccountOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetchUser()
    fetchServers()
  }, [fetchUser, fetchServers])

  const activeServer = servers.find((s) => s.id === activeServerId)

  const openSignup = () => { setAuthMode('signup'); setAuthOpen(true) }
  const openLogin = () => { setAuthMode('login'); setAuthOpen(true) }

  return (
    <div className="relative min-h-screen bg-vignette bg-blocks">
      <Header
        onDashboard={() => setView('dashboard')}
        onHome={() => setView('home')}
        onCreate={() => setCreateOpen(true)}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        user={user}
        onOpenSignup={openSignup}
        onOpenLogin={openLogin}
        onOpenAccount={() => setAccountOpen(true)}
        setView={setView}
      />

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6">
        {view === 'home' && (
          <Landing
            serversCount={servers.length}
            isLoggedIn={Boolean(user)}
            onGetStarted={() => {
              if (servers.length === 0) setCreateOpen(true)
              else setView('dashboard')
            }}
            onCreate={() => setCreateOpen(true)}
            onDashboard={() => setView('dashboard')}
            onSignup={openSignup}
          />
        )}

        {view === 'dashboard' && (
          <Dashboard
            servers={servers}
            loading={loadingServers}
            isLoggedIn={Boolean(user)}
            onCreate={() => setCreateOpen(true)}
            onHome={() => setView('home')}
            onRefresh={() => fetchServers()}
            onLogin={openLogin}
          />
        )}

        {view === 'detail' && activeServer && <ServerDetail server={activeServer} />}

        {view === 'account' && <AccountPage />}

        {view === 'detail' && !activeServer && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Server not found.</p>
            <Button onClick={() => setView('dashboard')} className="mt-3">Back to dashboard</Button>
          </div>
        )}
      </main>

      <Footer />

      <CreateServerDialog open={createOpen} onOpenChange={setCreateOpen} />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} initialMode={authMode} />
      <AccountDialog open={accountOpen} onOpenChange={setAccountOpen} />
    </div>
  )
}

function Header({
  onDashboard, onHome, onCreate, menuOpen, setMenuOpen, user, onOpenSignup, onOpenLogin, onOpenAccount, setView,
}: {
  onDashboard: () => void; onHome: () => void; onCreate: () => void; menuOpen: boolean; setMenuOpen: (v: boolean) => void
  user: any
  onOpenSignup: () => void; onOpenLogin: () => void; onOpenAccount: () => void
  setView: (v: 'home' | 'dashboard' | 'detail' | 'account') => void
}) {
  const logout = useApp((s) => s.logout)
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <button onClick={onHome} className="group flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded bg-emerald-500 text-black shadow-sm transition-transform group-hover:scale-105">
            <Blocks className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-pixel text-xs font-normal tracking-tight text-emerald-400">Block</span>
            <span className="text-sm font-semibold tracking-tight">Host</span>
            <Badge variant="outline" className="hidden bg-emerald-500/10 px-1.5 py-0 text-[9px] text-emerald-300 sm:inline-flex">FREE</Badge>
          </div>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" onClick={onHome} className="text-muted-foreground hover:text-foreground">Home</Button>
          <Button variant="ghost" size="sm" onClick={onDashboard} className="text-muted-foreground hover:text-foreground">Dashboard</Button>
          <a href="#features" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">Features</a>
          <a href="#pricing" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">Free</a>
          <a href="#faq" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">FAQ</a>
        </nav>

        <div className="flex items-center gap-1.5">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-2 py-1 text-sm transition-colors hover:bg-muted/50">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-emerald-500/15 text-xs font-medium text-emerald-300">
                      {user.name?.slice(0, 2).toUpperCase() || user.email?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-[120px] truncate sm:inline">{user.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setView('account')} className="gap-2">
                  <Activity className="h-3.5 w-3.5" /> Status &amp; account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onOpenAccount} className="gap-2">
                  <Settings className="h-3.5 w-3.5" /> Account settings
                  {user.hasPlayit && <Badge variant="outline" className="ml-auto px-1 py-0 text-[9px] text-emerald-300">playit</Badge>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDashboard} className="gap-2">
                  <Server className="h-3.5 w-3.5" /> My servers
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); toast.success('Logged out') }} className="gap-2 text-red-300 focus:text-red-300">
                  <LogOut className="h-3.5 w-3.5" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={onOpenSignup} className="hidden gap-1.5 sm:inline-flex text-muted-foreground hover:text-foreground">
                <UserPlus className="h-3.5 w-3.5" /> Sign up
              </Button>
              <Button size="sm" variant="outline" onClick={onOpenLogin} className="gap-1.5">
                <LogIn className="h-3.5 w-3.5" /> Sign in
              </Button>
            </>
          )}
          <Button size="sm" onClick={onCreate} className="gap-1.5 bg-emerald-500 text-black hover:bg-emerald-400">
            <Plus className="h-3.5 w-3.5" /> New Server
          </Button>
          <Button size="sm" variant="ghost" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border/40 md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            <a href="#features" onClick={() => setMenuOpen(false)} className="py-2 text-sm text-muted-foreground hover:text-foreground">Features</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} className="py-2 text-sm text-muted-foreground hover:text-foreground">Free</a>
            <a href="#faq" onClick={() => setMenuOpen(false)} className="py-2 text-sm text-muted-foreground hover:text-foreground">FAQ</a>
          </nav>
        </div>
      )}
    </header>
  )
}

function Landing({
  serversCount, isLoggedIn, onGetStarted, onCreate, onDashboard, onSignup,
}: {
  serversCount: number; isLoggedIn: boolean; onGetStarted: () => void; onCreate: () => void; onDashboard: () => void; onSignup: () => void
}) {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-12 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-5 gap-1.5 border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
            <Gift className="h-3 w-3" /> 100% free forever · no paywalls
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            Free Minecraft Server Hosting.
            <span className="block bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
              Spin up in 60 seconds.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
            Host vanilla, Paper, Spigot, Forge, and Fabric servers powered by <span className="text-emerald-300 font-medium">real <span className="font-mono">server.jar</span></span> Java processes.
            Tunnel publicly via <span className="text-amber-300 font-medium">playit.gg</span>. Real-time console streaming from the actual JVM. 100% free — just play.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={onGetStarted} className="h-12 gap-2 bg-emerald-500 text-black hover:bg-emerald-400 glow-primary">
              <Sparkles className="h-4 w-4" />
              {serversCount > 0 ? 'Open Dashboard' : isLoggedIn ? 'Create your free server' : 'Get started — it\'s free'}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={onDashboard} className="h-12 gap-2">
              <PlayCircle className="h-4 w-4 text-emerald-400" />
              {serversCount > 0 ? `View my ${serversCount} server${serversCount === 1 ? '' : 's'}` : 'Browse demo servers'}
            </Button>
          </div>

          {/* Trust strip */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatBadge icon={<Server />} value="48,213" label="Servers hosted" />
            <StatBadge icon={<Users />} value="1.2M+" label="Players served" />
            <StatBadge icon={<Globe />} value="12" label="Global regions" />
            <StatBadge icon={<Activity />} value="99.9%" label="Uptime SLA" />
          </div>
        </div>

        {/* Mock server preview */}
        <div className="mx-auto mt-12 max-w-5xl">
          <ServerPreview onCreate={onCreate} onDashboard={onDashboard} />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <Badge variant="outline" className="mb-3 gap-1.5 border-amber-500/30 bg-amber-500/10 text-amber-300">
              <Star className="h-3 w-3" /> Everything you need
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built for creators, by players</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              All the tools you need to run a great Minecraft server — 100% free, forever.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Feature icon={<Zap />} title="Instant setup" desc="Pick a version, click create, and your server is online in under 60 seconds. No waiting, no queues." />
            <Feature icon={<Terminal />} title="Live console" desc="Real-time server console with full command input. Type /op, /give, /stop — anything you can run in-game." />
            <Feature icon={<Cpu />} title="Real Java processes" desc="Actual java -jar server.jar processes with real CPU/RAM stats. Up to 768MB RAM per server, burstable CPU, SSD storage." />
            <Feature icon={<Shield />} title="DDoS protection" desc="Enterprise-grade mitigation on every node. Your server stays online even under attack." />
            <Feature icon={<Boxes />} title="Mod & plugin support" desc="Vanilla, Paper, Spigot, Forge, and Fabric. Search and install mods from Modrinth with one click." />
            <Feature icon={<Globe />} title="playit.gg tunneling" desc="Make your server publicly reachable via a *.playit.gg address — no port forwarding required, no extra cost." />
            <Feature icon={<HardDrive />} title="File explorer" desc="Browse, upload, edit, and delete any file in your server's directory. Full control over configs, mods, and world saves." />
            <Feature icon={<Users />} title="Player management" desc="Whitelist, ban, OP, and kick players from the dashboard. Real-time player list with ping and gamemode." />
            <Feature icon={<Wifi />} title="99.9% uptime" desc="Battle-tested infrastructure with N+1 redundancy. If a node fails, your server is migrated automatically." />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Get online in 3 steps</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">No technical skills required.</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Step n={1} icon={<Plus />} title="Create your server" desc="Pick a name, type (Paper recommended), and Minecraft version. Takes 10 seconds." />
            <Step n={2} icon={<PlayCircle />} title="Press Start" desc="Boot the server. Watch the console stream live as Minecraft loads the world." />
            <Step n={3} icon={<Users />} title="Share & play" desc="Copy your server address and give it to friends. They join directly from the Minecraft client." />
          </div>
        </div>
      </section>

      {/* 100% Free */}
      <section id="pricing" className="scroll-mt-20 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Badge variant="outline" className="mb-3 gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
              <Gift className="h-3 w-3" /> 100% free forever
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">No pricing. It's all free.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Every feature, every server type, every mod — completely free. No premium tiers, no paywalls, no credit card, no ads. Ever.
            </p>
          </div>

          <Card className="mt-8 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-amber-500/5 p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15">
              <Gift className="h-7 w-7 text-emerald-400" />
            </div>
            <h3 className="mt-4 text-2xl font-bold">$0 / forever</h3>
            <p className="mt-2 text-sm text-muted-foreground">Everything included, no hidden costs</p>
            <ul className="mx-auto mt-6 max-w-md space-y-2 text-left text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-muted-foreground">Up to 10 servers per account</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-muted-foreground">All server types — Vanilla, Paper, Spigot, Fabric, Forge</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-muted-foreground">All Minecraft versions (1.7.10 → latest)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-muted-foreground">Mod search &amp; one-click install via Modrinth</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-muted-foreground">Full file explorer — upload, edit, delete any file</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-muted-foreground">Live console + real-time commands</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-muted-foreground">playit.gg tunneling for public access</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-muted-foreground">Unlimited players, unlimited uptime</span>
              </li>
            </ul>
            <Button size="lg" onClick={onCreate} className="mt-6 gap-2 bg-emerald-500 text-black hover:bg-emerald-400">
              <Sparkles className="h-4 w-4" /> Create your free server
            </Button>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently asked questions</h2>
          </div>
          <div className="mt-8 divide-y divide-border/60 rounded-lg border border-border/60 bg-card/60">
            <Faq q="Is this really free? What's the catch?">
              Yes — BlockHost is 100% free, forever. No credit card, no ads, no premium tiers, no paywalls.
              Every feature is available to everyone: all server types, all Minecraft versions, mod support,
              file access, playit.gg tunneling. There is no paid upgrade because there's nothing to upgrade to.
            </Faq>
            <Faq q="How long does my server stay online?">
              Your server stays online as long as you want it to. There are no time limits, no inactivity
              sleep modes, no session caps. Start it, leave it running, come back days later — it's still there.
            </Faq>
            <Faq q="Can I install mods and plugins?">
              Yes. Pick Fabric or Forge at creation for mods, or Paper/Spigot for plugins. You can search
              and install mods directly from Modrinth via the Mods tab, or upload your own .jar files
              via the file explorer.
            </Faq>
            <Faq q="Do you support older Minecraft versions?">
              We support every Minecraft version from 1.7.10 to the latest release. The correct server.jar
              is downloaded automatically from Mojang on first start. The right Java version (17, 21, or 25)
              is selected automatically per Minecraft version.
            </Faq>
            <Faq q="What hardware do you run on?">
              Servers run on real Java processes using Temurin JDK 17, 21, and 25. Each Minecraft server
              gets up to 768 MB of RAM (sandbox cap). On a real VPS deployment you can allocate as much
              RAM as your hardware allows.
            </Faq>
            <Faq q="Can I migrate my existing world?">
              Yes — upload your world files via the file explorer (Files tab) and place them in the
              <span className="font-mono"> world/</span> folder. No storage limits.
            </Faq>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-20">
        <Card className="relative overflow-hidden border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-card to-amber-500/10 p-8 text-center sm:p-12">
          <div className="relative z-10 mx-auto max-w-2xl">
            <Blocks className="mx-auto mb-4 h-10 w-10 text-emerald-400" />
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Your server is one click away</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Join 48,000+ communities already hosting with BlockHost. No card. No setup fee. Just blocks.
            </p>
            <div className="mt-6">
              <Button size="lg" onClick={onCreate} className="h-12 gap-2 bg-emerald-500 text-black hover:bg-emerald-400 glow-primary">
                <Sparkles className="h-4 w-4" /> Create your free server <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </>
  )
}

function ServerPreview({ onCreate, onDashboard }: { onCreate: () => void; onDashboard: () => void }) {
  return (
    <Card className="overflow-hidden border-border/60 p-0">
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">dashboard.blockhost.io</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Sidebar */}
        <div className="border-b border-border/40 bg-muted/20 p-3 md:border-b-0 md:border-r">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Server className="h-3.5 w-3.5 text-emerald-400" /> My Servers
          </div>
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center gap-2 rounded bg-emerald-500/10 px-2 py-1.5 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
              <span className="font-medium">Survival World</span>
            </div>
            <div className="flex items-center gap-2 rounded px-2 py-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
              <span>Modded Forge</span>
            </div>
            <div className="flex items-center gap-2 rounded px-2 py-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
              <span>Bedrock SMP</span>
            </div>
          </div>
        </div>
        {/* Main panel */}
        <div className="col-span-2 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Survival World</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">
                  <span className="h-1 w-1 rounded-full bg-emerald-400 pulse-dot" /> Online
                </span>
              </div>
              <div className="mt-0.5 font-mono text-xs text-muted-foreground">survival-world.freemc.host:25565</div>
            </div>
            <Button size="sm" className="bg-emerald-500 text-black hover:bg-emerald-400">Manage</Button>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            <MiniStat label="CPU" value="14%" />
            <MiniStat label="RAM" value="1.1/2 GB" />
            <MiniStat label="Players" value="3/20" />
            <MiniStat label="TPS" value="20.0" />
          </div>

          <div className="mt-3 rounded-md bg-[oklch(0.12_0.005_145)] p-3 font-mono text-[10px] leading-relaxed text-zinc-300">
            <div className="text-emerald-400">[Server thread/INFO]: Done (1.42s)! For help, type "help"</div>
            <div>[Server thread/INFO]: Steve joined the game</div>
            <div>[Server thread/INFO]: Alex joined the game</div>
            <div className="text-sky-300">[CONSOLE]: /time set day</div>
            <div>[Server thread/INFO]: Set the time to 1000</div>
            <div className="text-emerald-400">[Server thread/INFO]: Saved the game</div>
            <div className="inline-block h-3 w-1.5 animate-pulse bg-emerald-400 align-middle" />
          </div>
        </div>
      </div>
    </Card>
  )
}

function Dashboard({
  servers, loading, isLoggedIn, onCreate, onHome, onRefresh, onLogin,
}: {
  servers: ReturnType<typeof useApp.getState>['servers']
  loading: boolean
  isLoggedIn: boolean
  onCreate: () => void
  onHome: () => void
  onRefresh: () => void
  onLogin: () => void
}) {
  const [q, setQ] = useState('')

  const filtered = servers.filter((s) => {
    const v = q.trim().toLowerCase()
    if (!v) return true
    return s.name.toLowerCase().includes(v) || s.type.toLowerCase().includes(v) || s.version.includes(v) || s.host.includes(v)
  })

  const onlineCount = servers.filter((s) => {
    const st = useApp.getState().rtStatus[s.id] || s.status
    return st === 'online' || st === 'starting'
  }).length

  return (
    <div className="fade-up">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Servers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {servers.length} server{servers.length === 1 ? '' : 's'} · {onlineCount} active · Free tier allows up to 10 servers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} className="gap-1.5">
            <Activity className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Button size="sm" onClick={onCreate} className="gap-1.5 bg-emerald-500 text-black hover:bg-emerald-400">
            <Plus className="h-3.5 w-3.5" /> New Server
          </Button>
        </div>
      </div>

      {/* Search */}
      {servers.length > 0 && (
        <div className="mt-4 relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, type, version..."
            className="pl-9"
          />
        </div>
      )}

      {/* Grid */}
      <div className="mt-6">
        {loading && servers.length === 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Card key={i} className="border-border/60 p-5">
                <div className="h-1 w-full rounded bg-zinc-700" />
                <div className="mt-4 h-8 w-2/3 rounded bg-muted/60" />
                <div className="mt-2 h-3 w-1/2 rounded bg-muted/40" />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[0, 1, 2, 3].map((j) => <div key={j} className="h-10 rounded bg-muted/40" />)}
                </div>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState hasServers={servers.length > 0} onCreate={onCreate} onHome={onHome} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => <ServerCard key={s.id} server={s} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState({ hasServers, onCreate, onHome }: { hasServers: boolean; onCreate: () => void; onHome: () => void }) {
  return (
    <Card className="border-dashed border-border/60 bg-card/40 p-12 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15">
        <Blocks className="h-7 w-7 text-emerald-400" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">
        {hasServers ? 'No servers match your search' : 'No servers yet'}
      </h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        {hasServers
          ? 'Try a different search term, or create a new server to get started.'
          : 'Create your first free Minecraft server in under 60 seconds. No payment required.'}
      </p>
      <div className="mt-5 flex justify-center gap-2">
        <Button onClick={onCreate} className="gap-2 bg-emerald-500 text-black hover:bg-emerald-400">
          <Plus className="h-4 w-4" /> Create Server
        </Button>
        <Button variant="outline" onClick={onHome}>Back to home</Button>
      </div>
    </Card>
  )
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded bg-emerald-500 text-black">
                <Blocks className="h-4 w-4" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-pixel text-xs text-emerald-400">Block</span>
                <span className="text-sm font-semibold">Host</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Free Minecraft server hosting for everyone. Spin up vanilla, Paper, Spigot,
              Forge, and Fabric servers in seconds.
            </p>
            <div className="mt-3 flex gap-3 text-muted-foreground">
              <a href="#" aria-label="GitHub" className="hover:text-emerald-400"><Github className="h-4 w-4" /></a>
              <a href="#" aria-label="Twitter" className="hover:text-emerald-400"><Twitter className="h-4 w-4" /></a>
            </div>
          </div>

          <FooterCol title="Product" links={['Features', 'Free', 'Dashboard', 'Status']} />
          <FooterCol title="Resources" links={['Docs', 'Plugins', 'Mods', 'Tutorials']} />
          <FooterCol title="Company" links={['About', 'Blog', 'Careers', 'Contact']} />
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/40 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} BlockHost. Not affiliated with Mojang or Microsoft.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">{l}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

function StatBadge({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-lg border border-border/40 bg-card/60 px-3 py-2.5 backdrop-blur">
      <div className="flex items-center gap-1.5 text-emerald-400 [&>svg]:h-3.5 [&>svg]:w-3.5">
        {icon}
      </div>
      <div className="mt-1 text-lg font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  )
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="border-border/60 bg-card/60 p-5 transition-all hover:border-emerald-500/30 hover:bg-card/80">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400 [&>svg]:h-5 [&>svg]:w-5.5">
        {icon}
      </div>
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </Card>
  )
}

function Step({ n, icon, title, desc }: { n: number; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="relative border-border/60 bg-card/60 p-5">
      <div className="absolute right-4 top-4 text-5xl font-bold text-emerald-500/15">{n}</div>
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400 [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </div>
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </Card>
  )
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium">{q}</span>
        <ChevronRight className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/40 px-2 py-1.5">
      <div className="text-[9px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-mono text-xs font-medium">{value}</div>
    </div>
  )
}
