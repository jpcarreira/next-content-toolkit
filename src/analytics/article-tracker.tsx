'use client';

import { useEffect } from 'react';
import { useAnalytics } from './use-analytics';

export interface ArticleTrackerProps {
  slug: string;
  title: string;
  published: boolean;
}

/**
 * Track article views with metadata
 * @param slug - Article slug
 * @param title - Article title
 * @param published - Whether article is published
 */
export default function ArticleTracker({
  slug,
  title,
  published,
}: ArticleTrackerProps) {
  const { track } = useAnalytics();

  useEffect(() => {
    track('page_view', {
      article: slug,
      title: title,
      published: published,
    });
  }, [slug, title, published, track]);

  return null;
}
