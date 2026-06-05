'use client';

import PricingSection from '@/components/PricingSection';
import MainNav from '@/components/MainNav';

export default function ProductPage() {
  const handleCheckout = async (_priceId: string) => {
    void _priceId;
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="relative z-50">
        <MainNav />
      </header>

      <main className="py-6 sm:py-10">
        <PricingSection onCheckout={handleCheckout} checkoutLoading={null} />
      </main>

      <footer className="border-t border-black/20 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-black font-bold text-lg">
            © {new Date().getFullYear()} SeniorsStuck.com. All rights reserved.
          </p>
          <p className="text-black font-bold text-lg mt-4">
            <a
              href="mailto:mjohnsonsports@aol.com"
              className="font-bold text-amber-900 underline-offset-2 transition-colors hover:text-amber-950 hover:underline"
            >
              mjohnsonsports@aol.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
