# 사내 업무 관리 툴 — 뼈대 설계 스펙

**날짜:** 2026-06-18  
**스택:** Next.js 15 (App Router · TypeScript) · Prisma · SQLite · shadcn/ui · Auth.js v5 · ESLint · Vitest

---

## 1. 목표

프로젝트·태스크 관리 사내 툴의 실행 가능한 빈 뼈대를 생성한다.  
실제 비즈니스 로직은 이후 채워넣을 수 있도록 구조·타입·패턴만 확립한다.

---

## 2. 라우트 구조

```
app/
├── (auth)/
│   └── login/page.tsx          # 공개 — Credentials 로그인 폼
├── (app)/
│   ├── layout.tsx              # 사이드바 + 헤더 셸 (세션 필요)
│   ├── dashboard/page.tsx      # 요약 통계
│   ├── projects/page.tsx       # 프로젝트 목록 테이블
│   └── tasks/page.tsx          # 태스크 목록 테이블
├── api/auth/[...nextauth]/route.ts
├── layout.tsx                  # HTML 루트, SessionProvider
└── globals.css
```

**라우트 보호:** `middleware.ts`가 `(app)` 그룹 전체를 가드한다.  
- `/login`, `/api/auth/**` → 공개  
- 그 외 → 세션 없으면 `/login` 리다이렉트

---

## 3. 데이터 모델 (Prisma · SQLite)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String   // bcrypt hash
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

`prisma/seed.ts`: 관리자 계정(admin@example.com / password: admin1234) + 샘플 프로젝트 1개 + 샘플 태스크 2개.

---

## 4. 인증 (Auth.js v5)

- **Provider:** Credentials (이메일 + 비밀번호)
- **검증:** bcryptjs `compare()`
- **세션:** JWT 전략 (Edge 미들웨어 호환)
- **세션 확장:**

```ts
// types/next-auth.d.ts
declare module "next-auth" {
  interface Session {
    user: { id: string; name: string; email: string; role: Role }
  }
}
```

- **환경 변수:** `AUTH_SECRET` 하나로 동작. OAuth 키는 슬롯만 준비.

---

## 5. Server Actions

위치: `lib/actions/project.ts`, `lib/actions/task.ts`

**응답 타입 패턴:**
```ts
type ActionResult<T> = { data: T; error?: never } | { data?: never; error: string }
```

**스텁 목록:**
| 파일 | 함수 | 설명 |
|------|------|------|
| `project.ts` | `listProjects()` | 프로젝트 목록 조회 |
| `project.ts` | `createProject(formData)` | Zod 파싱 → Prisma insert |
| `task.ts` | `listTasks(projectId?)` | 태스크 목록 조회 |
| `task.ts` | `createTask(formData)` | Zod 파싱 → Prisma insert |

---

## 6. UI 컴포넌트 (shadcn/ui)

| 페이지 | 사용 컴포넌트 |
|--------|--------------|
| login | `Form`, `Input`, `Button` |
| projects | `Table`, `Badge` (status), `Button` (새 프로젝트) |
| tasks | `Table`, `Badge` (priority·status) |
| (app)/layout | `Sheet` (모바일 사이드바), `Avatar` |

shadcn/ui 컴포넌트는 `components/ui/`에 자동 생성, 앱 전용 컴포넌트는 `components/app/`에 위치.

---

## 7. 코드 품질

**ESLint**
- `eslint-config-next` + `@typescript-eslint` 기본 구성

**Vitest**
- 환경: jsdom
- 예제 테스트: `lib/validations/project.test.ts` — Zod 스키마 유효성 검증

---

## 8. 환경 변수 (`.env.local.example`)

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="change-me"
```

---

## 9. 스크립트

```json
{
  "dev": "next dev",
  "build": "next build",
  "db:push": "prisma db push",
  "db:seed": "tsx prisma/seed.ts",
  "test": "vitest",
  "lint": "next lint"
}
```

---

## 10. 범위 밖 (Out of Scope)

- 실시간 알림, 댓글, 파일 첨부
- 외부 OAuth provider 실제 연동
- 프로젝트·태스크 상세 페이지
- 어드민 패널
- 배포 설정 (Docker, CI/CD)
