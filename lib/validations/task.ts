import { z } from "zod"

export const createTaskSchema = z.object({
  title: z.string().min(1, "제목을 입력해 주세요.").max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  projectId: z.string().min(1, "프로젝트를 선택해 주세요."),
  assigneeId: z.string().optional(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
