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
