'use client';

import { useEffect, useState } from 'react';

interface FlipNumberProps {
  value: number;
  className?: string;
}

/**
 * Animated flip number component for countdown timers
 *
 * Creates a flip animation when the value changes, similar to
 * classic split-flap displays.
 *
 * @param value - The number to display (will be zero-padded to 2 digits)
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <FlipNumber value={seconds} />
 * ```
 *
 * **Required CSS:** Add this to your global CSS:
 * ```css
 * @keyframes flipDown {
 *   0% { transform: rotateX(0deg); }
 *   50% { transform: rotateX(-90deg); }
 *   100% { transform: rotateX(0deg); }
 * }
 *
 * .flip-number {
 *   perspective: 200px;
 *   display: inline-block;
 * }
 *
 * .flip-number.flipping {
 *   animation: flipDown 0.6s ease-in-out;
 * }
 * ```
 */
export function FlipNumber({ value, className = '' }: FlipNumberProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (value !== displayValue) {
      setIsFlipping(true);

      // Update the display value halfway through the animation
      setTimeout(() => {
        setDisplayValue(value);
      }, 300);

      // Remove flipping class after animation completes
      setTimeout(() => {
        setIsFlipping(false);
      }, 600);
    }
  }, [value, displayValue]);

  return (
    <span className={`flip-number ${isFlipping ? 'flipping' : ''} ${className}`}>
      {displayValue.toString().padStart(2, '0')}
    </span>
  );
}
