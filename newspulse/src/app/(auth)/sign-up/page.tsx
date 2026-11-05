import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { AuthSkeleton } from "@/components/auth/auth-skeleton";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = { title: "Create account" };

interface SignUpPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default function SignUpPage({ searchParams }: SignUpPageProps) {
  return (
    <Suspense fallback={<AuthSkeleton />}>
      <SignUpContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SignUpContent({ searchParams }: SignUpPageProps) {
  const { callbackUrl } = await searchParams;
  const signInHref = callbackUrl
    ? `/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/sign-in";

  return (
    <AuthCard
      title="Create your account"
      description="Follow topics, bookmark stories and join the discussion."
      footerText="Already have an account?"
      footerLinkLabel="Sign in"
      footerHref={signInHref}
    >
      <OAuthButtons callbackUrl={callbackUrl} />
      <SignUpForm callbackUrl={callbackUrl} />
    </AuthCard>
  );
}
