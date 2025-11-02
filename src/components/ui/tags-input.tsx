"use client";

import type { ComponentProps, Dispatch, SetStateAction } from "react";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const InputTags = ({
  className,
  onChange,
  value: tags,
  "aria-invalid": ariaInvalid,
  id,
  ...props
}: Omit<ComponentProps<"input">, "onChange" | "value"> & {
  onChange: Dispatch<SetStateAction<string[]>>;
  value: string[];
}) => (
  <label
    className={cn(
      "has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-ring/50 dark:bg-input/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex min-h-10 w-full cursor-text flex-wrap items-center gap-1 rounded-md border border-white/30 p-1 text-sm transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 has-[input:focus-visible]:ring-[3px]",
      className,
    )}
    aria-invalid={ariaInvalid}
    id={id}
  >
    {tags.map((t) => (
      <span
        key={t}
        className="focus:ring-ring text-main-white inline-flex items-center gap-1.5 rounded-md border bg-zinc-600/10 px-2 py-1 text-sm font-medium transition-colors hover:bg-zinc-600/20 focus:ring-2 focus:ring-offset-1 focus:outline-none"
        tabIndex={0}
        role="button"
        aria-label={`Remove tag ${t}`}
        onKeyDown={(e) => {
          if (e.key === "Delete" || e.key === "Backspace") {
            e.preventDefault();
            onChange(tags.filter((i) => i !== t));
          }
        }}
      >
        <span>{t}</span>
        <X
          className="text-muted-foreground hover:text-destructive size-3 cursor-pointer transition-colors"
          onClick={() => onChange(tags.filter((i) => i !== t))}
          data-slot="icon"
        />
      </span>
    ))}
    <input
      className={cn(
        "placeholder:text-muted-foreground ml-1 h-8 min-w-0 flex-1 appearance-none border-0 bg-transparent px-2 py-1 text-sm font-semibold ring-0 transition-all duration-200 ease-out outline-none placeholder:capitalize focus:outline-none",
        tags.length ? "w-0 placeholder:opacity-0" : "",
      )}
      type="text"
      onKeyDown={(e) => {
        const { value } = e.currentTarget,
          values = value
            .split(/[,;]+/u)
            .map((v) => v.trim())
            .filter(Boolean);
        if (values.length) {
          if ([",", ";", "Enter"].includes(e.key)) {
            e.preventDefault();
            onChange([...new Set([...tags, ...values])]);
            e.currentTarget.value = "";
          }
        } else if (e.key === "Backspace" && tags.length) {
          e.preventDefault();
          onChange(tags.slice(0, -1));
        }
      }}
      {...props}
    />
  </label>
);

export default InputTags;
