import { cn } from "@/lib/utils";

type PlaceholderType = "image" | "map" | "site-plan" | "video" | "general";

export interface PlaceholderProps {
  type?: PlaceholderType;
  label: string;
  description?: string;
  className?: string;
}

const iconMap: Record<PlaceholderType, string> = {
  image: "🖼️",
  map: "📍",
  "site-plan": "📐",
  video: "🎬",
  general: "📋",
};

export function Placeholder({
  type = "general",
  label,
  description,
  className,
}: PlaceholderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        "bg-neutral-50 border border-dashed border-neutral-200 rounded-lg",
        "p-8 text-center",
        className,
      )}
      role="img"
      aria-label={label}
    >
      <span className="text-3xl" aria-hidden="true">
        {iconMap[type]}
      </span>
      <p className="text-sm font-medium text-neutral-600">{label}</p>
      {description && (
        <p className="text-xs text-neutral-400 max-w-xs">{description}</p>
      )}
    </div>
  );
}
