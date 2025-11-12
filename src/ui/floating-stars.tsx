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
  isGalaxy?: boolean;
  rotation?: number;
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

  // Generate stars and galaxies on mount to ensure consistent rendering
  const stars = useMemo<Star[]>(() => {
    if (!mounted) return [];

    const generatedStars = Array.from({ length: count }, (_, i) => {
      // Every 15th element is a galaxy
      const isGalaxy = i % 15 === 0;

      return {
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 20,
        opacity: isGalaxy ? 0.15 + Math.random() * 0.25 : 0.3 + Math.random() * 0.4, // Galaxies dimmer: 0.15-0.4, stars: 0.3-0.7
        size: isGalaxy ? 20 + Math.random() * 30 : 1 + Math.random() * 2, // Galaxies large: 20-50px, stars: 1-3px
        isGalaxy,
        rotation: isGalaxy ? Math.random() * 360 : 0,
      };
    });

    return generatedStars;
  }, [count, mounted]);

  // Don't render anything until mounted
  if (!mounted) {
    return <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} />;
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {stars.map((star) => {
        if (star.isGalaxy) {
          return (
            <div
              key={star.id}
              className="absolute"
              style={{
                left: star.left,
                top: star.top,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animation: `floatStar ${star.duration}s ease-in-out infinite`,
                animationDelay: `${star.delay}s`,
                transform: `rotate(${star.rotation}deg)`,
              }}
            >
              {/* Spiral galaxy effect using radial gradients */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(ellipse at 30% 30%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 25%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)`,
                  filter: 'blur(2px)',
                }}
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(255, 255, 255, 0.2) 40%, transparent 60%)`,
                  transform: 'rotate(45deg)',
                  filter: 'blur(1px)',
                }}
              />
            </div>
          );
        }

        return (
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
              boxShadow: `0 0 ${star.size}px rgba(255, 255, 255, 0.5)`,
            }}
          />
        );
      })}
    </div>
  );
}
