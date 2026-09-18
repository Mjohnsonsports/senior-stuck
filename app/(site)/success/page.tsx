'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import emailjs from '@emailjs/browser';
import MainNav from '@/components/MainNav';

const docBaseUrl = process.env.NEXT_PUBLIC_DOC_URL || '';
const demoBaseUrl = process.env.NEXT_PUBLIC_DEMO_URL || '';

const EMAILJS_SERVICE_ID = process.env.NEXT_PRIVATE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PRIVATE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PRIVATE_EMAILJS_PRIVATE_KEY;

/**
 * Strips whitespace and invisible Unicode characters from an email string.
 * These are the usual culprits behind EmailJS's "recipients address is corrupted" error.
 */
function sanitizeEmail(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw
    // Zero-width + BOM + non-breaking space + soft hyphen
    .replace(/[\u200B-\u200D\uFEFF\u00A0\u00AD]/g, '')
    // Any other non-printable control chars (except normal space)
    .replace(/[\u0000-\u001F\u007F]/g, '')
    // Trim ends
    .trim();
}

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
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const emailAttempted = useRef(false);

  useEffect(() => {
    const fetchCheckoutEmail = async () => {
      if (!sessionId) {
        setIsLoadingEmail(false);
        return;
      }

      try {
        const syncKey = `sheet-sync:${sessionId}`;
        const shouldSyncSheet =
          typeof window !== 'undefined' &&
          !window.localStorage.getItem(syncKey);

        const response = await fetch(
          `/api/checkout-email?session_id=${encodeURIComponent(
            sessionId
          )}&sync_sheet=${shouldSyncSheet ? '1' : '0'}`
        );
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          console.error('[success] failed to load checkout email', payload);
          return;
        }

        // 🔎 Debug: raw server values
        console.log(
          '[success] raw payload.email:',
          JSON.stringify(payload.email)
        );
        console.log(
          '[success] raw payload.name:',
          JSON.stringify(payload.name)
        );

        const cleanEmail = sanitizeEmail(payload.email);
        const cleanName = sanitizeEmail(payload.name) || 'Customer';

        // 🔎 Debug: cleaned values
        console.log('[success] clean email:', JSON.stringify(cleanEmail));
        console.log('[success] clean name:', JSON.stringify(cleanName));

        setName(cleanName);
        setEmail(cleanEmail || null);

        // Basic shape check so we fail fast with a clear message
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);
        if (cleanEmail && !emailOk) {
          const msg = `Invalid email format from checkout: ${JSON.stringify(
            cleanEmail
          )}`;
          console.error('[success]', msg);
          setEmailError(msg);
          emailAttempted.current = true;
          return;
        }

        // Send email via EmailJS (only once per session)
        if (cleanEmail && !emailAttempted.current) {
          emailAttempted.current = true;

          if (
            !EMAILJS_SERVICE_ID ||
            !EMAILJS_TEMPLATE_ID ||
            !EMAILJS_PUBLIC_KEY
          ) {
            const msg =
              'EmailJS env vars missing. Check NEXT_PRIVATE_EMAILJS_* in .env.local';
            console.error('[success]', msg);
            setEmailError(msg);
            emailAttempted.current = false;
            return;
          }

          const pdfUrl = "https://www.seniorsstuck.com/SeniorsStuckFREEGUIDE.pdf%20(2)%20(1).pdf";

          const orderId = sessionId.slice(-8).toUpperCase();

          const params = {
            to_name: cleanName,
            to_email: cleanEmail,
            reply_to: cleanEmail,
            pdf_link: pdfUrl,
            order_id: orderId,
          };

          console.log(
            '[success] sending email via EmailJS with params:',
            JSON.stringify(params)
          );

          emailjs
            .send(
              EMAILJS_SERVICE_ID,
              EMAILJS_TEMPLATE_ID,
              params,
              EMAILJS_PUBLIC_KEY
            )
            .then((res) => {
              console.log('[success] EmailJS OK', res.status, res.text);
              setEmailSent(true);
              setEmailError(null);
            })
            .catch((err) => {
              console.error('[success] EmailJS FAILED', err);
              const msg =
                typeof err === 'string'
                  ? err
                  : err?.text ||
                  err?.message ||
                  JSON.stringify(err) ||
                  'Failed to send email';
              setEmailError(msg);
              emailAttempted.current = false; // allow retry
            });
        }

        if (shouldSyncSheet && payload.synced) {
          window.localStorage.setItem(syncKey, '1');
        }

        if (payload.syncError) {
          console.error(
            '[success] failed to sync Google Sheet',
            payload.syncError
          );
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


  return (
    <div className="min-h-screen bg-white">
      <header className="relative z-50">
        <MainNav />
      </header>
      <div className="flex items-center justify-center p-4">
        <div className="bg-white border-2 border-black/20 rounded-2xl p-8 sm:p-12 shadow-2xl max-w-2xl w-full text-center">
          <div className="mb-6">
            <svg
              className="w-20 h-20 text-green-400 mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
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
              No login required. You will receive the PDF by email.
            </p>

            {email && (
              <p className="text-black font-bold text-sm">
                Checkout details: {name ? `${name} | ` : ''}
                {email}
              </p>
            )}

            {isLoadingEmail && (
              <p className="text-black font-bold text-sm">
                Loading your access links...
              </p>
            )}

            {emailSent && (
              <p className="text-green-700 font-bold text-sm">
                ✅ Your PDF has been sent to {email}. Please check your inbox
                (and spam folder).
              </p>
            )}

            {emailError && (
              <p className="text-red-600 font-bold text-sm">
                ⚠️ Could not send email: {emailError}
              </p>
            )}



            <div>
              <Link
                href="/"
                className="font-bold text-lg text-amber-900 underline-offset-2 hover:text-amber-950 hover:underline"
              >
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
    <Suspense
      fallback={
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
      }
    >
      <SuccessContent />
    </Suspense>
  );
}