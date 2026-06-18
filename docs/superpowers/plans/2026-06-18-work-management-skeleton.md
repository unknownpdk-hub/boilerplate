# Work Management Skeleton — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Next.js 15 App Router + TypeScript 사내 업무 관리 툴의 실행 가능한 빈 뼈대를 생성한다.

**Architecture:** Server Actions-first 패턴. `(auth)` 라우트 그룹은 공개, `(app)` 그룹은 `middleware.ts`가 JWT 세션으로 보호. 데이터 변이는 `lib/actions/` Server Actions, 데이터 조회는 Server Component 직접 호출.

**Tech Stack:** Next.js 15 · TypeScript · Prisma 5 + SQLite · shadcn/ui · Auth.js v5 (next-auth@beta) · bcryptjs · Zod · Vitest · ESLint

## Global Constraints

- Node 20+ 환경 (WSL Ubuntu 권장)
- 모든 임포트 경로에 `@/*` 별칭 사용 (`@/lib/...`, `@/components/...`)
- `"use server"` 없는 파일에서 `db` 직접 호출 금지
- `"use client"` 없는 파일에서 React 훅 사용 금지
- 시크릿은 반드시 `.env.local`에서만 읽음 (코드에 하드코딩 금지)

---

## File Map

| 경로 | 역할 | 생성/수정 |
|------|------|-----------|
| `prisma/schema.prisma` | DB 스키마 | 생성 |
| `prisma/seed.ts` | 시드 데이터 | 생성 |
| `lib/db.ts` | Prisma 싱글턴 | 생성 |
| `lib/auth.ts` | NextAuth 설정 | 생성 |
| `lib/actions/auth.ts` | 로그인 서버 액션 | 생성 |
| `lib/actions/project.ts` | 프로젝트 액션 스텁 | 생성 |
| `lib/actions/task.ts` | 태스크 액션 스텁 | 생성 |
| `lib/validations/auth.ts` | 로그인 Zod 스키마 | 생성 |
| `lib/validations/project.ts` | 프로젝트 Zod 스키마 | 생성 |
| `lib/validations/task.ts` | 태스크 Zod 스키마 | 생성 |
| `lib/validations/project.test.ts` | 스키마 단위 테스트 | 생성 |
| `types/next-auth.d.ts` | 세션 타입 확장 | 생성 |
| `middleware.ts` | 라우트 가드 | 생성 |
| `vitest.config.ts` | Vitest 설정 | 생성 |
| `.env.local.example` | 환경변수 템플릿 | 생성 |
| `app/layout.tsx` | 루트 레이아웃 | 수정 |
| `app/page.tsx` | 루트 → 대시보드 리다이렉트 | 수정 |
| `app/api/auth/[...nextauth]/route.ts` | NextAuth 라우트 핸들러 | 생성 |
| `app/(auth)/login/page.tsx` | 로그인 페이지 | 생성 |
| `app/(app)/layout.tsx` | 앱 셸 레이아웃 | 생성 |
| `app/(app)/dashboard/page.tsx` | 대시보드 | 생성 |
| `app/(app)/projects/page.tsx` | 프로젝트 목록 | 생성 |
| `app/(app)/tasks/page.tsx` | 태스크 목록 | 생성 |
| `components/app/sidebar.tsx` | 사이드바 네비게이션 | 생성 |
| `components/app/project-table.tsx` | 프로젝트 테이블 | 생성 |
| `components/app/task-table.tsx` | 태스크 테이블 | 생성 |

---

### Task 1: Project Scaffold & Tooling

**Files:**
- Create: `vitest.config.ts`
- Create: `.env.local.example`
- Modify: `package.json` (scripts 추가)

**Interfaces:**
- Produces: 실행 가능한 Next.js 15 프로젝트 + shadcn/ui + Vitest 환경

- [ ] **Step 1: WSL 터미널에서 프로젝트 초기화**

```bash
cd ~/workstation
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*" \
  --no-turbopack \
  --yes
```

Expected output:
```
✔ Success! Created a new Next.js app at ~/workstation
```

- [ ] **Step 2: 추가 의존성 설치**

```bash
npm install next-auth@beta @prisma/client bcryptjs zod react-hook-form @hookform/resolvers lucide-react
npm install -D prisma @types/bcryptjs tsx vitest @vitejs/plugin-react jsdom
```

Expected: 오류 없이 설치 완료

- [ ] **Step 3: shadcn/ui 초기화**

