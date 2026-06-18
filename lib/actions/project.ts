"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { createProjectSchema } from "@/lib/validations/project"
import type { Project } from "@prisma/client"

type ActionResult<T> = { data: T; error?: never } | { data?: never; error: string }

export async function listProjects(): Promise<ActionResult<Project[]>> {
  const session = await auth()
  if (!session?.user) return { error: "로그인이 필요합니다." }
  try {
    const projects = await db.project.findMany({ orderBy: { createdAt: "desc" } })
    return { data: projects }
  } catch {
    return { error: "프로젝트 목록을 불러오지 못했습니다." }
  }
}

export async function createProject(
  formData: FormData,
): Promise<ActionResult<Project>> {
  const session = await auth()
  if (!session?.user) return { error: "로그인이 필요합니다." }

  const parsed = createProjectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  try {
    const project = await db.project.create({
      data: { ...parsed.data, ownerId: session.user.id },
    })
    return { data: project }
  } catch {
    return { error: "프로젝트를 생성하지 못했습니다." }
  }
}
