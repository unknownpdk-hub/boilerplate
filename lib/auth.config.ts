import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { Role } from "@prisma/client"

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
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
}
