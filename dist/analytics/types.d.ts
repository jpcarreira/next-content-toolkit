interface AnalyticsEvent {
    event: string;
    data?: Record<string, any>;
}
declare global {
    interface Window {
        sa_event?: (event: string, data?: Record<string, any>) => void;
    }
}

export type { AnalyticsEvent };
