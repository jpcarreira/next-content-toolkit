'use client';

import { useEffect, useState, useMemo } from 'react';

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
  const [mounted, setMounted] = useState(false);

  // Only generate stars after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate stars on mount to ensure consistent rendering
  const stars = useMemo<Star[]>(() => {
    if (!mounted) return [];

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 20,
      opacity: 0.6 + Math.random() * 0.4, // Very bright: 0.6-1.0
      size: 3 + Math.random() * 3, // Much bigger: 3-6px
    }));
  }, [count, mounted]);

  // Don't render anything until mounted
  if (!mounted) {
    return <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} />;
  }

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
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
          }}
        />
      ))}
    </div>
  );
}
