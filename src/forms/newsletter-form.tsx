'use client';

import { useState } from 'react';
import { SuccessMessage } from './success-message';
import type { NewsletterFormProps } from './types';

/**
 * Newsletter subscription form component
 * Requires Button and Input components from your UI library
 */
export function NewsletterForm({
  apiEndpoint = '/api/newsletter',
  title = 'Stay Updated',
  description = 'Get the latest updates directly in your inbox',
  buttonText = 'Subscribe',
  successTitle = 'Successfully Subscribed!',
  successDescription = "Welcome aboard! You'll receive updates in your inbox.",
  className = '',
  onSuccess,
  onError,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          alert('This email is already subscribed to our newsletter.');
        } else {
          throw new Error(data.error || 'Failed to subscribe');
        }
      } else {
        setShowSuccess(true);
        onSuccess?.(email);

        setTimeout(() => {
          setEmail('');
          setShowSuccess(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      const err = error instanceof Error ? error : new Error('Failed to subscribe');
      onError?.(err);
      alert('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className={`py-16 bg-gradient-to-r from-[#0B1B3B]/20 to-slate-800/20 ${className}`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {showSuccess ? (
          <SuccessMessage title={successTitle} description={successDescription} />
        ) : (
          <>
            <svg
              className="h-12 w-12 text-[#00E0FF] mx-auto mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {title}
            </h2>
            <p className="text-xl text-slate-300 mb-8">{description}</p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 rounded-2xl flex-1 disabled:opacity-50 px-4 py-2 border focus:border-[#00E0FF] focus:ring-[#00E0FF] focus:ring-1 outline-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#00E0FF] hover:bg-[#00E0FF]/90 text-slate-950 font-semibold rounded-2xl px-8 py-2 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Subscribing...' : buttonText}
              </button>
            </form>
            <p className="text-sm text-slate-500 mt-4">
              No spam, unsubscribe at any time
            </p>
          </>
        )}
      </div>
    </section>
  );
}
