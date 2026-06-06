'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MainNav from '@/components/MainNav';

type ProductConfig = {
  title: string;
  description: string;
  image: string;
  priceLabel: string;
  priceId: string;
};

const PRODUCTS: Record<string, ProductConfig> = {
  'newsletter-monthly': {
    title: 'Monthly Plan - Newsletter',
    description: 'Weekly digital topics and practical online income guidance for seniors.',
    image: '/banner.png',
    priceLabel: '$9/month',
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || '',
  },
  'newsletter-yearly': {
    title: 'Pay Today - Newsletter',
    description: 'One-time yearly subscription with 2 months free (12 for price of 10).',
    image: '/banner.png',
    priceLabel: '$90/year',
    priceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || '',
  },
  'enough-is-enough': {
    title: 'Enough Is Enough',
    description: 'Online implementation breakthroughs for seniors who want results now.',
    image: '/image/enough.png',
    priceLabel: '$9',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ENOUGH_IS_ENOUGH || '',
  },
  'implementation-masters-program': {
    title: 'Implementation Masters Program',
    description: 'Step-by-step framework to implement faster and build momentum online.',
    image: '/image/master.png',
    priceLabel: '$27',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_IMPLEMENTATION_MASTERS || '',
  },
  'freelancer-detector-kit': {
    title: 'Freelancer Detector Kit',
    description: 'Avoid bad hires and protect your money using practical screening steps.',
    image: '/image/freelancer.png',
    priceLabel: '$17',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_FREELANCER_DETECTOR_KIT || '',
  },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const productKey = searchParams.get('product') || '';
  const product = useMemo(() => PRODUCTS[productKey], [productKey]);

  const handleCheckout = async () => {
    if (!product?.priceId) {
      alert('Price ID not configured. Please check your .env.local and restart the dev server.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId: product.priceId }),
      });

      const data = await response.json();
      if (response.ok && data.url) {
        window.location.href = data.url;
        return;
      }

      alert(data.error || 'Failed to create checkout session');
      setIsLoading(false);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to create checkout session');
      setIsLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <header className="relative z-50">
          <MainNav />
        </header>
        <div className="flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white border border-gray-300 rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-black mb-3">Product not found</h1>
          <p className="text-gray-700 mb-6">Please choose a product from the pricing page.</p>
          <Link
            href="/pricing"
            className="inline-block rounded-lg bg-purple-700 px-6 py-3 font-bold text-white transition-colors hover:bg-purple-800"
          >
            Back to pricing
          </Link>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-10 sm:pb-14">
      <header className="relative z-50">
        <MainNav />
      </header>
      <div className="container mx-auto bg-white overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-gray-100">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover min-h-[260px] md:min-h-[520px]"
            />
          </div>

          <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
            <span className="inline-flex w-fit items-center rounded-full bg-yellow-100 text-yellow-800 text-xs sm:text-sm font-semibold px-3 py-1 mb-4">
              Secure Checkout
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold text-black mb-3">{product.title}</h1>
            <p className="text-gray-700 text-base sm:text-lg mb-6 leading-relaxed">{product.description}</p>

            <div className="border border-gray-200 rounded-xl p-4 mb-6 bg-gray-50">
              <p className="text-sm text-gray-600 mb-1">Today&apos;s Price</p>
              <p className="text-2xl sm:text-3xl font-bold text-black">{product.priceLabel}</p>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isLoading || !product.priceId}
              className="w-full rounded-lg bg-purple-700 px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {!product.priceId
                ? 'Price ID Not Configured'
                : isLoading
                ? 'Processing...'
                : 'Buy now'}
            </button>

            <div className="text-center mt-4">
              <Link href="/pricing" className="text-sm text-gray-700 hover:text-black underline">
                Back to pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <header className="relative z-50">
            <MainNav />
          </header>
          <div className="flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-white border border-gray-300 rounded-xl shadow-lg p-8 text-center">
              <h1 className="text-2xl font-bold text-black mb-3">Loading checkout...</h1>
              <p className="text-gray-700">Preparing your product details.</p>
            </div>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
