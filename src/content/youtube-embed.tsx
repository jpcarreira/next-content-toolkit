'use client';

import { useEffect, useRef, useState } from 'react';
import type { YouTubeEmbedProps } from './types';

/**
 * Embed YouTube videos with lazy loading
 */
export function YouTubeEmbed({
  videoId,
  title = 'YouTube video',
  startTime,
  aspectRatio = '16:9',
}: YouTubeEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Build YouTube URL with parameters
  const buildYouTubeUrl = (): string => {
    const baseUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      ...(startTime && { start: startTime.toString() }),
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const paddingClass = aspectRatio === '16:9' ? 'pb-[56.25%]' : 'pb-[75%]';

  return (
    <div className="my-8" ref={containerRef}>
      <div className="max-w-4xl mx-auto">
        <div
          className={`relative ${paddingClass} bg-slate-800/30 border border-[#00E0FF]/20 rounded-xl overflow-hidden`}
        >
          {!isVisible ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-slate-700 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm">{title}</p>
              </div>
            </div>
          ) : (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={buildYouTubeUrl()}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              style={{ border: 0 }}
            />
          )}
        </div>

        {title && title !== 'YouTube video' && (
          <p className="text-sm text-slate-400 text-center mt-3">{title}</p>
        )}
      </div>
    </div>
  );
}
