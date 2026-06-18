import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import { config } from "dotenv"

// Only loads if DATABASE_URL not already set (Next.js sets it; Vitest does not)
if (!process.env.DATABASE_URL) {
  config({ path: ".env.local" })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createDb() {
  const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

export const db = globalForPrisma.prisma ?? createDb()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
