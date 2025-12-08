export { useAnalytics } from './use-analytics';
export { AnalyticsEvent } from './types';

interface PageTrackerProps {
    page: string;
}

interface ArticleTrackerProps {
    slug: string;
    title: string;
    published: boolean;
}

interface CategoryTrackerProps {
    category: string;
    articleCount?: number;
}

export type { ArticleTrackerProps, CategoryTrackerProps, PageTrackerProps };
