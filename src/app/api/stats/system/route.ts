import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { db } from '@/lib/db-v2'
import { getActiveSessionCount } from '@/lib/auth/session'
import { getEngine } from '@/lib/mc/engine'

export const dynamic = 'force-dynamic'

// In-memory CPU sample cache for computing CPU% between requests
interface CpuSample { idle: number; total: number; ts: number }
let lastCpuSample: CpuSample | null = null

function readCpuUsage(): { cpuPercent: number; sampleAge: number } {
  try {
    const stat = readFileSync('/proc/stat', 'utf8')
    // First line is aggregate: "cpu  user nice system idle iowait irq softirq steal guest guest_nice"
    const line = stat.split('\n')[0]
    const parts = line.trim().split(/\s+/)
    if (parts[0] !== 'cpu') return { cpuPercent: 0, sampleAge: 0 }
    const user = parseInt(parts[1], 10)
    const nice = parseInt(parts[2], 10)
    const system = parseInt(parts[3], 10)
    const idle = parseInt(parts[4], 10)
    const iowait = parseInt(parts[5], 10) || 0
    const irq = parseInt(parts[6], 10) || 0
    const softirq = parseInt(parts[7], 10) || 0
    const steal = parseInt(parts[8], 10) || 0
    const totalIdle = idle + iowait
    const totalNonIdle = user + nice + system + irq + softirq + steal
    const total = totalIdle + totalNonIdle
    const now = Date.now()
    if (lastCpuSample) {
      const dTotal = total - lastCpuSample.total
      const dIdle = totalIdle - lastCpuSample.idle
      const cpuPercent = dTotal > 0 ? Math.max(0, Math.min(100, ((dTotal - dIdle) / dTotal) * 100)) : 0
      lastCpuSample = { idle: totalIdle, total, ts: now }
      return { cpuPercent: Math.round(cpuPercent * 10) / 10, sampleAge: now - lastCpuSample.ts }
    }
    lastCpuSample = { idle: totalIdle, total, ts: now }
    // First sample — return 0 (need two samples to compute delta)
    return { cpuPercent: 0, sampleAge: 0 }
  } catch {
    return { cpuPercent: 0, sampleAge: 0 }
  }
}

function readMemInfo(): { totalMb: number; availableMb: number; usedMb: number; usedPercent: number } {
  try {
    const meminfo = readFileSync('/proc/meminfo', 'utf8')
    const get = (key: string) => {
      const m = meminfo.match(new RegExp(`^${key}:\\s+(\\d+)\\s+kB`, 'm'))
      return m ? parseInt(m[1], 10) : 0
    }
    const totalKb = get('MemTotal')
    const availableKb = get('MemAvailable') || (get('MemFree') + get('Buffers') + get('Cached'))
    const totalMb = Math.round(totalKb / 1024)
    const availableMb = Math.round(availableKb / 1024)
    const usedMb = totalMb - availableMb
    const usedPercent = totalMb > 0 ? Math.round((usedMb / totalMb) * 1000) / 10 : 0
    return { totalMb, availableMb, usedMb, usedPercent }
  } catch {
    return { totalMb: 0, availableMb: 0, usedMb: 0, usedPercent: 0 }
  }
}

// GET /api/stats/system — returns system + platform stats for the account page
export async function GET() {
  try {
    const cpu = readCpuUsage()
    const mem = readMemInfo()
    const activeSessions = getActiveSessionCount()

    // Count all servers across all users
    const allServers = await db.server.findMany({ select: { id: true, status: true, ownerId: true, name: true, version: true, type: true, players: true, port: true } })
    const runningCount = allServers.filter((s) => s.status === 'online' || s.status === 'starting').length
    const offlineCount = allServers.filter((s) => s.status === 'offline' || s.status === 'crashed').length
    const stoppingCount = allServers.filter((s) => s.status === 'stopping').length
    const totalPlayers = allServers.reduce((sum, s) => sum + (s.players || 0), 0)

    // Engine stats — sum of running Java processes' CPU + RAM
    const engine = getEngine()
    let totalEngineCpu = 0
    let totalEngineRam = 0
    let runningServerIds: string[] = []
    for (const s of allServers) {
      const stats = engine.getStats(s.id)
      if (stats && (stats.status === 'online' || stats.status === 'starting')) {
        totalEngineCpu += stats.cpu
        totalEngineRam += stats.ram
        runningServerIds.push(s.id)
      }
    }

    const totalUsers = await db.user.count()

    return NextResponse.json({
      system: {
        cpuPercent: cpu.cpuPercent,
        memory: mem,
        loadAverage: readLoadAvg(),
        uptime: readSystemUptime(),
      },
      platform: {
        activeSessions,
        totalUsers,
        totalServers: allServers.length,
        serversRunning: runningCount,
        serversOffline: offlineCount,
        serversStopping: stoppingCount,
        totalPlayers,
        runningServerIds,
      },
      engine: {
        totalCpuPercent: Math.round(totalEngineCpu * 10) / 10,
        totalRamMb: Math.round(totalEngineRam),
        runningCount: runningServerIds.length,
      },
    })
  } catch (e) {
    console.error('GET /api/stats/system error:', e)
    return NextResponse.json({ error: 'Failed to read system stats' }, { status: 500 })
  }
}

function readLoadAvg(): number[] {
  try {
    const s = readFileSync('/proc/loadavg', 'utf8')
    return s.split(/\s+/).slice(0, 3).map(Number)
  } catch {
    return [0, 0, 0]
  }
}

function readSystemUptime(): number {
  try {
    const s = readFileSync('/proc/uptime', 'utf8')
    return Math.floor(parseFloat(s.split(/\s+/)[0]))
  } catch {
    return 0
  }
}
