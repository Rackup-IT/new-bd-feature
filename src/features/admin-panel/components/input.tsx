// components/ui/Input.tsx
import React from "react";
import { cn } from "../../../utils/utils";

interface Props
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  useTextArea?: boolean;
}

export function Input({ label, error, useTextArea = false, ...rest }: Props) {
  return (
    <div className="flex flex-col">
      <label className="font-medium">{label}</label>
      {!useTextArea ? (
        <input
          aria-invalid={!!error}
          className={cn("border px-2 py-1 rounded")}
          {...rest}
        />
      ) : (
        <textarea
          placeholder={label}
          aria-invalid={!!error}
          {...rest}
          rows={8}
          className="border px-2 py-1 rounded"
        />
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
