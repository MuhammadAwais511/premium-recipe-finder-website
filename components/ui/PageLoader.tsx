"use client";

import { ChefHat, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface PageLoaderProps {
  label: string;
  className?: string;
}

export function PageLoader({ label, className = "" }: PageLoaderProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`grid min-h-[60svh] place-items-center px-4 py-12 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-sm text-center">
        <div className="relative mx-auto grid size-24 place-items-center">
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-2 border-primary/15 border-t-primary"
            animate={shouldReduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          />
          <span className="grid size-16 place-items-center rounded-[1.4rem] bg-primary text-white shadow-lg shadow-primary/20">
            <ChefHat className="size-7" aria-hidden="true" />
          </span>
          <motion.span
            aria-hidden="true"
            className="absolute right-0 top-2 grid size-7 place-items-center rounded-full bg-accent-soft text-accent"
            animate={
              shouldReduceMotion
                ? undefined
                : { scale: [1, 1.12, 1], opacity: [0.72, 1, 0.72] }
            }
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="size-3.5" />
          </motion.span>
        </div>

        <p className="mt-7 inline-flex items-center gap-2 rounded-full bg-surface-muted px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
          Fresh ideas are on the way
        </p>
        <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground">
          Finding something delicious
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">{label}</p>

        <div
          className="mx-auto mt-7 h-1 w-40 overflow-hidden rounded-full bg-surface-muted"
          aria-hidden="true"
        >
          <motion.span
            className="block h-full origin-left rounded-full bg-primary"
            animate={shouldReduceMotion ? undefined : { scaleX: [0.2, 0.85, 0.35] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}
