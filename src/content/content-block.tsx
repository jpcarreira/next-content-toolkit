import { ReactNode } from 'react';

export interface ContentBlockProps {
  title: string;
  children: ReactNode;
}

/**
 * Content block component for MDX articles
 * Highlights important sections with a title
 */
export function ContentBlock({ title, children }: ContentBlockProps) {
  return (
    <div className="my-8 p-6 bg-slate-800/30 border border-slate-700 rounded-xl">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="text-slate-300">{children}</div>
    </div>
  );
}
