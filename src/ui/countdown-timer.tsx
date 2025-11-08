'use client';

import * as React from 'react';
import type { CountdownTimerProps, TimeRemaining } from './types';

/**
 * Countdown timer component with milestone reached state
 */
export function CountdownTimer({
  targetDate,
  title,
  description,
  icon,
  className = '',
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = React.useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [hasReached, setHasReached] = React.useState(false);

  const calculateTimeRemaining = (target: Date): TimeRemaining => {
    const now = new Date().getTime();
    const targetTime = target.getTime();
    const difference = targetTime - now;

    if (difference <= 0) {
      setHasReached(true);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const calculateDaysAgo = (): number => {
    const now = new Date().getTime();
    const targetTime = targetDate.getTime();
    const difference = now - targetTime;
    return Math.floor(difference / (1000 * 60 * 60 * 24));
  };

  React.useEffect(() => {
    const updateCountdown = () => {
      setTimeRemaining(calculateTimeRemaining(targetDate));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Milestone reached state
  if (hasReached) {
    const daysAgo = calculateDaysAgo();
    return (
      <div
        className={`bg-slate-800/50 border-[#FFCD00]/30 backdrop-blur-sm rounded-2xl border ${className}`}
      >
        <div className="text-center pb-4 pt-6 px-6">
          <h3 className="text-2xl text-white flex items-center justify-center gap-2 font-bold">
            <span className="text-3xl text-[#FFCD00]">✓</span>
            {title}
          </h3>
          {description && (
            <p className="text-slate-300 mt-2">{description}</p>
          )}
        </div>
        <div className="text-center px-6 pb-6">
          <div className="bg-[#0B1B3B]/50 border border-[#00E0FF]/30 rounded-xl p-6 mb-4">
            <div className="text-lg font-semibold text-[#FFCD00] mb-2">
              Milestone Reached
            </div>
            <div className="text-3xl font-bold text-white mb-2">
              {formatDate(targetDate)}
            </div>
            <div className="text-slate-300">
              {daysAgo === 0
                ? 'Today'
                : `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Countdown state
  return (
    <div
      className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm rounded-2xl border ${className}`}
    >
      <div className="text-center pb-4 pt-6 px-6">
        <h3 className="text-2xl text-white flex items-center justify-center gap-2 font-bold">
          {icon}
          {title}
        </h3>
        {description && (
          <p className="text-slate-300 mt-2">{description}</p>
        )}
      </div>
      <div className="text-center px-6 pb-6">
        <div className="text-4xl font-bold text-[#00E0FF] mb-2">
          {formatDate(targetDate)}
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-slate-700/50 rounded-xl p-3">
            <div className="text-2xl font-bold text-white">
              {formatNumber(timeRemaining.days)}
            </div>
            <div className="text-xs text-slate-400">DAYS</div>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-3">
            <div className="text-2xl font-bold text-white">
              {formatNumber(timeRemaining.hours)}
            </div>
            <div className="text-xs text-slate-400">HOURS</div>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-3">
            <div className="text-2xl font-bold text-white">
              {formatNumber(timeRemaining.minutes)}
            </div>
            <div className="text-xs text-slate-400">MINS</div>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-3">
            <div className="text-2xl font-bold text-white">
              {formatNumber(timeRemaining.seconds)}
            </div>
            <div className="text-xs text-slate-400">SECS</div>
          </div>
        </div>
      </div>
    </div>
  );
}
