import type { SuccessMessageProps } from './types';

/**
 * Success message component for forms
 */
export function SuccessMessage({
  title,
  description,
  icon
}: SuccessMessageProps) {
  return (
    <div className="text-center py-8">
      {icon ? (
        <div className="mx-auto mb-4">{icon}</div>
      ) : (
        <svg
          className="h-16 w-16 text-[#00E0FF] mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </div>
  );
}
