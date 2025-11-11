'use client';

import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook to detect when an element is visible in the viewport using Intersection Observer
 *
 * @param options - Configuration options for the Intersection Observer
 * @param options.threshold - Percentage of element visibility (0-1) required to trigger (default: 0.1)
 * @param options.rootMargin - Margin around the viewport for triggering (default: '0px')
 * @param options.triggerOnce - Whether to only trigger once and stop observing (default: true)
 *
 * @returns Object with ref to attach to element and isInView boolean state
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true });
 *
 *   return (
 *     <div ref={ref} className={isInView ? 'visible' : 'hidden'}>
 *       Content appears when scrolled into view
 *     </div>
 *   );
 * }
 * ```
 */
export function useInView(options: UseInViewOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;

        if (inView) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isInView };
}
