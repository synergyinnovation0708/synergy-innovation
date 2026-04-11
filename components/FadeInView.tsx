"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type FadeInViewProps = {
  amount?: number;
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  scale?: number;
  y?: number;
};

export const FadeInView = ({
  amount = 0.24,
  children,
  className,
  delay = 0,
  duration = 0.7,
  once = true,
  scale = 0.985,
  y = 28,
}: FadeInViewProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale, y }}
      transition={{
        delay,
        duration,
        ease: [0.22, 1, 0.36, 1],
      }}
      viewport={{ amount, once }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
};
