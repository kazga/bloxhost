import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Force a new client on schema changes (bump this number to invalidate)
const SCHEMA_VERSION = 4

export const db =
  (globalForPrisma as any)?.prisma_v === SCHEMA_VERSION
    ? globalForPrisma.prisma!
    : new PrismaClient({
        log: ['query'],
      })

if (process.env.NODE_ENV !== 'production') {
  ;(globalForPrisma as any).prisma_v = SCHEMA_VERSION
  globalForPrisma.prisma = db
}
