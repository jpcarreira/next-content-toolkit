import * as react_jsx_runtime from 'react/jsx-runtime';
import { AdUnitProps } from './types';
export { AdConfig, AdFormat, AdSlotName, AdSlots, AdType } from './types';
export { createAdSlots, defaultAdSlots, getAdSlotId } from './ad-slots';

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}
/**
 * AdSense ad unit component with lazy loading and development placeholders
 * @param slot - Ad slot identifier
 * @param adType - Type of ad (leaderboard, rectangle, etc.)
 * @param className - Additional CSS classes
 * @param adClient - AdSense client ID (defaults to env var)
 */
declare function AdUnit({ slot, adType, format, style, className, responsive, adClient, }: AdUnitProps): react_jsx_runtime.JSX.Element | null;

export { AdUnit, AdUnitProps };
