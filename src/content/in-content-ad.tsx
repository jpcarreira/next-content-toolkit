import { ReactNode } from 'react';

/**
 * In-content ad component for MDX articles
 * Renders children (typically an AdUnit component from the consuming project)
 * Wrapped in a styled container with spacing
 */
export interface InContentAdProps {
  children?: ReactNode;
}

export function InContentAd({ children }: InContentAdProps) {
  if (!children) {
    return null;
  }

  return (
    <div className="my-8 flex justify-center">
      {children}
    </div>
  );
}
