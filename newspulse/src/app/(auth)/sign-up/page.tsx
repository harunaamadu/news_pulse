import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-card";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = { title: "Create account" };

interface SignUpPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
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