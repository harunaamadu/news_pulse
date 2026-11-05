"use client";

import { CheckCircle2, Mail, User } from "lucide-react";
import { useActionState, useState } from "react";

import { submitContactAction } from "@/actions/contact-actions";
import { FormField } from "@/components/auth/form-field";
import { SubmitButton } from "@/components/auth/submit-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_TOPICS, type ContactTopicValue } from "@/lib/contact";
import type { ActionState } from "@/types";

const initialState: ActionState = {};

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive dark:bg-input/30";

interface ContactFormProps {
  defaults: { name: string; email: string; topic: ContactTopicValue };
}

// The key remounts the form, which clears its state for "Send another"
export function ContactForm({ defaults }: ContactFormProps) {
  const [formKey, setFormKey] = useState(0);

  return (
    <ContactFormInner
      key={formKey}
      defaults={defaults}
      onReset={() => setFormKey((value) => value + 1)}
    />
  );
}

function ContactFormInner({
  defaults,
  onReset,
}: ContactFormProps & { onReset: () => void }) {
  const [state, formAction] = useActionState(submitContactAction, initialState);

  if (state.success) {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 py-10 text-center"
      >
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-semibold">Message sent</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thank you for writing. An editor will read your message and reply by
          email if a response is needed.
        </p>
        <Button type="button" variant="outline" onClick={onReset} className="mt-2">
          Send another message
        </Button>
      </div>
    );
  }

  const error = (key: string) => state.fieldErrors?.[key]?.[0];

  return (
    <form action={formAction} className="relative space-y-5" noValidate>
      {state.error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          name="name"
          label="Your name"
          icon={User}
          autoComplete="name"
          placeholder="Ama Mensah"
          defaultValue={state.values?.name ?? defaults.name}
          error={error("name")}
          required
        />
        <FormField
          name="email"
          type="email"
          label="Email"
          icon={Mail}
          autoComplete="email"
          placeholder="you@example.com"
          defaultValue={state.values?.email ?? defaults.email}
          error={error("email")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="topic">Topic</Label>
        <select
          id="topic"
          name="topic"
          defaultValue={state.values?.topic ?? defaults.topic}
          aria-invalid={Boolean(error("topic"))}
          className={selectClass}
        >
          {CONTACT_TOPICS.map((topic) => (
            <option key={topic.value} value={topic.value}>
              {topic.label}
            </option>
          ))}
        </select>
        {error("topic") && (
          <p role="alert" className="text-sm text-destructive">
            {error("topic")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={7}
          maxLength={2000}
          required
          defaultValue={state.values?.message}
          placeholder="Tell us what's on your mind. For an error report, include a link to the story."
          aria-invalid={Boolean(error("message"))}
          aria-describedby={error("message") ? "message-error" : "message-hint"}
          className="resize-y"
        />
        {error("message") ? (
          <p id="message-error" role="alert" className="text-sm text-destructive">
            {error("message")}
          </p>
        ) : (
          <p id="message-hint" className="text-xs text-muted-foreground">
            Up to 2,000 characters.
          </p>
        )}
      </div>

      {/* Honeypot: hidden from people and screen readers, tempting to bots */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex justify-end">
        <SubmitButton>Send message</SubmitButton>
      </div>
    </form>
  );
}