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

