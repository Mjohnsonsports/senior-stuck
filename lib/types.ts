export type SubscriptionStatus = 'inactive' | 'active' | 'cancelled';
export type PlanType = 'monthly' | 'yearly' | null;

export interface UserDocument {
  email: string;
  subscriptionStatus: SubscriptionStatus;
  plan: PlanType;
  stripeCustomerId: string | null;
  currentPeriodEnd: number | null;
  createdAt: string | null; // ISO timestamp string
}

export interface CheckoutRequest {
  priceId: string;
  // Optional: kept for backwards compatibility with older flows.
  userId?: string; // Supabase user ID
  email?: string;
}

export interface CustomerPortalRequest {
  userId: string; // Supabase user ID
}
