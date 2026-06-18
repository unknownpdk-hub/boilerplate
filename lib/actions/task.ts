"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { createTaskSchema } from "@/lib/validations/task"
import type { Task } from "@prisma/client"

type ActionResult<T> = { data: T; error?: never } | { data?: never; error: string }

export async function listTasks(projectId?: string): Promise<ActionResult<Task[]>> {
  const session = await auth()
  if (!session?.user) return { error: "로그인이 필요합니다." }
  try {
    const tasks = await db.task.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { createdAt: "desc" },
    })
    return { data: tasks }
  } catch {
    return { error: "태스크 목록을 불러오지 못했습니다." }
  }
}

export async function createTask(
  formData: FormData,
): Promise<ActionResult<Task>> {
  const session = await auth()
  if (!session?.user) return { error: "로그인이 필요합니다." }

  const parsed = createTaskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    priority: formData.get("priority") || "MEDIUM",
    projectId: formData.get("projectId"),
    assigneeId: formData.get("assigneeId") || undefined,
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  try {
    const task = await db.task.create({ data: parsed.data })
    return { data: task }
  } catch {
    return { error: "태스크를 생성하지 못했습니다." }
  }
}