```bash
npx shadcn@latest init -d
```

Expected output:
```
✔ Preflight checks.
✔ Verifying framework.
✔ Initializing project.
✔ Installing dependencies.
✔ Created 1 file:
  - components/ui/utils.ts
```

- [ ] **Step 4: 필요한 shadcn 컴포넌트 추가**

```bash
npx shadcn@latest add button form input label table badge sheet avatar card
```

Expected: `components/ui/` 아래에 각 컴포넌트 파일 생성

- [ ] **Step 5: `vitest.config.ts` 생성**

```ts
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
```

- [ ] **Step 6: `package.json` scripts 및 prisma.seed 추가**

`package.json`의 `"scripts"` 섹션을 다음으로 교체:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest",
  "db:push": "prisma db push",
  "db:seed": "tsx prisma/seed.ts"
},
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

- [ ] **Step 7: `.env.local.example` 생성**

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="change-me-to-a-random-32-char-string"
```

- [ ] **Step 8: `.env.local` 생성 (로컬 개발용)**

```bash
cp .env.local.example .env.local
```

- [ ] **Step 9: 빌드 오류 없는지 확인**

```bash
npm run lint
```

Expected: 오류 0개

- [ ] **Step 10: 커밋**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js 15 project with shadcn/ui and Vitest"
```

---

### Task 2: Prisma Database Layer

**Files:**
- Create: `prisma/schema.prisma`
- Create: `lib/db.ts`
- Create: `prisma/seed.ts`

**Interfaces:**
- Produces: `db` — `PrismaClient` 싱글턴, `lib/db.ts`에서 named export

- [ ] **Step 1: `prisma/schema.prisma` 생성**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(MEMBER)
  createdAt DateTime @default(now())

  ownedProjects Project[] @relation("owner")
  assignedTasks Task[]    @relation("assignee")
}

model Project {
  id          String        @id @default(cuid())
  title       String
  description String?
  status      ProjectStatus @default(ACTIVE)
  createdAt   DateTime      @default(now())

  owner   User   @relation("owner", fields: [ownerId], references: [id])
  ownerId String
  tasks   Task[]
}

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  createdAt   DateTime   @default(now())

  project    Project @relation(fields: [projectId], references: [id])
  projectId  String
  assignee   User?   @relation("assignee", fields: [assigneeId], references: [id])
  assigneeId String?
}

enum Role          { ADMIN MEMBER }
enum ProjectStatus { ACTIVE ARCHIVED }
enum TaskStatus    { TODO IN_PROGRESS DONE }
enum Priority      { LOW MEDIUM HIGH }
```

- [ ] **Step 2: DB push (마이그레이션 없이 스키마 적용)**

```bash
npm run db:push
```

Expected output:
```
✔ Generated Prisma Client
✔ Your database is now in sync with your Prisma schema.
```

- [ ] **Step 3: `lib/db.ts` 생성**

```ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
```

- [ ] **Step 4: `prisma/seed.ts` 생성**

```ts
import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const db = new PrismaClient()

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

  await db.task.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "seed-task-1",
        title: "기획 완료",
        status: "DONE",
        priority: "HIGH",
        projectId: project.id,
        assigneeId: admin.id,
      },
      {
        id: "seed-task-2",
        title: "개발 시작",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        projectId: project.id,
        assigneeId: admin.id,
      },
    ],
  })

  console.log("✓ Seed complete — admin@example.com / admin1234")
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
```

- [ ] **Step 5: 시드 실행**

```bash
npm run db:seed
```

Expected output:
```
✓ Seed complete — admin@example.com / admin1234
```

- [ ] **Step 6: 커밋**

```bash
git add prisma/ lib/db.ts
git commit -m "feat: add Prisma schema, SQLite DB, and seed data"
```

---

### Task 3: Auth.js Setup

**Files:**
- Create: `lib/validations/auth.ts`
- Create: `lib/auth.ts`
- Create: `types/next-auth.d.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `lib/actions/auth.ts`
- Create: `middleware.ts`

**Interfaces:**
- Consumes: `db` from `@/lib/db`
- Produces:
  - `auth` — `() => Promise<Session | null>` (Server Component용)
  - `signIn` — Auth.js signIn 함수
  - `handlers` — `{ GET, POST }` (라우트 핸들러용)
  - `loginAction(prev, formData)` — 로그인 Server Action

