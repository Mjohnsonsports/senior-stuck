'use client';

import Link from 'next/link';

interface PricingSectionProps {
  onCheckout: (priceId: string) => Promise<void>;
  checkoutLoading: string | null;
  showFeatured?: boolean;
}

export default function PricingSection({
  onCheckout: _onCheckout,
  checkoutLoading: _checkoutLoading,
  showFeatured = true,
}: PricingSectionProps) {
  void _onCheckout;
  void _checkoutLoading;
  // Get Stripe Price IDs from environment variables
  const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || '';
  const YEARLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || '';
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 PricingSection - Environment Variables Check:', {
      MONTHLY_PRICE_ID: MONTHLY_PRICE_ID ? `${MONTHLY_PRICE_ID.substring(0, 10)}...` : 'NOT SET',
      YEARLY_PRICE_ID: YEARLY_PRICE_ID ? `${YEARLY_PRICE_ID.substring(0, 10)}...` : 'NOT SET',
    });
  }
  
  // Validate that price IDs are set (only log in development)
  if (!MONTHLY_PRICE_ID && process.env.NODE_ENV === 'development') {
    console.error('❌ NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID is not set in environment variables');
    console.error('💡 Make sure to add NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID to your .env.local file and restart the dev server');
  }
  if (!YEARLY_PRICE_ID && process.env.NODE_ENV === 'development') {
    console.error('❌ NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID is not set in environment variables');
    console.error('💡 Make sure to add NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID to your .env.local file and restart the dev server');
  }

  return (
    <section
      className="container relative z-10 mx-auto max-w-full overflow-x-hidden px-3 py-8 sm:px-6 sm:py-10"
      aria-label="Newsletter and product offers"
    >
      <div className="mx-auto max-w-5xl min-w-0">
        {/* <div className="bg-linear-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 border-2 border-purple-500/30 shadow-2xl mb-8">
          <div className="text-center mb-8">
            <p className="text-gray-700 text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto mb-6">
              Weekly digital topics and tech information for entrepreneurs and especially seniors age 55+ from <span className="text-yellow-400 font-semibold">Dr. Mark Johnson</span> and his <span className="text-yellow-400 font-semibold">30+ years experience</span> online and earning extra income as a senior, PhD, Author.
            </p>
            <p className="text-gray-700 text-base sm:text-lg italic">
              Pro tips and easy solutions and frameworks for success online - get "Unstuck" weekly!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 text-gray-700">
              <svg className="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>4 weekly editions per month</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <svg className="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Expert insights from Dr. Mark Johnson</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <svg className="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Feature stories and testimonials</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <svg className="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>30+ years of proven experience</span>
            </div>
          </div>
        </div> */}

        {/* Payment Options */}
        <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2">
          {/* Monthly Plan - $1 */}
          <div className="bg-linear-to-br from-green-600/20 via-green-700/10 to-green-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-green-500/40 shadow-2xl">
            <div className="text-center">
              <div className="inline-block bg-green-500/20 border border-green-400/50 rounded-full px-3 py-1 mb-4">
                <span className="text-green-700 text-xs font-semibold">📅 MONTHLY</span>
              </div>
              <img
                src="/banner.png"
                alt="Monthly Newsletter"
                className="w-full rounded-lg border border-gray-300 shadow-md mb-4"
              />
              <h3 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                Monthly Plan - Newsletter
              </h3>
              <p className="text-3xl sm:text-4xl font-bold text-black mb-1">
                $9<span className="text-lg">/month</span>
              </p>
              <p className="text-gray-700 text-sm mb-4">Recurring monthly subscription</p>
              <p className="text-gray-600 text-sm mb-6">
                Cancel anytime • Full access
              </p>
              <button
                onClick={() => {
                  window.location.href = '/checkout?product=newsletter-monthly';
                }}
                disabled={!MONTHLY_PRICE_ID}
                className="w-full bg-linear-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900 px-4 py-3.5 text-sm font-bold leading-snug text-white wrap-break-word rounded-lg transition-all duration-300 hover:shadow-xl sm:px-6 sm:py-4 sm:text-base disabled:cursor-not-allowed disabled:opacity-50"
              >
                {!MONTHLY_PRICE_ID
                  ? 'Price ID Not Configured'
                  : 'Click to Learn More About Newsletter - (Monthly Plan)'}
              </button>
            </div>
          </div>

          {/* Yearly Plan - $90 */}
          <div className="bg-linear-to-br from-yellow-400/20 via-yellow-500/10 to-yellow-400/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-yellow-400/40 shadow-2xl">
            <div className="text-center">
              <div className="inline-block bg-yellow-400/20 border border-yellow-400/50 rounded-full px-3 py-1 mb-4">
                <span className="text-yellow-700 text-xs font-semibold">📅 YEARLY</span>
              </div>
              <img
                src="/banner.png"
                alt="Yearly Newsletter"
                className="w-full rounded-lg border border-gray-300 shadow-md mb-4"
              />
              <h3 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                Pay Today - Newsletter
              </h3>
              <p className="text-3xl sm:text-4xl font-bold text-black mb-1">
                $90<span className="text-lg">/year</span>
              </p>
              <p className="text-gray-700 text-sm mb-4">
                Get 2 months FREE (12 for price of 10)
              </p>
              <p className="text-gray-600 text-sm mb-6">
                One-time payment • 12 months access
              </p>
              <button
                onClick={() => {
                  window.location.href = '/checkout?product=newsletter-yearly';
                }}
                disabled={!YEARLY_PRICE_ID}
                className="w-full bg-purple-700 px-4 py-3.5 text-sm font-bold leading-snug text-white wrap-break-word rounded-lg transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] hover:bg-purple-800 hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] sm:px-6 sm:py-4 sm:text-base disabled:cursor-not-allowed disabled:opacity-50"
              >
                {!YEARLY_PRICE_ID
                  ? 'Price ID Not Configured'
                  : 'Click to Learn More - (Yearly Plan)'}
              </button>
            </div>
          </div>

          {/* Monthly Plan - $9/month */}
          {/* <div className="bg-linear-to-br from-purple-600/20 via-purple-700/10 to-purple-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-purple-500/40 shadow-2xl">
            <div className="text-center">
              <div className="inline-block bg-purple-500/20 border border-purple-400/50 rounded-full px-3 py-1 mb-4">
                <span className="text-purple-300 text-xs font-semibold">📅 MONTHLY</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-purple-300 mb-2">
                Monthly Plan
              </h3>
              <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
                $9<span className="text-lg">/month</span>
              </p>
              <p className="text-purple-300 text-sm mb-4">$108 total (12 months)</p>
              <p className="text-purple-200 text-sm mb-6">
                Recurring monthly • Cancel anytime
              </p>
              <button
                onClick={() => {
                  if (!user) {
                    if (onLoginRequired) {
                      onLoginRequired();
                    }
                    return;
                  }
                  if (MONTHLY_PRICE_ID) {
                    onCheckout(MONTHLY_PRICE_ID);
                  } else {
                    alert('Price ID not configured. Please contact support.');
                  }
                }}
                disabled={checkoutLoading !== null || !MONTHLY_PRICE_ID || !user}
                className="w-full bg-linear-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {!user 
                  ? 'Login to Subscribe' 
                  : !MONTHLY_PRICE_ID 
                  ? 'Price ID Not Configured' 
                  : checkoutLoading === MONTHLY_PRICE_ID 
                  ? 'Processing...' 
                  : 'Subscribe $9/month'}
              </button>
            </div>
          </div> */}

          {/* Yearly Plan - $90 */}
          {/* <div className="bg-linear-to-br from-yellow-400/20 via-yellow-500/10 to-yellow-400/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-yellow-400/40 shadow-2xl md:col-span-2">
            <div className="text-center">
              <div className="inline-block bg-green-500/20 border border-green-400/50 rounded-full px-3 py-1 mb-4">
                <span className="text-green-400 text-xs font-semibold">💰 BEST VALUE - Save 15%</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-2">
                Pay Today
              </h3>
              <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
                $90
              </p>
              <p className="text-purple-300 text-sm mb-4">Get 2 months FREE</p>
              <p className="text-purple-200 text-sm mb-6">
                One-time payment • 12 months access
              </p>
              <button
                onClick={() => {
                  if (!user) {
                    if (onLoginRequired) {
                      onLoginRequired();
                    }
                    return;
                  }
                  if (YEARLY_PRICE_ID) {
                    onCheckout(YEARLY_PRICE_ID);
                  } else {
                    alert('Yearly plan not available. Please contact support.');
                  }
                }}
                disabled={checkoutLoading !== null || !YEARLY_PRICE_ID || !user}
                className="w-full bg-linear-to-r from-yellow-400 via-yellow-500 to-yellow-400 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {!user 
                  ? 'Login to Subscribe' 
                  : !YEARLY_PRICE_ID 
                  ? 'Yearly Plan Not Available' 
                  : checkoutLoading === YEARLY_PRICE_ID 
                  ? 'Processing...' 
                  : 'Pay $90 Today'}
              </button>
            </div>
          </div> */}
        </div>

        {showFeatured && (
        <div id="three-pack-bundle" className="mt-12 scroll-mt-28 sm:scroll-mt-32">
          <div className="mb-8 text-center">
            <h3 className="mb-3 text-2xl font-bold text-black sm:text-3xl">
              Featured programs &amp; guides
            </h3>
            <p className="mx-auto max-w-2xl text-base font-semibold text-gray-700 sm:text-lg">
              Pick a topic below for the full page—what you get, how it helps, and a simple path to checkout.
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-linear-to-br from-red-600/20 via-red-700/10 to-red-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 border-2 border-red-500/40 shadow-2xl">
              <div className="text-center">
                <div className="inline-block bg-red-500/20 border border-red-400/50 rounded-full px-3 py-1 mb-4">
                  <span className="text-red-700 text-xs font-semibold">🔥 FEATURED</span>
                </div>
                <img
                  src="/image/enough.png"
                  alt="Enough is Enough"
                  className="w-full h-44 object-cover rounded-lg border border-gray-300 shadow-md mb-4"
                />
                <h4 className="mb-2 wrap-break-word px-0.5 text-lg font-bold text-black sm:text-xl">Enough is Enough - $9</h4>
                <p className="text-sm text-gray-700 mb-6">
                  Purchase and download today.
                </p>
                <Link
                  href="/enough-is-enough"
                  className="inline-block w-full rounded-lg bg-purple-700 px-3 py-3 text-center text-sm font-bold leading-snug text-white wrap-break-word transition-colors hover:bg-purple-800 sm:px-4 sm:text-base"
                >
                  Click for details on Enough is Enough -
                </Link>
              </div>
            </div>

            <div className="bg-linear-to-br from-indigo-600/20 via-indigo-700/10 to-indigo-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 border-2 border-indigo-500/40 shadow-2xl">
              <div className="text-center">
                <div className="inline-block bg-indigo-500/20 border border-indigo-400/50 rounded-full px-3 py-1 mb-4">
                  <span className="text-indigo-700 text-xs font-semibold">⭐ BESTSELLER</span>
                </div>
                <img
                  src="/image/master.png"
                  alt="Implementation Masters Program"
                  className="w-full h-44 object-cover rounded-lg border border-gray-300 shadow-md mb-4"
                />
                <h4 className="mb-2 wrap-break-word px-0.5 text-lg font-bold text-black sm:text-xl">Implementation Master Program - $27</h4>
                <p className="text-sm text-gray-700 mb-6">
                  Purchase and download today.
                </p>
                <Link
                  href="/implementation-masters-program"
                  className="inline-block w-full rounded-lg bg-purple-700 px-3 py-3 text-center text-sm font-bold leading-snug text-white wrap-break-word transition-colors hover:bg-purple-800 sm:px-4 sm:text-base"
                >
                  Click for details on Master Program -
                </Link>
              </div>
            </div>

            <div className="bg-linear-to-br from-sky-600/20 via-sky-700/10 to-sky-600/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 border-2 border-sky-500/40 shadow-2xl">
              <div className="text-center">
                <div className="inline-block bg-sky-500/20 border border-sky-400/50 rounded-full px-3 py-1 mb-4">
                  <span className="text-sky-700 text-xs font-semibold">✅ POPULAR</span>
                </div>
                <img
                  src="/image/freelancer.png"
                  alt="Freelancer Detector Kit"
                  className="w-full h-44 object-cover rounded-lg border border-gray-300 shadow-md mb-4"
                />
                <h4 className="mb-2 wrap-break-word px-0.5 text-lg font-bold text-black sm:text-xl">The Freelancer Detection Kit - $17</h4>
                <p className="text-sm text-gray-700 mb-6">
                  Purchase and download today.
                </p>
                <Link
                  href="/freelancer-detector-kit"
                  className="inline-block w-full rounded-lg bg-purple-700 px-3 py-3 text-center text-sm font-bold leading-snug text-white wrap-break-word transition-colors hover:bg-purple-800 sm:px-4 sm:text-base"
                >
                  Click for details on Detection Kit -
                </Link>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
