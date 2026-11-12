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
  available: "bg-primary-100/90 text-primary-800 border border-primary-300/80 shadow-2xs",
  process: "bg-amber-100/90 text-amber-900 border border-amber-300/80 shadow-2xs",
  sold: "bg-rose-100/90 text-rose-900 border border-rose-300/80 shadow-2xs",
  unknown: "bg-neutral-100 text-neutral-700 border border-neutral-300/80 shadow-2xs",
  "coming-soon": "bg-[#F7F2E9] text-[#8C5D23] border border-[#E3D6C0] shadow-2xs",
};

const sizeClasses = "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full tracking-wide";

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
