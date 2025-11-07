'use client';

import { useEffect, useRef, useState } from 'react';
import type { XEmbedProps } from './types';

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

/**
 * Embed X (Twitter) posts with lazy loading
 */
export function XEmbed({
  id,
  theme = 'dark',
  conversation = 'none',
  align = 'center',
}: XEmbedProps) {
  const embedContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Extract tweet ID from URL if full URL is provided
  const getTweetId = (input: string): string => {
    if (input.includes('twitter.com') || input.includes('x.com')) {
      const match = input.match(/status\/(\d+)/);
      return match ? match[1] : input;
    }
    return input;
  };

  const tweetId = getTweetId(id);
  const tweetUrl = `https://twitter.com/x/status/${tweetId}`;

  // Lazy load: Only load when component is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px' }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Fetch and render tweet using oEmbed API
  useEffect(() => {
    if (!isVisible) return;

    const fetchTweet = async () => {
      try {
        const params = new URLSearchParams({
          url: tweetUrl,
          theme: theme,
          align: align,
          dnt: 'true',
        });

        if (conversation === 'none') {
          params.append('conversation', 'none');
        }

        const response = await fetch(
          `https://publish.twitter.com/oembed?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error('Tweet not found');
        }

        const data = await response.json();

        if (data.html) {
          setTimeout(() => {
            if (embedContainerRef.current) {
              embedContainerRef.current.innerHTML = data.html;

              if (!window.twttr) {
                const script = document.createElement('script');
                script.src = 'https://platform.twitter.com/widgets.js';
                script.async = true;
                script.onload = () => {
                  if (window.twttr?.widgets && embedContainerRef.current) {
                    window.twttr.widgets.load(embedContainerRef.current);
                  }
                };
                document.body.appendChild(script);
              } else if (window.twttr.widgets && embedContainerRef.current) {
                window.twttr.widgets.load(embedContainerRef.current);
              }

              setIsLoaded(true);
            }
          }, 0);
        } else {
          throw new Error('No HTML returned');
        }
      } catch (error) {
        console.error('Failed to load tweet:', error);
        setHasError(true);
      }
    };

    fetchTweet();
  }, [isVisible, tweetUrl, theme, conversation, align]);

  const alignmentClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[align];

  if (hasError) {
    return (
      <div className={`my-6 flex ${alignmentClass}`}>
        <div className="w-full max-w-[550px] bg-slate-800/30 border border-red-500/30 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="text-red-500 mt-1">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-slate-300 mb-2">
                This post is no longer available or couldn&apos;t be loaded.
              </p>
              <a
                href={tweetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00E0FF] text-sm hover:underline"
              >
                View on X →
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`my-6 flex ${alignmentClass}`} ref={observerRef}>
      {!isLoaded && (
        <div className="w-full max-w-[550px] bg-slate-800/30 border border-slate-700 rounded-2xl p-6 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-slate-700 rounded w-1/3"></div>
              <div className="h-4 bg-slate-700 rounded w-full"></div>
              <div className="h-4 bg-slate-700 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      )}

      <div
        ref={embedContainerRef}
        className={`w-full max-w-[550px] ${!isLoaded ? 'hidden' : ''}`}
      />
    </div>
  );
}
