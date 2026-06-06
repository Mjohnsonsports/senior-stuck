'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MainNav from '@/components/MainNav';

const docBaseUrl = process.env.NEXT_PUBLIC_DOC_URL || '';
const demoBaseUrl = process.env.NEXT_PUBLIC_DEMO_URL || '';

function appendEmailToUrl(baseUrl: string, email: string | null) {
  if (!baseUrl) return null;

  try {
    const url = new URL(baseUrl);
    if (email) {
      url.searchParams.set('email', email);
    }
    return url.toString();
  } catch {
    return baseUrl;
  }
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isLoadingEmail, setIsLoadingEmail] = useState(Boolean(sessionId));

  useEffect(() => {
    const fetchCheckoutEmail = async () => {
      if (!sessionId) {
        setIsLoadingEmail(false);
        return;
      }

      try {
        const syncKey = `sheet-sync:${sessionId}`;
        const shouldSyncSheet =
          typeof window !== 'undefined' && !window.localStorage.getItem(syncKey);
        const response = await fetch(
          `/api/checkout-email?session_id=${encodeURIComponent(sessionId)}&sync_sheet=${shouldSyncSheet ? '1' : '0'}`
        );
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          console.error('[success] failed to load checkout email', payload);
          return;
        }

        setName(payload.name || null);
        setEmail(payload.email || null);

        if (shouldSyncSheet && payload.synced) {
          window.localStorage.setItem(syncKey, '1');
        }

        if (payload.syncError) {
          console.error('[success] failed to sync Google Sheet', payload.syncError);
        }
      } catch (error) {
        console.error('[success] failed to fetch checkout email', error);
      } finally {
        setIsLoadingEmail(false);
      }
    };

    fetchCheckoutEmail();
  }, [sessionId]);

  const docUrl = useMemo(() => appendEmailToUrl(docBaseUrl, email), [email]);
  const demoUrl = useMemo(() => appendEmailToUrl(demoBaseUrl, email), [email]);

  return (
    <div className="min-h-screen bg-white">
      <header className="relative z-50">
        <MainNav />
      </header>
      <div className="flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black/20 rounded-2xl p-8 sm:p-12 shadow-2xl max-w-2xl w-full text-center">
        <div className="mb-6">
          <svg className="w-20 h-20 text-green-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">
            Payment Successful!
          </h1>
          <p className="text-black font-bold text-2xl mb-2">
            Thank you for your subscription.
          </p>
          <p className="text-black font-bold text-xl mb-4">
            Your subscription is confirmed.
          </p>
          {sessionId && (
            <p className="text-black font-bold text-sm">
              Session ID: {sessionId.substring(0, 20)}...
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          <p className="text-black font-bold text-xl">
            No login required. You will receive the newsletter by email.
          </p>
          {email && (
            <p className="text-black font-bold text-sm">
              Checkout details: {name ? `${name} | ` : ''}{email}
            </p>
          )}
          {isLoadingEmail && (
            <p className="text-black font-bold text-sm">
              Loading your access links...
            </p>
          )}
          {(docUrl || demoUrl) && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {docUrl && (
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-lg bg-purple-700 px-6 py-3 font-bold text-white transition-colors hover:bg-purple-800"
                >
                  Open Doc
                </a>
              )}
              {demoUrl && (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-black/20 px-6 py-3 font-bold text-black transition-colors hover:bg-white/10"
                >
                  Open Demo
                </a>
              )}
            </div>
          )}
          <div>
            <Link href="/" className="font-bold text-lg text-amber-900 underline-offset-2 hover:text-amber-950 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <header className="relative z-50">
          <MainNav />
        </header>
        <div className="flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black/20 rounded-2xl p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent mb-4"></div>
            <p className="text-black font-bold text-xl">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
