import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragStart" | "onDragEnd"
>;

interface ActionButtonProps extends NativeButtonProps {
  children: ReactNode;
  icon?: LucideIcon;
  variant?: Variant;
  size?: Size;
  /** Renders the button in its "on" state (used by toggles). */
  active?: boolean;
  /** Extra classes for the icon, e.g. a spin while running. */
  iconClassName?: string;
}

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-vibe-violet text-[#0d0725] hover:bg-vibe-violet-bright border border-vibe-violet/60",
  accent:
    "bg-vibe-coral text-[#2a1206] hover:bg-vibe-coral-bright border border-vibe-coral/60",
  outline:
    "border border-line bg-navy-900/60 text-chalk hover:border-vibe-violet/55 hover:bg-navy-850",
  ghost: "border border-transparent text-mist hover:text-chalk hover:bg-white/6",
};

const SIZE: Record<Size, string> = {
  sm: "gap-2 rounded-lg px-3.5 py-2 text-[0.85rem]",
  md: "gap-2.5 rounded-xl px-5 py-3 text-[clamp(0.9rem,1.05vw,1.05rem)]",
  lg: "gap-3 rounded-xl px-7 py-4 text-[clamp(1rem,1.2vw,1.2rem)]",
};

const ICON_SIZE: Record<Size, string> = {
  sm: "h-4 w-4",
  md: "h-[1.15em] w-[1.15em]",
  lg: "h-[1.2em] w-[1.2em]",
};

/**
 * The single button primitive used across the deck.
 * Targets stay large enough for touch and for a presenter clicking quickly.
 */
export function ActionButton({
  children,
  icon: Icon,
  variant = "outline",
  size = "md",
  active = false,
  iconClassName,
  className,
  type = "button",
  ...rest
}: ActionButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type={type}
      whileHover={reduceMotion || rest.disabled ? undefined : { y: -2 }}
      whileTap={reduceMotion || rest.disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center font-medium transition-colors duration-200 select-none",
        "disabled:cursor-not-allowed disabled:opacity-45",
        VARIANT[variant],
        SIZE[size],
        active && "border-vibe-coral/60 bg-vibe-coral/12 text-vibe-coral",
        className,
      )}
      {...rest}
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          className={cn(ICON_SIZE[size], iconClassName)}
        />
      ) : null}
      {children}
    </motion.button>
  );
}
