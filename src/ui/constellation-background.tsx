'use client';

import { useEffect, useState } from 'react';

interface Star {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
  delay: number;
}

interface Constellation {
  stars: Star[];
  lines: Array<[number, number]>;
}

interface ConstellationBackgroundProps {
  count?: number;
  className?: string;
}

/**
 * Animated SVG constellation background component
 *
 * Creates random constellations with twinkling stars and connecting lines.
 * Perfect for space-themed sections.
 *
 * @param count - Number of constellations to generate (default: 3)
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <section className="relative overflow-hidden">
 *   <ConstellationBackground count={3} className="opacity-40" />
 *   <div className="relative z-10">Your content</div>
 * </section>
 * ```
 *
 * **Required CSS:** Add this to your global CSS:
 * ```css
 * @keyframes twinkle {
 *   0%, 100% { opacity: 0.3; }
 *   50% { opacity: 0.8; }
 * }
 * ```
 */
export function ConstellationBackground({ count = 3, className = '' }: ConstellationBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  const [constellations, setConstellations] = useState<Constellation[]>([]);

  useEffect(() => {
    setMounted(true);

    // Generate random constellations
    const newConstellations: Constellation[] = Array.from({ length: count }, () => {
      // Each constellation has 4-7 stars
      const starCount = 4 + Math.floor(Math.random() * 4);
      const stars: Star[] = [];

      // Pick a random center point for this constellation
      const centerX = 20 + Math.random() * 60; // Keep away from edges
      const centerY = 20 + Math.random() * 60;

      for (let i = 0; i < starCount; i++) {
        stars.push({
          cx: centerX + (Math.random() - 0.5) * 20, // Cluster around center
          cy: centerY + (Math.random() - 0.5) * 20,
          r: 0.3 + Math.random() * 0.4, // Smaller stars: 0.3-0.7
          opacity: 0.3 + Math.random() * 0.5,
          delay: Math.random() * 3,
        });
      }

      // Connect nearby stars with lines
      const lines: Array<[number, number]> = [];
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[j].cx - stars[i].cx;
          const dy = stars[j].cy - stars[i].cy;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Only connect stars that are close enough
          if (distance < 12) {
            lines.push([i, j]);
          }
        }
      }

      return { stars, lines };
    });

    setConstellations(newConstellations);
  }, [count]);

  if (!mounted) {
    return <div className={`absolute inset-0 pointer-events-none ${className}`} />;
  }

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      {constellations.map((constellation, constellationIndex) => (
        <g key={constellationIndex} opacity="0.6">
          {/* Connection lines */}
          {constellation.lines.map(([i, j], lineIndex) => (
            <line
              key={`line-${lineIndex}`}
              x1={constellation.stars[i].cx}
              y1={constellation.stars[i].cy}
              x2={constellation.stars[j].cx}
              y2={constellation.stars[j].cy}
              stroke="white"
              strokeWidth="0.1"
              opacity="0.2"
            />
          ))}

          {/* Stars with twinkling animation */}
          {constellation.stars.map((star, starIndex) => (
            <circle
              key={`star-${starIndex}`}
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill="white"
              opacity={star.opacity}
              style={{
                animation: `twinkle 3s ease-in-out infinite`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
