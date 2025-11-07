'use client';

import { useEffect } from 'react';
import { useAnalytics } from './use-analytics';

export interface PageTrackerProps {
  page: string;
}

/**
 * Track page views automatically
 * @param page - Page identifier
 */
export default function PageTracker({ page }: PageTrackerProps) {
  const { track } = useAnalytics();

  useEffect(() => {
    track('page_view', { page });
  }, [page, track]);

  return null;
}
