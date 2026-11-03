"use client";

import { Lock, Mail } from "lucide-react";
import { useActionState } from "react";

import { signInAction } from "@/actions/auth-actions";
import { FormField } from "@/components/auth/form-field";
import { SubmitButton } from "@/components/auth/submit-button";
import type { ActionState } from "@/types";

const initialState: ActionState = {};

export function SignInForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/"} />

      {state.error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </div>
      )}

      <FormField
        name="email"
        type="email"
        label="Email"
        icon={Mail}
        autoComplete="email"
        placeholder="you@example.com"
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email?.[0]}
        required
      />
      <FormField
        name="password"
        type="password"
        label="Password"
        icon={Lock}
        autoComplete="current-password"
        placeholder="••••••••"
        error={state.fieldErrors?.password?.[0]}
        required
      />

      <SubmitButton className="w-full">Sign in</SubmitButton>
    </form>
  );
}