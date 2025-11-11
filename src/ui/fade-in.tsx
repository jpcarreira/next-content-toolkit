'use client';

import { useInView } from './use-in-view';
import { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  className?: string;
}

/**
 * Component that fades in content when it enters the viewport
 *
 * Uses Intersection Observer to detect when element is visible and applies
 * fade + slide animation. Respects prefers-reduced-motion accessibility setting.
 *
 * @param children - Content to animate
 * @param delay - Animation delay in milliseconds (default: 0)
 * @param direction - Direction to slide from (default: 'up')
 * @param duration - Animation duration in milliseconds (default: 700)
 * @param className - Additional CSS classes to apply
 *
 * @example
 * ```tsx
 * // Basic usage
 * <FadeIn>
 *   <h1>This fades in on scroll</h1>
 * </FadeIn>
 *
 * // With staggered delay
 * <FadeIn delay={200}>
 *   <p>Appears 200ms after entering viewport</p>
 * </FadeIn>
 *
 * // Different direction
 * <FadeIn direction="left" duration={1000}>
 *   <div>Slides in from left over 1 second</div>
 * </FadeIn>
 *
 * // Multiple items with stagger
 * {items.map((item, index) => (
 *   <FadeIn key={item.id} delay={index * 100}>
 *     <ArticleCard {...item} />
 *   </FadeIn>
 * ))}
 * ```
 */
export function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  duration = 700,
  className = '',
}: FadeInProps) {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true });

  const directionClasses = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8',
    none: '',
  };

  const initialTransform = directionClasses[direction];

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${
        isInView
          ? 'opacity-100 translate-y-0 translate-x-0'
          : `opacity-0 ${initialTransform}`
      } ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
