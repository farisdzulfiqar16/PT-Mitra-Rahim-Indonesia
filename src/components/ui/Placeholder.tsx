import { cn } from "@/lib/utils";
import { Image, MapPin, Map, Video, ClipboardList } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type PlaceholderType = "image" | "map" | "site-plan" | "video" | "general";

export interface PlaceholderProps {
  type?: PlaceholderType;
  label: string;
  description?: string;
  className?: string;
}

const iconComponentMap: Record<PlaceholderType, LucideIcon> = {
  image: Image,
  map: MapPin,
  "site-plan": Map,
  video: Video,
  general: ClipboardList,
};

export function Placeholder({
  type = "general",
  label,
  description,
  className,
}: PlaceholderProps) {
  const Icon = iconComponentMap[type];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        "bg-neutral-50 border border-dashed border-neutral-200 rounded-lg",
        "p-8 text-center",
        className
      )}
      role="img"
      aria-label={label}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 shadow-2xs">
        <Icon className="h-6 w-6 stroke-[1.75]" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-neutral-600">{label}</p>
      {description && (
        <p className="text-xs text-neutral-400 max-w-xs">{description}</p>
      )}
    </div>
  );
}
