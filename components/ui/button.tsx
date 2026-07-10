import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-green bg-green text-white hover:-translate-y-0.5 hover:bg-[#0f2a24]",
        outline: "border border-green bg-transparent text-green hover:-translate-y-0.5 hover:bg-green hover:text-white",
        ghost: "text-ink hover:bg-soft"
      },
      size: {
        default: "min-h-12 px-6",
        sm: "min-h-10 px-4",
        lg: "min-h-14 px-8"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
