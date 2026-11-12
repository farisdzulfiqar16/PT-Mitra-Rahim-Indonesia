import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "whatsapp" | "disabled";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-700 text-white shadow-xs hover:bg-primary-600 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] focus-visible:ring-primary-400 border border-primary-800/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]",
  secondary:
    "bg-primary-50/80 text-primary-800 border border-primary-200/90 hover:bg-primary-100/90 hover:border-primary-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] focus-visible:ring-primary-300 shadow-2xs",
  outline:
    "bg-white text-neutral-800 border border-neutral-200/90 shadow-2xs hover:bg-neutral-50 hover:border-neutral-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] focus-visible:ring-neutral-400",
  whatsapp:
    "bg-whatsapp text-whatsapp-text shadow-xs hover:bg-whatsapp-hover hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] focus-visible:ring-whatsapp border border-emerald-600/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)]",
  disabled: "bg-neutral-100 text-neutral-400 border border-neutral-200/60 cursor-not-allowed shadow-none",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-lg min-h-[44px]",
  md: "px-6 py-3 text-base rounded-lg min-h-[44px]",
  lg: "px-8 py-4 text-lg rounded-xl min-h-[48px]",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  disabled,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  const computedVariant = disabled ? "disabled" : variant;

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-all duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        sizeClasses[size],
        variantClasses[computedVariant],
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
