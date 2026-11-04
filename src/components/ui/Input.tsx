import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className, id, ...props }: InputProps) {
  const inputId = id || props.name;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-neutral-800">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "rounded-md border border-neutral-200 px-4 py-3 text-base text-neutral-900",
          "placeholder:text-neutral-400",
          "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300",
          "min-h-[44px]",
          className,
        )}
        {...props}
      />
    </div>
  );
}
