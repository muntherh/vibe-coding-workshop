import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface NavigationControlsProps {
  index: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}

const BASE =
  "inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-[0.9rem] font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30 sm:px-5";

/** Previous / Next pair. Large enough to hit quickly while presenting. */
export function NavigationControls({
  index,
  total,
  onPrevious,
  onNext,
  className,
}: NavigationControlsProps) {
  const atStart = index === 0;
  const atEnd = index === total - 1;

  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
      <button
        type="button"
        onClick={onPrevious}
        disabled={atStart}
        aria-label="Previous slide"
        className={cn(
          BASE,
          "border-line bg-navy-900/70 text-mist hover:enabled:border-py-blue/50 hover:enabled:text-chalk",
        )}
      >
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={atEnd}
        aria-label="Next slide"
        className={cn(
          BASE,
          "border-py-blue/45 bg-py-blue/12 text-chalk hover:enabled:border-py-blue hover:enabled:bg-py-blue/22",
        )}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}
