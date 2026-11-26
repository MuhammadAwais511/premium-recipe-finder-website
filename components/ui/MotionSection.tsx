"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function MotionSection({ children, className, delay = 0 }: MotionSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}
