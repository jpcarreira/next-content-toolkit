/**
 * Hook for tracking analytics events with Simple Analytics
 * @returns track function
 */
declare const useAnalytics: () => {
    track: (event: string, data?: Record<string, any>) => void;
};

export { useAnalytics };
