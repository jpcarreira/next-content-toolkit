'use client';

import { useEffect, useRef, useState } from 'react';
import type { AdUnitProps } from './types';

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
export function AdUnit({
  slot,
  adType = 'custom',
  format = 'auto',
  style = { display: 'block' },
  className = '',
  responsive = true,
  adClient,
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [adsMode, setAdsMode] = useState<string>('NONE');

  // Fetch ads mode from API route (server-side env var)
  useEffect(() => {
    fetch('/api/ads-config')
      .then((res) => res.json())
      .then((data) => setAdsMode(data.adsMode || 'NONE'))
      .catch((err) => {
        console.error('Failed to fetch ads config:', err);
      });
  }, []);

  // Simple ad loading with proper timing
  useEffect(() => {
    if (adsMode !== 'SHOW_ADS') {
      return;
    }

    const loadAd = () => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error('AdSense error for slot', slot, ':', error);
      }
    };

    if (document.readyState === 'complete') {
      setTimeout(loadAd, 100);
    } else {
      window.addEventListener(
        'load',
        () => {
          setTimeout(loadAd, 100);
        },
        { once: true }
      );
    }
  }, [adsMode, slot]);

  // Return nothing if ads are completely disabled
  if (adsMode === 'NONE') {
    return null;
  }

  const clientId = adClient || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '';

  // Show placeholder when ADS_MODE=SHOW_PLACEHOLDER
  if (adsMode === 'SHOW_PLACEHOLDER') {
    // Handle leaderboard responsively in development
    if (adType === 'leaderboard') {
      return (
        <>
          {/* Desktop Leaderboard Placeholder */}
          <div className={`hidden md:flex justify-center ${className}`}>
            <div
              className="bg-blue-500 border-2 border-blue-300 p-4 text-white text-center font-medium rounded-lg"
              style={{ width: 728, height: 90, minHeight: '80px' }}
            >
              <div className="text-sm">📺 Ad Placeholder</div>
              <div className="text-xs">leaderboard (desktop)</div>
              <div className="text-xs">Slot: {slot}</div>
              <div className="text-xs">728x90</div>
            </div>
          </div>

          {/* Mobile Banner Placeholder */}
          <div className={`flex md:hidden justify-center ${className}`}>
            <div
              className="bg-blue-500 border-2 border-blue-300 p-4 text-white text-center font-medium rounded-lg"
              style={{ width: 320, height: 50, minHeight: '80px' }}
            >
              <div className="text-sm">📺 Ad Placeholder</div>
              <div className="text-xs">mobile-banner</div>
              <div className="text-xs">Slot: {slot}</div>
              <div className="text-xs">320x50</div>
            </div>
          </div>
        </>
      );
    }

    // Other ad types - set responsive max-width
    let devWidth = 300;
    let devHeight = 250;

    if (adType === 'sidebar') {
      devWidth = 300;
      devHeight = 600;
    } else if (adType === 'mobile-banner') {
      devWidth = 320;
      devHeight = 50;
    } else if (adType === 'mobile-large') {
      devWidth = 320;
      devHeight = 100;
    }

    return (
      <div className={`flex justify-center ${className}`}>
        <div
          className="bg-blue-500 border-2 border-blue-300 p-4 text-white text-center font-medium rounded-lg max-w-full"
          style={{
            width: Math.min(devWidth, 300),
            height: devHeight,
            minHeight: '80px',
          }}
        >
          <div className="text-sm">📺 Ad Placeholder</div>
          <div className="text-xs">{adType}</div>
          <div className="text-xs">Slot: {slot}</div>
          <div className="text-xs">
            {Math.min(devWidth, 300)}x{devHeight}
          </div>
          <div className="text-xs mt-1">Set ADS_MODE=SHOW_ADS for real ads</div>
        </div>
      </div>
    );
  }

  // Real AdSense ads (ADS_MODE=SHOW_ADS)
  if (adType === 'leaderboard') {
    return (
      <div
        className={`ad-container ${className}`}
        style={{ display: 'inline-block', width: '100%', minWidth: '320px' }}
      >
        <div className="text-xs text-slate-500 mb-1 text-center">
          Advertisement
        </div>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    );
  }

  // Default rectangle ad with mobile safety
  return (
    <div
      className={`ad-container ${className}`}
      style={{ display: 'inline-block', width: '100%', minWidth: '300px' }}
    >
      <div className="text-xs text-slate-500 mb-1 text-center">
        Advertisement
      </div>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
