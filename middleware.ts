import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

const { auth } = NextAuth(authConfig)

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
