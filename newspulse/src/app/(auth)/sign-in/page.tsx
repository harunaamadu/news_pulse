import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-card";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = { title: "Sign in" };

interface SignInPageProps {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { callbackUrl } = await searchParams;
  const signUpHref = callbackUrl
    ? `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/sign-up";

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to access your personalized feed and saved stories."
      footerText="New to NewsPulse?"
      footerLinkLabel="Create an account"
      footerHref={signUpHref}
    >
      <OAuthButtons callbackUrl={callbackUrl} />
      <SignInForm callbackUrl={callbackUrl} />
    </AuthCard>
  );
}
