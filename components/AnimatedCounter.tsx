"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  className?: string;
  durationMs?: number;
  suffix?: string;
  value: number;
};

const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3;

export const AnimatedCounter = ({
  className,
  durationMs = 1400,
  suffix = "",
  value,
}: AnimatedCounterProps) => {
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const element = elementRef.current;

    if (!element || hasStarted) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry?.isIntersecting) {
          return;
        }

        setHasStarted(true);
        observer.disconnect();
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionFrameId = window.requestAnimationFrame(() => {
        setDisplayValue(value);
      });

      return () => {
        window.cancelAnimationFrame(reducedMotionFrameId);
      };
    }

    let animationFrameId = 0;
    const startTime = window.performance.now();

    const updateValue = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / durationMs, 1);
      const easedProgress = easeOutCubic(progress);

      setDisplayValue(Math.round(value * easedProgress));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(updateValue);
      }
    };

    animationFrameId = window.requestAnimationFrame(updateValue);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [durationMs, hasStarted, value]);

  return (
    <span ref={elementRef} className={className}>
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
};
