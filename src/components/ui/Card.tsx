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
    "bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden",
    interactive && "cursor-pointer transition-shadow hover:shadow-md hover:border-primary-300",
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
