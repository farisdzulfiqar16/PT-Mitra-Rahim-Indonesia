import { cn } from "@/lib/utils";

type BadgeVariant =
  | "available"
  | "process"
  | "sold"
  | "unknown"
  | "coming-soon";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  available: "bg-status-available-bg text-status-available",
  process: "bg-status-process-bg text-status-process",
  sold: "bg-status-sold-bg text-status-sold",
  unknown: "bg-status-unknown-bg text-status-unknown",
  "coming-soon": "bg-accent-warm text-accent-warm-text",
};

const sizeClasses = "inline-flex items-center px-3 py-1 text-xs font-medium rounded-full";

export function Badge({ variant, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(sizeClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
