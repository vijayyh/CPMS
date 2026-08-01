"use client";

import { useEffect, useState } from "react";

export function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 2000; // 2 seconds

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      const percentage = Math.min(progress / duration, 1);
      // easeOutQuart curve
      const easeProgress = 1 - Math.pow(1 - percentage, 4);
      
      setCount(Math.floor(easeProgress * value));

      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
