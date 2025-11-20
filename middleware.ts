import { auth } from "@/app/api/auth/[...nextauth]/route"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAdminRoute = req.nextUrl.pathname.startsWith("/admin")
  const isOnLoginPage = req.nextUrl.pathname === "/admin/login"

  if (isOnAdminRoute && !isOnLoginPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  if (isOnLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}