- [ ] **Step 1: `lib/validations/auth.ts` 생성**

```ts
import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("올바른 이메일 주소를 입력해 주세요."),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
})

export type LoginInput = z.infer<typeof loginSchema>
```

- [ ] **Step 2: `lib/auth.ts` 생성**

```ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "@/lib/db"
import { loginSchema } from "@/lib/validations/auth"
import type { Role } from "@prisma/client"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
          select: { id: true, email: true, name: true, password: true, role: true },
        })
        if (!user) return null

        const valid = await compare(parsed.data.password, user.password)
        if (!valid) return null

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: Role }).role
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as Role
      return session
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
})
```

- [ ] **Step 3: `types/next-auth.d.ts` 생성**

```ts
import type { Role } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: Role
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
  }
}
```

- [ ] **Step 4: `app/api/auth/[...nextauth]/route.ts` 생성**

```bash
mkdir -p app/api/auth/\[...nextauth\]
```

```ts
import { handlers } from "@/lib/auth"
export const { GET, POST } = handlers
```

- [ ] **Step 5: `lib/actions/auth.ts` 생성**

```ts
"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export type LoginState = { error: string } | undefined

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/dashboard",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "이메일 또는 비밀번호가 올바르지 않습니다." }
    }
    throw error
  }
}
```

- [ ] **Step 6: `middleware.ts` 생성**

```ts
import { auth } from "@/lib/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/api/auth") || pathname.startsWith("/login")) {
    return
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl.origin))
  }
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
```

- [ ] **Step 7: TypeScript 오류 없는지 확인**

```bash
npx tsc --noEmit
```

Expected: 오류 0개

- [ ] **Step 8: 커밋**

```bash
git add lib/auth.ts lib/actions/auth.ts lib/validations/auth.ts \
        types/ middleware.ts app/api/
git commit -m "feat: add Auth.js v5 with Credentials provider and route guard"
```

---

### Task 4: Validation Schemas & Server Actions (TDD)

**Files:**
- Create: `lib/validations/project.ts`
- Create: `lib/validations/task.ts`
- Create: `lib/validations/project.test.ts`
- Create: `lib/actions/project.ts`
- Create: `lib/actions/task.ts`

**Interfaces:**
- Consumes: `db` from `@/lib/db`, `auth` from `@/lib/auth`
- Produces:
  - `createProjectSchema` — `z.ZodObject`, `lib/validations/project.ts`
  - `createTaskSchema` — `z.ZodObject`, `lib/validations/task.ts`
  - `listProjects()` — `Promise<ActionResult<Project[]>>`
  - `createProject(formData)` — `Promise<ActionResult<Project>>`
  - `listTasks(projectId?)` — `Promise<ActionResult<Task[]>>`
  - `createTask(formData)` — `Promise<ActionResult<Task>>`

- [ ] **Step 1: 실패할 테스트 작성 (`lib/validations/project.test.ts`)**

```ts
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
    expect(result.error?.errors[0].message).toBe("제목을 입력해 주세요.")
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
```

- [ ] **Step 2: 테스트 실행 — FAIL 확인**

```bash
npm test
```

Expected:
```
FAIL  lib/validations/project.test.ts
  Error: Cannot find module './project'
```

- [ ] **Step 3: `lib/validations/project.ts` 생성**

```ts
import { z } from "zod"

export const createProjectSchema = z.object({
  title: z.string().min(1, "제목을 입력해 주세요.").max(100),
  description: z.string().max(500).optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
```

- [ ] **Step 4: 테스트 실행 — PASS 확인**

```bash
npm test
```

Expected:
```
✓ lib/validations/project.test.ts (4)
  ✓ createProjectSchema > 유효한 데이터를 통과시킨다
  ✓ createProjectSchema > 빈 제목을 거부한다
  ✓ createProjectSchema > 100자 초과 제목을 거부한다
  ✓ createProjectSchema > 설명 없이도 유효하다

Test Files  1 passed (1)
Tests  4 passed (4)
```

- [ ] **Step 5: `lib/validations/task.ts` 생성**

```ts
import { z } from "zod"

export const createTaskSchema = z.object({
  title: z.string().min(1, "제목을 입력해 주세요.").max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  projectId: z.string().min(1, "프로젝트를 선택해 주세요."),
  assigneeId: z.string().optional(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
```

- [ ] **Step 6: `lib/actions/project.ts` 생성**

