import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({ label, options, placeholder, className, id, ...props }: SelectProps) {
  const selectId = id || props.name;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-neutral-800">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          "rounded-md border border-neutral-200 px-4 py-3 text-base text-neutral-900",
          "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-300",
          "min-h-[44px] bg-white",
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
