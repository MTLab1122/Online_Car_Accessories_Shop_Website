import React, { useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const AnimatedCounter = ({
  to,
  from = 0,
  duration = 1.6,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const [current, setCurrent] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const target = Number(to) || 0;
    const start = Number(from) || 0;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const val = Math.round(start + (target - start) * ease);
      setCurrent(val);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isInView, to, from, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{current.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedCounter;
