import { z } from "zod"

export const createProjectSchema = z.object({
  title: z.string().min(1, "제목을 입력해 주세요.").max(100),
  description: z.string().max(500).optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
