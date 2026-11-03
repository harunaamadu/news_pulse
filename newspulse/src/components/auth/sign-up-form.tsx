"use client";

import { Lock, Mail, User } from "lucide-react";
import { useActionState } from "react";

import { signUpAction } from "@/actions/auth-actions";
import { FormField } from "@/components/auth/form-field";
import { SubmitButton } from "@/components/auth/submit-button";
import type { ActionState } from "@/types";

const initialState: ActionState = {};

export function SignUpForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction] = useActionState(signUpAction, initialState);

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
        name="name"
        label="Full name"
        icon={User}
        autoComplete="name"
        placeholder="Ama Mensah"
        defaultValue={state.values?.name}
        error={state.fieldErrors?.name?.[0]}
        required
      />
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
        autoComplete="new-password"
        placeholder="At least 8 characters"
        error={state.fieldErrors?.password?.[0]}
        required
      />

      <SubmitButton className="w-full">Create account</SubmitButton>
    </form>
  );
}