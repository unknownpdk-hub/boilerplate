import { describe, it, expect } from "vitest"
import { createProjectSchema } from "./project"

describe("createProjectSchema", () => {
  it("유효한 데이터를 통과시킨다", () => {
    const result = createProjectSchema.safeParse({ title: "새 프로젝트" })
    expect(result.success).toBe(true)
  })

  it("빈 제목을 거부한다", () => {
    const result = createProjectSchema.safeParse({ title: "" })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe("제목을 입력해 주세요.")
  })

  it("100자 초과 제목을 거부한다", () => {
    const result = createProjectSchema.safeParse({ title: "a".repeat(101) })
    expect(result.success).toBe(false)
  })

  it("설명 없이도 유효하다", () => {
    const result = createProjectSchema.safeParse({ title: "제목만" })
    expect(result.success).toBe(true)
    expect(result.data?.description).toBeUndefined()
  })
})
