"use client";

import { Input, Label, Textarea } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface BilingualFieldsProps {
  label: string;
  arValue: string;
  enValue: string;
  onArChange: (value: string) => void;
  onEnChange: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  arPlaceholder?: string;
  enPlaceholder?: string;
  className?: string;
}

export function BilingualFields({
  label,
  arValue,
  enValue,
  onArChange,
  onEnChange,
  multiline = false,
  rows = 4,
  required,
  disabled,
  arPlaceholder,
  enPlaceholder,
  className,
}: BilingualFieldsProps) {
  const Field = multiline ? Textarea : Input;

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-steel">
            AR
          </span>
          <Field
            dir="rtl"
            value={arValue}
            onChange={(e) => onArChange(e.target.value)}
            required={required}
            disabled={disabled}
            placeholder={arPlaceholder}
            {...(multiline ? { rows } : {})}
            className={multiline ? "font-arabic min-h-24" : "font-arabic"}
          />
        </div>
        <div>
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-steel">
            EN
          </span>
          <Field
            value={enValue}
            onChange={(e) => onEnChange(e.target.value)}
            required={required}
            disabled={disabled}
            placeholder={enPlaceholder}
            {...(multiline ? { rows } : {})}
          />
        </div>
      </div>
    </div>
  );
}
