import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: "div" | "article" | "section";
  href?: string;
  interactive?: boolean;
}

export function Card({
  as: Component = "div",
  href,
  interactive = false,
  className,
  children,
  ...props
}: CardProps) {
  const classes = cn(
    "bg-white border border-neutral-200/80 rounded-xl shadow-xs overflow-hidden",
    "shadow-[0_1px_3px_0_rgba(28,41,34,0.04),0_1px_2px_-1px_rgba(28,41,34,0.02),inset_0_1px_0_0_rgba(255,255,255,0.9)]",
    interactive && "cursor-pointer transition-all duration-300 ease-out hover:shadow-md hover:border-primary-300/80 hover:-translate-y-0.5",
    className,
  );

  if (href) {
    return (
      <a href={href} className={cn(classes, "block")} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
