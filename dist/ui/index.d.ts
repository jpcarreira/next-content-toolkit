import * as react_jsx_runtime from 'react/jsx-runtime';
import { ThemeProviderProps } from './types';
import * as react from 'react';
import { ReactNode } from 'react';

/**
 * Theme provider component wrapper for next-themes
 * Note: Requires 'next-themes' package to be installed in your project
 *
 * Usage:
 * import { ThemeProvider } from 'next-themes';
 *
 * This is a simple re-export placeholder.
 * In your app, use next-themes directly or customize this component.
 */
declare function ThemeProvider({ children }: ThemeProviderProps): react_jsx_runtime.JSX.Element;

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
declare function FadeIn({ children, delay, direction, duration, className, }: FadeInProps): react_jsx_runtime.JSX.Element;

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
declare function useInView(options?: UseInViewOptions): {
    ref: react.RefObject<HTMLDivElement | null>;
    isInView: boolean;
};

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
declare function FloatingStars({ count, className }: FloatingStarsProps): react_jsx_runtime.JSX.Element;

interface FlipNumberProps {
  value: number;
  className?: string;
}

declare function FlipNumber({ value, className }: FlipNumberProps): JSX.Element;

interface ConstellationBackgroundProps {
  count?: number;
  className?: string;
}

declare function ConstellationBackground({ count, className }: ConstellationBackgroundProps): JSX.Element;

export { ConstellationBackground, FadeIn, FlipNumber, FloatingStars, ThemeProvider, ThemeProviderProps, useInView };
