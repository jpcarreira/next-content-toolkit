import { ReactNode } from 'react';

export interface KeyPointsProps {
  children: ReactNode;
}

/**
 * Key points component for MDX articles
 * Highlights important takeaways in a distinct box
 */
export function KeyPoints({ children }: KeyPointsProps) {
  return (
    <div className="my-6 p-5 bg-[#00E0FF]/10 border border-[#00E0FF]/30 rounded-lg">
      <h4 className="text-lg font-semibold text-[#00E0FF] mb-3">Key Points</h4>
      <div className="text-slate-200">{children}</div>
    </div>
  );
}
