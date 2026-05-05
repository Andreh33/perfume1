import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.78_0.13_82)] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(0.14_0.015_60)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "btn-primary",
        ghost:
          "btn-ghost",
        outline:
          "border border-[oklch(0.55_0.10_70_/_0.4)] bg-transparent text-[var(--color-ink)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] rounded-full px-7 py-3 font-[var(--font-accent)] uppercase text-[0.8125rem] tracking-[0.18em]",
        link:
          "text-[var(--color-gold)] underline-offset-4 hover:underline hover:text-[var(--color-gold-bright)]",
        danger:
          "bg-[var(--color-danger)] text-white hover:opacity-90 rounded-full px-7 py-3",
        subtle:
          "bg-[oklch(0.22_0.025_50)] text-[var(--color-ink)] hover:bg-[oklch(0.27_0.025_50)] rounded-md px-4 py-2",
      },
      size: {
        sm: "text-xs px-4 py-2",
        md: "",
        lg: "text-sm px-9 py-4",
        icon: "p-2 rounded-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = "button", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...(asChild ? {} : { type })}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
