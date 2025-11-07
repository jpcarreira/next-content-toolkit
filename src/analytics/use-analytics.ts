'use client';

/**
 * Hook for tracking analytics events with Simple Analytics
 * @returns track function
 */
export const useAnalytics = () => {
  const track = (event: string, data?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.sa_event) {
      window.sa_event(event, data);
    }
  };

  return { track };
};
