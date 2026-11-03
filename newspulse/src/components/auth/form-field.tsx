import type { LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps extends ComponentProps<typeof Input> {
  name: string;
  label: string;
  icon: LucideIcon;
  error?: string;
}

export function FormField({
  label,
  icon: Icon,
  error,
  id,
  className,
  ...props
}: FormFieldProps) {
  const fieldId = id ?? props.name;

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id={fieldId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={cn("pl-9", className)}
          {...props}
        />
      </div>
      {error && (
        <p id={`${fieldId}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}