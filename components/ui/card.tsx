import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "div" | "section";
  interactive?: boolean;
};

export function Card({ as: Component = "article", interactive = false, className, ...props }: CardProps) {
  return (
    <Component
      className={cn(
        "rounded-brand border border-line bg-white p-[var(--space-card)] shadow-brand",
        interactive && "transition duration-300 hover:-translate-y-1 hover:shadow-hover",
        className
      )}
      {...props}
    />
  );
}

export function CardEyebrow({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs font-bold uppercase tracking-[0.18em] text-primary", className)}
      {...props}
    />
  );
}