```ts
"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { createProjectSchema } from "@/lib/validations/project"
import type { Project } from "@prisma/client"

type ActionResult<T> = { data: T; error?: never } | { data?: never; error: string }

export async function listProjects(): Promise<ActionResult<Project[]>> {
  try {
    const projects = await db.project.findMany({
      orderBy: { createdAt: "desc" },
    })
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
    return { error: parsed.error.errors[0].message }
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
```

- [ ] **Step 7: `lib/actions/task.ts` 생성**

```ts
"use server"

import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { createTaskSchema } from "@/lib/validations/task"
import type { Task } from "@prisma/client"

type ActionResult<T> = { data: T; error?: never } | { data?: never; error: string }

export async function listTasks(projectId?: string): Promise<ActionResult<Task[]>> {
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
    return { error: parsed.error.errors[0].message }
  }

  try {
    const task = await db.task.create({ data: parsed.data })
    return { data: task }
  } catch {
    return { error: "태스크를 생성하지 못했습니다." }
  }
}
```

- [ ] **Step 8: 최종 테스트 통과 확인**

```bash
npm test
```

Expected: `Tests  4 passed (4)`

- [ ] **Step 9: 커밋**

```bash
git add lib/validations/ lib/actions/
git commit -m "feat: add Zod schemas and Server Action stubs with TDD"
```

---

### Task 5: App Shell

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(app)/layout.tsx`
- Create: `components/app/sidebar.tsx`

**Interfaces:**
- Consumes: `loginAction` from `@/lib/actions/auth`, `auth` from `@/lib/auth`
- Consumes: shadcn/ui `Button`, `Input`, `Label`, `Sheet`, `Avatar`
- Produces: 인증된 사용자만 접근 가능한 앱 셸

- [ ] **Step 1: `app/layout.tsx` 수정**

기존 내용을 다음으로 전체 교체:

```tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "업무 관리",
  description: "사내 업무 관리 툴",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: `app/page.tsx` 수정**

기존 내용을 다음으로 전체 교체:

```tsx
import { redirect } from "next/navigation"

export default function Home() {
  redirect("/dashboard")
}
```

- [ ] **Step 3: `components/app/sidebar.tsx` 생성**

```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FolderKanban, CheckSquare } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/projects", label: "프로젝트", icon: FolderKanban },
  { href: "/tasks", label: "태스크", icon: CheckSquare },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-56 flex-col border-r bg-background px-3 py-4">
      <p className="mb-6 px-2 text-lg font-semibold">업무 관리</p>
      <nav className="space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-accent",
              pathname === href && "bg-accent",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
```

- [ ] **Step 4: `app/(auth)/login/page.tsx` 생성**

```bash
mkdir -p app/\(auth\)/login
```

```tsx
"use client"

import { useActionState } from "react"
import { loginAction } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined)

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 rounded-lg border p-6 shadow-sm">
        <h1 className="text-2xl font-bold">로그인</h1>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "로그인 중…" : "로그인"}
          </Button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: `app/(app)/layout.tsx` 생성**

```bash
mkdir -p app/\(app\)
```

```tsx
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/app/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const initials = session.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-56 p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <div className="hidden md:block" />
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: TypeScript 확인**

```bash
npx tsc --noEmit
```

Expected: 오류 0개

- [ ] **Step 7: 커밋**

```bash
git add app/ components/
git commit -m "feat: add app shell, sidebar, and login page"
```

---

### Task 6: Data Pages

**Files:**
- Create: `components/app/project-table.tsx`
- Create: `components/app/task-table.tsx`
- Create: `app/(app)/dashboard/page.tsx`
- Create: `app/(app)/projects/page.tsx`
- Create: `app/(app)/tasks/page.tsx`

**Interfaces:**
- Consumes: `listProjects()` from `@/lib/actions/project`
- Consumes: `listTasks()` from `@/lib/actions/task`
- Consumes: shadcn/ui `Table`, `Badge`, `Card`, `Button`
- Consumes: `Project`, `Task` types from `@prisma/client`

- [ ] **Step 1: `components/app/project-table.tsx` 생성**

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Project } from "@prisma/client"

const statusLabel: Record<string, string> = {
  ACTIVE: "진행중",
  ARCHIVED: "보관됨",
}
const statusVariant: Record<string, "default" | "secondary"> = {
  ACTIVE: "default",
  ARCHIVED: "secondary",
}

