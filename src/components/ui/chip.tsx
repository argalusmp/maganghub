import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  removable?: boolean;
  active?: boolean;
}

export function Chip({ children, className, removable, active, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-black"
          : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      {removable ? <X className="h-3.5 w-3.5" /> : null}
    </button>
  );
}
