import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, DOMAttributes, ReactNode } from "react";
import { sizeClasses } from "../Button.astro";

interface Props extends DOMAttributes<HTMLButtonElement> {
  id?: string;
  size?: "sm" | "md" | "lg" | "custom";
  type: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className: string;
  children: ReactNode | undefined;
}

export function Button({
  id,
  size = "md",
  children,
  className,
  ...props
}: Props) {
  return (
    <button
      id={id}
      className={cn(
        sizeClasses[size],
        "bg-accent/70 backdrop-blur-xs backdrop-brightness-80 text-text border border-border hover:custom-ring rounded cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
