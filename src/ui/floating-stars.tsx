'use client';

import { useMemo } from 'react';

interface Star {
  id: number;
  left: string;
  top: string;
  delay: number;
  duration: number;
  opacity: number;
  size: number;
}

interface FloatingStarsProps {
  count?: number;
  className?: string;
}

/**
 * Animated floating stars background component
 *
 * Creates a field of slowly moving, twinkling stars that float across the background.
 * Perfect for space-themed or atmospheric hero sections.
 *
 * @param count - Number of stars to generate (default: 20)
 * @param className - Additional CSS classes for the container
 *
 * @example
 * ```tsx
 * // Basic usage in a hero section
 * <section className="relative">
 *   <FloatingStars />
 *   <div className="relative z-10">
 *     <h1>Your Content Here</h1>
 *   </div>
 * </section>
 *
 * // With custom count
 * <FloatingStars count={30} />
 *
 * // With custom styling
 * <FloatingStars className="opacity-50" />
 * ```
 */
export function FloatingStars({ count = 20, className = '' }: FloatingStarsProps) {
  // Generate stars on mount to ensure consistent rendering
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 20,
      opacity: 0.2 + Math.random() * 0.4,
      size: 1 + Math.random() * 2,
    }));
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `floatStar ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
