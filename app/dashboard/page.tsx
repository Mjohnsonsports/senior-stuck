'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { UserDocument } from '@/lib/types';

interface Subscription {
  id: string;
  stripe_subscription_id: string;
  plan: 'monthly' | 'yearly';
  subscription_status: string;
  current_period_end: number | null;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<UserDocument | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    
    if (!supabase) {
      setLoading(false);
      router.push('/');
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.push('/');
        return;
      } 

      setUser(session.user);
      fetchUserDocument(session.user.id);
      fetchSubscriptions(session.user.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session?.user) {
        router.push('/');
        return;
      }

      setUser(session.user);
      fetchUserDocument(session.user.id);
      fetchSubscriptions(session.user.id);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Refresh subscriptions when page becomes visible (user returns from checkout)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        fetchSubscriptions(user.id);
        fetchUserDocument(user.id);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = new URLSearchParams(window.location.search).get('session_id');
    setSessionId(id);
  }, []);

  // If redirected from Stripe success page with session_id, force a server-side reconciliation.
  useEffect(() => {
    const syncCheckoutSession = async () => {
      if (!sessionId || !user) return;

      try {
        const response = await fetch(`/api/check-session?session_id=${sessionId}`);
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          console.error('Failed to sync checkout session:', response.status, payload);
          return;
        }

        await fetchUserDocument(user.id);
        await fetchSubscriptions(user.id);
      } catch (error) {
        console.error('Error syncing checkout session:', error);
      }
    };

    syncCheckoutSession();
  }, [sessionId, user]);

  const fetchUserDocument = async (uid: string) => {
    try {
      const supabase = createClient();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }

      // Query user document directly from Supabase
      const { data, error } = await supabase
        .from('users')
        .select('id, email, subscription_status, plan, stripe_customer_id, current_period_end, created_at, updated_at')
        .eq('id', uid)
        .maybeSingle();

      if (error) {
        if (error.code !== 'PGRST116') {
          console.error('Error fetching user document:', error);
        }
        setUserDoc({
          email: user?.email || user?.user_metadata?.email || '',
          subscriptionStatus: 'inactive',
          plan: null,
          stripeCustomerId: null,
          currentPeriodEnd: null,
          createdAt: null,
        });
      } else if (data) {
        setUserDoc({
          email: data.email || '',
          subscriptionStatus: data.subscription_status || 'inactive',
          plan: data.plan || null,
          stripeCustomerId: data.stripe_customer_id || null,
          currentPeriodEnd: data.current_period_end || null,
          createdAt: data.created_at || null,
        });
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
      setUserDoc({
        email: user?.email || user?.user_metadata?.email || '',
        subscriptionStatus: 'inactive',
        plan: null,
        stripeCustomerId: null,
        currentPeriodEnd: null,
        createdAt: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async (uid: string) => {
    // Since we're only using users table, create a subscription object from userDoc
    if (userDoc && userDoc.subscriptionStatus === 'active') {
      setSubscriptions([{
        id: uid,
        stripe_subscription_id: 'from_users_table',
        plan: userDoc.plan || 'monthly',
        subscription_status: userDoc.subscriptionStatus,
        current_period_end: userDoc.currentPeriodEnd,
        created_at: userDoc.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }]);
    } else {
      setSubscriptions([]);
    }
  };

  const handleManageBilling = async () => {
    if (!user) return;

    setPortalLoading(true);
    try {
      const response = await fetch('/api/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to open billing portal');
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
      alert('Failed to open billing portal');
    } finally {
      setPortalLoading(false);
    }
  };

  const handleSubscribe = () => {
    window.location.href = '/pricing';
  };

  const handleLogout = async () => {
    const supabase = createClient();
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const refreshSubscriptionStatus = async () => {
    if (!user) return;
    
    setRefreshing(true);
    try {
      const supabase = createClient();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }

      // Refresh user document
      const { data, error } = await supabase
        .from('users')
        .select('id, email, subscription_status, plan, stripe_customer_id, current_period_end, created_at, updated_at')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error refreshing subscription:', error);
      } else if (data) {
        setUserDoc({
          email: data.email || '',
          subscriptionStatus: data.subscription_status || 'inactive',
          plan: data.plan || null,
          stripeCustomerId: data.stripe_customer_id || null,
          currentPeriodEnd: data.current_period_end || null,
          createdAt: data.created_at || null,
        });
      }

      // Also refresh subscriptions
      await fetchSubscriptions(user.id);
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Check if user has active subscription from users table
  const isActive = userDoc?.subscriptionStatus === 'active';
  const nextBillingDate = userDoc?.currentPeriodEnd
    ? new Date(userDoc.currentPeriodEnd).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : null;

  const daysUntilRenewal = userDoc?.currentPeriodEnd
    ? Math.ceil((userDoc.currentPeriodEnd - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
          <div className="text-white text-xl font-semibold">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-linear-to-r from-purple-900/95 via-purple-800/95 to-indigo-900/95 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo - Left */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image
                src="/logo2.png"
                alt="SENIORS STUCK"
                width={200}
                height={80}
                className="h-12 sm:h-16 w-auto drop-shadow-lg"
                priority
              />
            </Link>

            {/* User Profile - Right */}
            <div className="flex items-center gap-3 sm:gap-4 relative">
              {/* Refresh Button */}
              <button
                onClick={refreshSubscriptionStatus}
                disabled={refreshing}
                className="bg-linear-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                title="Refresh Status"
              >
                <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 sm:gap-3 bg-linear-to-r from-purple-600/80 via-purple-700/80 to-purple-800/80 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {/* User Avatar */}
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <Image
                      src={user.user_metadata?.avatar_url || user.user_metadata?.picture || ''}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-yellow-400/50"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-2 border-yellow-400/50">
                      <span className="text-white font-bold text-sm">
                        {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  {/* User Name - Desktop Only */}
                  <span className="hidden sm:inline text-sm">
                    {user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'}
                  </span>
                  
                  {/* Dropdown Arrow */}
                  <svg className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-linear-to-br from-purple-900/95 via-purple-800/95 to-black/95 backdrop-blur-md rounded-xl shadow-2xl border-2 border-purple-500/40 p-4 z-50">
                    {/* User Info Section */}
                    <div className="mb-4 pb-4 border-b border-purple-500/30">
                      <div className="flex items-center gap-3">
                        {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                          <Image
                            src={user.user_metadata?.avatar_url || user.user_metadata?.picture || ''}
                            alt="Profile"
                            width={48}
                            height={48}
                            className="rounded-full border-2 border-yellow-400/50"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-2 border-yellow-400/50">
                            <span className="text-white font-bold text-lg">
                              {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold text-sm truncate">
                            {user.user_metadata?.full_name || user.user_metadata?.name || 'User'}
                          </p>
                          <p className="text-purple-300 text-xs truncate">
                            {user.email || user.user_metadata?.email || ''}
                          </p>
                          {isActive && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-400/50">
                              Active Subscription
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-2">
                      <Link
                        href="/"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-3 bg-purple-600/20 hover:bg-purple-600/30 text-white font-semibold py-3 px-4 rounded-lg text-sm transition-all duration-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                      </Link>

                      <Link
                        href="/pricing"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-3 bg-yellow-400/20 hover:bg-yellow-400/30 text-amber-950 font-semibold py-3 px-4 rounded-lg text-sm transition-all duration-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Newsletter &amp; products
                      </Link>

                      <button
                        onClick={() => {
                          handleLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-3 px-4 rounded-lg text-sm transition-all duration-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Close dropdown when clicking outside */}
            {showUserMenu && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
              Dashboard
            </h1>
            <p className="text-purple-200 text-lg">
              Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Subscription Status Card */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Subscription Status</h2>
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    isActive 
                      ? 'bg-green-500/20 text-green-400 border border-green-400/50' 
                      : userDoc?.subscriptionStatus === 'cancelled'
                      ? 'bg-red-500/20 text-red-400 border border-red-400/50'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-400/50'
                  }`}>
                    {isActive ? (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Active
                      </span>
                    ) : userDoc?.subscriptionStatus === 'cancelled' ? (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                        Cancelled
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                {!isActive ? (
                  <div className="text-center py-8">
                    <div className="mb-6">
                      <svg className="w-20 h-20 mx-auto text-purple-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="text-xl font-semibold text-white mb-2">No Active Subscription</h3>
                      <p className="text-purple-200 mb-6 max-w-md mx-auto">
                        Subscribe to get access to the "Unstuck" Newsletter and unlock weekly insights from Dr. Mark Johnson.
                      </p>
                    </div>
                    <button
                      onClick={handleSubscribe}
                      className="bg-linear-to-r from-yellow-400 via-yellow-500 to-yellow-400 hover:from-yellow-500 hover:via-yellow-400 hover:to-yellow-500 text-black font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
                    >
                      Subscribe Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Display all active subscriptions */}
                    {subscriptions.filter(sub => sub.subscription_status === 'active').length > 0 ? (
                      subscriptions
                        .filter(sub => sub.subscription_status === 'active')
                        .map((subscription) => (
                          <div key={subscription.id} className="bg-linear-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                              <div className="shrink-0">
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-green-400 mb-2">
                                  {subscription.plan === 'monthly' ? 'Monthly' : 'Yearly'} Subscription Active
                                </h3>
                                <p className="text-purple-100 mb-4">
                                  You have full access to the "Unstuck" Newsletter and all premium content!
                                </p>
                                <div className="flex flex-wrap gap-3">
                                  <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                                    <svg className="w-4 h-4 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                    <span className="text-white font-semibold capitalize">{subscription.plan} Plan</span>
                                  </div>
                                  {subscription.current_period_end && (
                                    <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                                      <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      <span className="text-white text-sm">
                                        Renews: {new Date(subscription.current_period_end).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="bg-linear-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                          <div className="shrink-0">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-green-400 mb-2">Subscription Active</h3>
                            <p className="text-purple-100 mb-4">
                              You have full access to the "Unstuck" Newsletter and all premium content!
                            </p>
                            {userDoc?.plan && (
                              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                                <svg className="w-4 h-4 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                <span className="text-white font-semibold capitalize">{userDoc.plan} Plan</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {nextBillingDate && (
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-3 mb-2">
                            <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-purple-300 text-sm font-medium">Next Billing</span>
                          </div>
                          <p className="text-white text-lg font-semibold">{nextBillingDate}</p>
                          {daysUntilRenewal !== null && daysUntilRenewal > 0 && (
                            <p className="text-purple-200 text-xs mt-1">{daysUntilRenewal} days remaining</p>
                          )}
                        </div>
                      )}
                      
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                          <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-purple-300 text-sm font-medium">Status</span>
                        </div>
                        <p className="text-white text-lg font-semibold capitalize">{userDoc?.subscriptionStatus || 'Inactive'}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href={`/api/download-pdf?uid=${user.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-linear-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Newsletter PDF
                      </a>
                      <button
                        onClick={handleManageBilling}
                        disabled={portalLoading}
                        className="flex-1 bg-linear-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                      >
                        {portalLoading ? (
                          <>
                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Opening...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Manage Billing
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Information Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl h-full">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Account Info
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-purple-300 text-sm font-medium mb-1 block">Email Address</label>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-white text-sm break-all">{user.email || user.user_metadata?.email || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {userDoc?.plan && (
                    <div>
                      <label className="text-purple-300 text-sm font-medium mb-1 block">Plan Type</label>
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <p className="text-white text-sm font-semibold capitalize">{userDoc.plan}</p>
                      </div>
                    </div>
                  )}

                  {userDoc?.createdAt && (
                    <div>
                      <label className="text-purple-300 text-sm font-medium mb-1 block">Member Since</label>
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <p className="text-white text-sm">
                          {new Date(userDoc.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-purple-300 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Secure & Protected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
}
