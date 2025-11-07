'use client';

import { useState } from 'react';
import { SuccessMessage } from './success-message';
import type { ContactModalProps } from './types';

/**
 * Contact form modal component
 * Note: This component uses basic HTML elements.
 * For production, replace with your UI library's Dialog/Modal component
 */
export function ContactModal({
  open,
  onOpenChange,
  apiEndpoint = '/api/contact',
  title = 'Contact Us',
  description = "Send us a message and we'll get back to you soon.",
  onSuccess,
  onError,
}: ContactModalProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
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
        body: JSON.stringify({ email, message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setShowSuccess(true);
      onSuccess?.({ email, message });

      setTimeout(() => {
        setEmail('');
        setMessage('');
        setShowSuccess(false);
        onOpenChange(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      const err = error instanceof Error ? error : new Error('Failed to send message');
      onError?.(err);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setShowSuccess(false);
    }
    onOpenChange(newOpen);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={() => handleOpenChange(false)}
    >
      <div
        className="bg-slate-900/95 border border-slate-700 rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {showSuccess ? (
          <SuccessMessage
            title="Message Received!"
            description="Thank you for contacting us. We'll get back to you soon."
          />
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
                <svg
                  className="h-6 w-6 text-[#00E0FF]"
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
                {title}
              </h2>
              <p className="text-slate-300">{description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-slate-200 block text-sm font-medium">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-400 focus:border-[#00E0FF] focus:ring-[#00E0FF]/20 focus:ring-2 outline-none rounded-lg px-4 py-2"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-slate-200 block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Tell us what's on your mind..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="w-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-400 focus:border-[#00E0FF] focus:ring-[#00E0FF]/20 focus:ring-2 outline-none resize-none rounded-lg px-4 py-2"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#00E0FF] hover:bg-[#00E0FF]/90 text-slate-950 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 px-6 py-2 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
