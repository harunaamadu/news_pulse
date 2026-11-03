import { NextResponse } from "next/server";
import NextAuth from "next-auth";

import authConfig from "@/auth.config";

// Uses the edge-safe config only: no Prisma, no bcrypt
const { auth } = NextAuth(authConfig);

const authRoutes = ["/sign-in", "/sign-up"];
const protectedRoutes = ["/bookmarks"];

export default auth((req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;
  const isLoggedIn = Boolean(req.auth);

  const isAuthRoute = authRoutes.includes(pathname);
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isProtected && !isLoggedIn) {
    const signInUrl = new URL("/sign-in", nextUrl);
    signInUrl.searchParams.set("callbackUrl", `${pathname}${nextUrl.search}`);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};