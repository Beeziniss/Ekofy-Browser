import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  // Additional props to disable browser's built-in password reveal
  const inputProps = type === "password" 
    ? { ...props, autoComplete: props.autoComplete || "new-password" }
    : props;

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/90 focus-visible:ring-2",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        // Hide browser's built-in password reveal icons for all browsers
        "[&::-ms-reveal]:hidden [&::-ms-clear]:hidden",
        "[&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden",
        className,
      )}
      style={{
        // Additional CSS to ensure password reveal buttons are hidden
        ...(type === "password" && {
          WebkitAppearance: "none",
          MozAppearance: "textfield",
        }),
        ...((props as any).style || {}),
      }}
      {...inputProps}
    />
  );
}

export { Input };