export function ProjectTable({ projects }: { projects: Project[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>제목</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>생성일</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground">
              프로젝트가 없습니다.
            </TableCell>
          </TableRow>
        ) : (
          projects.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.title}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[p.status]}>
                  {statusLabel[p.status]}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(p.createdAt).toLocaleDateString("ko-KR")}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
```

- [ ] **Step 2: `components/app/task-table.tsx` 생성**

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@prisma/client"

const statusLabel: Record<string, string> = {
  TODO: "할 일",
  IN_PROGRESS: "진행중",
  DONE: "완료",
}
const priorityLabel: Record<string, string> = {
  LOW: "낮음",
  MEDIUM: "보통",
  HIGH: "높음",
}
const priorityVariant: Record<
  string,
  "default" | "secondary" | "destructive"
> = {
  LOW: "secondary",
  MEDIUM: "default",
  HIGH: "destructive",
}

export function TaskTable({ tasks }: { tasks: Task[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>제목</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>우선순위</TableHead>
          <TableHead>생성일</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              태스크가 없습니다.
            </TableCell>
          </TableRow>
        ) : (
          tasks.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.title}</TableCell>
              <TableCell>{statusLabel[t.status]}</TableCell>
              <TableCell>
                <Badge variant={priorityVariant[t.priority]}>
                  {priorityLabel[t.priority]}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(t.createdAt).toLocaleDateString("ko-KR")}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
```

- [ ] **Step 3: `app/(app)/dashboard/page.tsx` 생성**

```bash
mkdir -p app/\(app\)/dashboard
```

```tsx
import { listProjects } from "@/lib/actions/project"
import { listTasks } from "@/lib/actions/task"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function DashboardPage() {
  const [projectsResult, tasksResult] = await Promise.all([
    listProjects(),
    listTasks(),
  ])

  const projectCount = projectsResult.data?.length ?? 0
  const taskCount = tasksResult.data?.length ?? 0
  const doneCount =
    tasksResult.data?.filter((t) => t.status === "DONE").length ?? 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">대시보드</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 프로젝트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{projectCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 태스크
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{taskCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              완료된 태스크
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{doneCount}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: `app/(app)/projects/page.tsx` 생성**

```bash
mkdir -p app/\(app\)/projects
```

```tsx
import { listProjects } from "@/lib/actions/project"
import { ProjectTable } from "@/components/app/project-table"
import { Button } from "@/components/ui/button"

export default async function ProjectsPage() {
  const result = await listProjects()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">프로젝트</h1>
        <Button size="sm">새 프로젝트</Button>
      </div>
      {result.error ? (
        <p className="text-sm text-destructive">{result.error}</p>
      ) : (
        <ProjectTable projects={result.data} />
      )}
    </div>
  )
}
```

- [ ] **Step 5: `app/(app)/tasks/page.tsx` 생성**

```bash
mkdir -p app/\(app\)/tasks
```

```tsx
import { listTasks } from "@/lib/actions/task"
import { TaskTable } from "@/components/app/task-table"
import { Button } from "@/components/ui/button"

export default async function TasksPage() {
  const result = await listTasks()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">태스크</h1>
        <Button size="sm">새 태스크</Button>
      </div>
      {result.error ? (
        <p className="text-sm text-destructive">{result.error}</p>
      ) : (
        <TaskTable tasks={result.data} />
      )}
    </div>
  )
}
```

- [ ] **Step 6: 전체 빌드 확인**

```bash
npm run build
```

Expected:
```
✓ Compiled successfully
Route (app)                              Size
├ ○ /                                    ...
├ ○ /login                              ...
├ ○ /dashboard                          ...
├ ○ /projects                           ...
└ ○ /tasks                              ...
```

- [ ] **Step 7: 개발 서버 기동 및 동작 확인**

```bash
npm run dev
```

브라우저에서 순서대로 확인:
1. `http://localhost:3000` → `/login`으로 리다이렉트 되는가
2. `admin@example.com` / `admin1234`로 로그인 → `/dashboard`로 이동하는가
3. `/projects` — "샘플 프로젝트" 행이 보이는가
4. `/tasks` — "기획 완료", "개발 시작" 행이 보이는가
5. 로그인 없이 `/dashboard` 직접 접근 → `/login`으로 리다이렉트 되는가

- [ ] **Step 8: 최종 커밋**

```bash
git add app/ components/
git commit -m "feat: add dashboard, projects, and tasks pages with shadcn/ui tables"
```
