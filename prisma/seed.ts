import { PrismaClient } from "@prisma/client"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import { hash } from "bcryptjs"
import { config } from "dotenv"

config({ path: ".env.local" })

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter })

async function main() {
  const password = await hash("admin1234", 12)

  const admin = await db.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "관리자",
      password,
      role: "ADMIN",
    },
  })

  const project = await db.project.upsert({
    where: { id: "seed-project-1" },
    update: {},
    create: {
      id: "seed-project-1",
      title: "샘플 프로젝트",
      description: "씨드 데이터용 샘플 프로젝트입니다.",
      ownerId: admin.id,
    },
  })

  await db.task.upsert({
    where: { id: "seed-task-1" },
    update: {},
    create: {
      id: "seed-task-1",
      title: "기획 완료",
      status: "DONE",
      priority: "HIGH",
      projectId: project.id,
      assigneeId: admin.id,
    },
  })

  await db.task.upsert({
    where: { id: "seed-task-2" },
    update: {},
    create: {
      id: "seed-task-2",
      title: "개발 시작",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      projectId: project.id,
      assigneeId: admin.id,
    },
  })

  console.log("✓ Seed complete — admin@example.com / admin1234")
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
