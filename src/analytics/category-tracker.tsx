'use client';

import { useEffect } from 'react';
import { useAnalytics } from './use-analytics';

export interface CategoryTrackerProps {
  category: string;
  articleCount?: number;
}

/**
 * Track category page views
 * @param category - Category name
 * @param articleCount - Number of articles in category (optional)
 */
export default function CategoryTracker({
  category,
  articleCount,
}: CategoryTrackerProps) {
  const { track } = useAnalytics();

  useEffect(() => {
    track('page_view', {
      category,
      ...(articleCount !== undefined && { articleCount }),
    });
  }, [category, articleCount, track]);

  return null;
}
