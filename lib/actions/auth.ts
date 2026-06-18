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
