import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "whatsapp" | "disabled";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary-700 text-white hover:bg-primary-600 focus-visible:ring-primary-300",
  secondary: "bg-primary-50 text-primary-700 border border-primary-300 hover:bg-primary-100 focus-visible:ring-primary-300",
  outline: "bg-transparent text-neutral-800 border border-neutral-200 hover:bg-neutral-50 focus-visible:ring-neutral-400",
  whatsapp: "bg-whatsapp text-whatsapp-text hover:bg-whatsapp-hover focus-visible:ring-whatsapp",
  disabled: "bg-neutral-100 text-neutral-400 cursor-not-allowed",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-md min-h-[44px]",
  md: "px-6 py-3 text-base rounded-md min-h-[44px]",
  lg: "px-8 py-4 text-lg rounded-lg min-h-[44px]",
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
        "inline-flex items-center justify-center font-medium transition-colors",
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
