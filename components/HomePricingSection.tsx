'use client';

import PricingSection from '@/components/PricingSection';

interface HomePricingSectionProps {
  onCheckout: (priceId: string) => Promise<void>;
  checkoutLoading: string | null;
}

export default function HomePricingSection({
  onCheckout,
  checkoutLoading,
}: HomePricingSectionProps) {
  return (
    <PricingSection
      onCheckout={onCheckout}
      checkoutLoading={checkoutLoading}
      showFeatured
    />
  );
}
