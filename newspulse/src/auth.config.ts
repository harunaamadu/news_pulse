import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

// Client IDs and secrets are read automatically from
// AUTH_GITHUB_ID / AUTH_GITHUB_SECRET / AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET
export default {
  providers: [GitHub, Google],
  pages: { signIn: "/sign-in" },
} satisfies NextAuthConfig;