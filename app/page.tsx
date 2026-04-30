'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';
import { GOOGLE_SHEETS_WEBHOOK_URL, LEAD_SHEET_NAME } from '@/lib/googleSheets';
import MainNav from '@/components/MainNav';
import HomePricingSection from '@/components/HomePricingSection';

const WEBHOOK_URL = GOOGLE_SHEETS_WEBHOOK_URL;

interface FormData {
  name: string;
  email: string;
  message: string;
  date: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  submit?: string;
}

const INTRO_VIDEO_URL =
  '/Cracking%20the%20Code%20for%20Online%20Income_%20A%20Guide%20for%20Seniors.mp4';

export default function Home() {
  const leadMagnetUrl = '/_Lead%20magner%20pdf%20.pdf';
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    date: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [userDoc, setUserDoc] = useState<any>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [showMessageModal, setShowMessageModal] = useState<boolean>(false);
  const [messageModalContent, setMessageModalContent] = useState<{ title: string; message: string } | null>(null);
  const router = useRouter();

  // Auto-hide success message after 2 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  // Supabase Auth state listener
  useEffect(() => {
    const supabase = createClient();

    if (!supabase) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Supabase is not available. Please configure Supabase in .env.local');
      }
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      setUser(session?.user || null);

      if (session?.user) {
        fetchUserDocument(session.user.id);
        fetchSubscriptions(session.user.id);
      } else {
        setUserDoc(null);
        setSubscriptions([]);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      setUser(session?.user || null);

      if (session?.user) {
        fetchUserDocument(session.user.id);
        fetchSubscriptions(session.user.id);
      } else {
        setUserDoc(null);
        setSubscriptions([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserDocument = async (uid: string) => {
    try {
      const response = await fetch(`/api/user?uid=${uid}`);
      if (response.ok) {
        const data = await response.json();
        setUserDoc(data);
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
    }
  };

  const fetchSubscriptions = async (uid: string) => {
    // Since we're only using users table, create subscription object from userDoc
    if (userDoc && userDoc.subscriptionStatus === 'active') {
      setSubscriptions([{
        id: userDoc.uid,
        plan: userDoc.plan || 'monthly',
        subscription_status: userDoc.subscriptionStatus,
      }]);
    } else {
      setSubscriptions([]);
    }
  };

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const openFormModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFormModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError('');
    setAuthEmail('');
    setAuthPassword('');
    document.body.style.overflow = 'unset';
  };

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();

    const supabase = createClient();

    if (!supabase) {
      setAuthError('Supabase is not configured. Please check your .env.local file and restart the dev server.');
      return;
    }

    if (!authEmail || !authPassword) {
      setAuthError('Please enter both email and password');
      return;
    }

    setAuthLoading(true);
    setAuthError('');

    try {
      if (authMode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });

        if (error) throw error;

        closeAuthModal();
        router.push('/dashboard');
      } else {
        // Sign up mode
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
        });

        if (error) throw error;

        // After successful signup, switch to login mode without closing modal or refreshing
        setAuthMode('login');
        setAuthPassword(''); // Clear password but keep email
        // Show success message prompting user to login
        setAuthError('Account created successfully! Please login with your email and password.');
        // Note: If email confirmation is required, user will need to check email first
        // The auth state listener will handle login automatically if email confirmation is disabled
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error:', JSON.stringify(error, null, 2));

      // Provide user-friendly error messages based on Supabase error codes
      let errorMessage = 'Authentication failed';

      // Check for specific Supabase error codes first
      if (error.code === 'over_email_send_rate_limit' || error.message?.includes('email rate limit') || error.message?.includes('rate limit exceeded')) {
        errorMessage = 'Too many sign-up attempts. Please wait 10-15 minutes before trying again, or try using Google sign-in instead.';
      } else if (error.code === 'signup_disabled') {
        errorMessage = 'Sign up is currently disabled. Please contact support.';
      } else if (error.code === 'email_not_confirmed') {
        errorMessage = 'Please check your email to confirm your account before logging in.';
      } else if (error.code === 'user_already_registered' || error.message?.includes('already registered') || error.message?.includes('already exists') || error.message?.includes('User already registered')) {
        errorMessage = 'This email is already registered. Please use the "Login" option instead.';
      } else if (error.code === 'invalid_credentials' || error.message?.includes('Invalid login credentials') || error.message?.includes('Invalid password')) {
        if (authMode === 'login') {
          errorMessage = 'Incorrect email or password. Please verify your credentials.';
        } else {
          errorMessage = 'Invalid credentials. Please check your email and password.';
        }
      } else if (error.code === 'weak_password' || error.message?.includes('Password') && error.message?.includes('weak')) {
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
      } else if (error.code === 'invalid_email' || (error.message?.includes('email') && error.message?.includes('invalid'))) {
        errorMessage = `Invalid email address format. Please check and try again. (Error: ${error.message})`;
      } else if (error.message) {
        // Show the actual error message for debugging
        errorMessage = error.message;
      }

      setAuthError(errorMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const supabase = createClient();

    if (!supabase) {
      setAuthError('Supabase is not configured. Please check your .env.local file and restart the dev server.');
      return;
    }

    setAuthLoading(true);
    setAuthError('');

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) throw error;

      // OAuth redirects, so we don't need to close modal or navigate here
      // The redirect will happen automatically
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      let errorMessage = 'Google sign-in failed';

      if (error.message?.includes('popup')) {
        errorMessage = 'Sign-in popup was closed or blocked. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAuthError(errorMessage);
      setAuthLoading(false);
    }
  };

  const handleCheckout = async (priceId: string) => {
    setCheckoutLoading(priceId);

    try {
      const checkoutData = {
        priceId: priceId,
      };

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        // Show modal instead of alert
        setMessageModalContent({
          title: 'Subscription Notice',
          message: data.error || 'Failed to create checkout session',
        });
        setShowMessageModal(true);
        setCheckoutLoading(null);
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      setMessageModalContent({
        title: 'Error',
        message: 'Failed to create checkout session. Please try again.',
      });
      setShowMessageModal(true);
      setCheckoutLoading(null);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    if (!supabase) return;
    try {
      await supabase.auth.signOut();
      setShowUserMenu(false);
      setUser(null);
      setUserDoc(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = leadMagnetUrl;
    link.download = '_Lead magner pdf .pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSuccess(false);
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const jsonData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        date: new Date().toISOString(),
        sheetName: LEAD_SHEET_NAME,
      };

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      });

      setFormData({
        name: '',
        email: '',
        message: '',
        date: '',
      });
      setIsSuccess(true);
      downloadPDF();


    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('CORS')) {
        setFormData({
          name: '',
          email: '',
          message: '',
          date: '',
        });
        setIsSuccess(true);
        downloadPDF();

      } else {
        setErrors({
          submit: `Failed to submit form: ${errorMessage}. Please check your connection and try again.`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">

      <header className="relative z-40">
        <MainNav />

        <div className="container mx-auto max-w-full px-3 pt-2 pb-4 sm:px-4 sm:pt-4 sm:pb-6 mt-24">
        <div className="flex min-w-0 flex-col items-center gap-3 sm:gap-4">
          {/* Header: left design + logo (2 elements only) */}
          <div className="flex w-full min-w-0 flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8">
            <div className="min-w-0 max-w-full text-center">
              <Image
                src="/new_logo.png"
                alt="SENIORS STUCK"
                width={400}
                height={80}
                sizes="(max-width: 640px) 85vw, 400px"
                className="mx-auto h-auto w-full max-w-[min(100%,280px)] object-contain sm:max-w-sm md:max-w-md"
                priority
              />
            </div>
          </div>

          {/* Statement, Welcome, and Author - Below Logo */}
          <div className="flex min-w-0 flex-col items-center gap-2 text-center">
            {/* Main Statement */}
            <p className="mb-2 max-w-7xl px-1 text-balance text-[48px] font-bold leading-tight text-purple-700 sm:mb-4 sm:px-0">
              For the millions who are "Stuck" as you seek online and home business work online - We have your solutions here at SeniorsStuck.com
            </p>

            {/* Welcome Line */}
            <p className="mb-1 text-[48px] font-bold leading-tight text-purple-700 sm:mb-2">
              Welcome Home
            </p>

            {/* Author/Owner Name */}
            <p className="text-[48px] font-bold leading-tight text-purple-700">
              Mark Johnson, PhD, Mentor, CEO
            </p>
          </div>
        </div>
        </div>
      </header>

      {/* Hero — value prop, CTAs, lead magnet */}
      <section
        className="relative z-10 bg-purple-700 px-3 pb-10 pt-2 text-white sm:px-6 sm:pb-12 sm:pt-6 lg:px-8"
        aria-labelledby="hero-heading"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-white/10 via-white/5 to-transparent sm:h-72"
          aria-hidden
        />
        <div className="container relative mx-auto max-w-7xl min-w-0">
          <div className="grid min-w-0 grid-cols-1 items-stretch gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex min-w-0 flex-col justify-center text-center lg:col-span-7 lg:text-left">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-white/80 sm:mb-4 sm:text-sm sm:tracking-[0.15em] md:tracking-[0.2em]">
                Weekly mentorship · Real steps · No hype
              </p>
              <h1
                id="hero-heading"
                className="mb-4 text-balance text-3xl font-bold leading-[1.1] text-white sm:mb-5 sm:text-4xl sm:leading-[1.08] lg:text-5xl lg:max-w-[18ch]"
              >
                Get unstuck.
                <span className="mt-1 block text-amber-200">Build your online income.</span>
              </h1>
              <p className="mx-auto mb-5 max-w-xl text-base font-bold text-white sm:mb-6 sm:text-xl lg:mx-0 lg:text-2xl">
                Learn from a 55+ entrepreneur, PhD, and author who has done this for decades.
              </p>
              <p className="mx-auto mb-6 max-w-2xl text-sm font-bold leading-relaxed text-white/90 sm:mb-8 sm:text-lg lg:mx-0 lg:text-xl">
                Weekly guidance from{' '}
                <span className="text-amber-200">Dr. Mark Johnson</span> to help you build{' '}
                <span className="text-amber-200">online income</span> at your pace—with clarity and support.
              </p>

              <div className="flex w-full min-w-0 flex-col gap-3 sm:mx-auto sm:max-w-xl lg:mx-0 lg:max-w-2xl">
                <button
                  type="button"
                  onClick={openFormModal}
                  className="min-h-12 w-full cursor-pointer rounded-xl bg-white px-4 py-3 text-center text-sm font-bold leading-snug text-purple-700 shadow-[4px_4px_0_0_rgba(0,0,0,0.22)] transition-all hover:bg-white/90 hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.22)] active:translate-y-0.5 active:shadow-none sm:min-h-0 sm:px-6 sm:py-4 sm:text-base md:text-lg"
                >
                  Get Started now
                </button>
              </div>
            </div>

            <div className="flex min-w-0 w-full flex-col overflow-hidden rounded-2xl border-2 border-white/40 bg-purple-800/50 shadow-[8px_8px_0_0_rgba(0,0,0,0.25)] lg:col-span-5">
              <div className="border-b border-white/15 bg-white">
                <Image
                  src="/image%20(6).png"
                  alt="The SeniorsStuck.com guide — Getting you unstuck. Download your FREE Guide Today."
                  width={900}
                  height={700}
                  className="h-auto w-full max-w-full object-contain object-top"
                  sizes="(max-width: 1024px) 96vw, 40vw"
                  priority
                />
              </div>
              <div className="flex flex-col p-4 sm:p-8">
                {/* <div className="mb-6 text-center lg:text-left">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-black/55">
                    Free resource
                  </p>
                  <h2 className="text-2xl font-bold text-black sm:text-3xl">
                    Your starter guide
                  </h2>
                  <p className="mt-2 text-sm font-bold text-black/70 sm:text-base">
                    Download the PDF and get oriented fast—no payment required.
                  </p>
                </div> */}
                {/* <ul className="mb-8 space-y-3 text-left text-sm font-bold text-black sm:text-base">
                  <li className="flex gap-3">
                    <span className="mt-0.5 shrink-0 text-amber-900" aria-hidden>
                      ✓
                    </span>
                    <span>What actually works online (without the jargon)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 shrink-0 text-amber-900" aria-hidden>
                      ✓
                    </span>
                    <span>A realistic path you can follow week by week</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 shrink-0 text-amber-900" aria-hidden>
                      ✓
                    </span>
                    <span>Instant access after a quick request</span>
                  </li>
                </ul> */}
                <button
                  type="button"
                  onClick={openFormModal}
                  className="min-h-12 w-full cursor-pointer rounded-xl bg-white px-4 py-3 text-sm font-bold leading-snug text-purple-700 transition-colors hover:bg-white/90 sm:min-h-0 sm:px-6 sm:py-5 sm:text-base md:text-lg"
                >
                  Click for FREE Guide
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-3 pb-6 sm:px-6 sm:pb-8" aria-label="3 pack bundle">
        <div className="container mx-auto max-w-7xl">
          <div className="flex min-w-0 max-w-full flex-col items-center gap-3 text-center">
            <Image
              src="/header/image (27).png"
              alt="Header Left — three product guides"
              width={400}
              height={100}
              sizes="(max-width: 640px) 92vw, 400px"
              className="mx-auto h-auto w-full max-w-[min(100%,320px)] object-contain sm:max-w-[380px] md:max-w-[420px]"
              priority
            />
            <Link
              href="/#three-pack-bundle"
              className="inline-flex w-full max-w-[min(100%,320px)] items-center justify-center rounded-xl bg-purple-700 px-4 py-3.5 text-center text-sm font-bold leading-snug text-white shadow-[4px_4px_0_0_rgba(0,0,0,0.22)] transition-all hover:bg-purple-800 hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.22)] active:translate-y-0.5 active:shadow-none sm:max-w-[380px] sm:px-5 sm:py-4 sm:text-base md:max-w-[420px]"
            >
              Click to learn more about the 3 Pack Bundle
            </Link>
          </div>
        </div>
      </section>

      <HomePricingSection onCheckout={handleCheckout} checkoutLoading={checkoutLoading} />

      <section
        className="border-b border-purple-300/20 bg-linear-to-b from-[#17092f] via-[#0f0620] to-black"
        aria-labelledby="what-is-seniors-stuck-video-heading"
      >
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
          <div className="mx-auto w-full max-w-3xl">
            <div className="overflow-hidden rounded-2xl border-2 border-purple-300/30 bg-black shadow-[12px_12px_0_0_rgba(88,28,135,0.45)]">
              <video
                className="aspect-video w-full object-contain"
                controls
                playsInline
                preload="metadata"
                title="What is Seniors Stuck?"
              >
                <source src={INTRO_VIDEO_URL} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-3xl text-center sm:mt-10">
            <h1
              id="what-is-seniors-stuck-video-heading"
              className="text-balance text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
            >
              What is Seniors Stuck?
            </h1>
            <p className="mt-4 text-lg font-bold text-purple-200 sm:text-xl md:text-2xl">
              w/ Mark Johnson — Author, PhD, CEO
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-7xl sm:mt-12">
            <div className="relative overflow-hidden rounded-[28px] border-2 border-purple-300/35 bg-linear-to-b from-[#241046]/95 via-[#170a31]/95 to-black/95 p-6 shadow-[0_10px_35px_rgba(76,29,149,0.4)] ring-2 ring-purple-300/25 sm:p-8 md:p-10">
              <div className="pointer-events-none absolute -top-8 -left-10 h-24 w-24 rounded-full bg-purple-300/20 blur-xl" aria-hidden />
              <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-fuchsia-300/20 blur-xl" aria-hidden />
              <p className="text-center text-balance text-3xl font-extrabold leading-relaxed text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:text-2xl md:text-4xl">
                There are Millions of us out here online and seeking to earn money online
              </p>
              <p className="mt-6 text-center text-balance text-xl font-extrabold leading-relaxed text-purple-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:text-2xl md:text-3xl">
                We are all &quot;stuck&quot; confused &amp; tech overwhelm
              </p>
              <p className="mt-7 rounded-2xl border border-purple-300/40 bg-white/10 px-2 py-4 text-center text-balance text-2xl font-black leading-snug text-white shadow-[0_8px_24px_rgba(76,29,149,0.35)] sm:text-3xl md:text-4xl">
                SeniorsStuck — will get you — &quot;Unstuck&quot; Today!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section — copy unchanged; spacing & type scale tuned */}
      <section
        className="border-y border-gray-200/80 bg-gray-100 px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
        aria-labelledby="about-heading"
      >
        <div className="container mx-auto max-w-7xl">
          <header className="mb-8 text-center sm:mb-10">
            <h2
              id="about-heading"
              className="text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-5xl"
            >
              About Us
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base font-bold leading-snug text-black sm:mt-4 sm:text-lg lg:text-xl">
              Your trusted partner in building online income
            </p>
          </header>

          <div className="grid min-w-0 grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <div className="flex h-full flex-col overflow-hidden rounded-xl border-2 border-black/20 bg-white p-3 sm:p-4">
                <div className="relative aspect-4/5 w-full min-h-[260px] sm:min-h-[280px] lg:min-h-[380px] lg:flex-1">
                  <Image
                    src="/photo2.png"
                    alt="Dr. Mark Johnson"
                    width={500}
                    height={650}
                    className="h-full w-full object-cover rounded-lg shadow-2xl"
                    priority
                  />
                </div>
                <div className="space-y-1 px-2 py-4 text-center sm:px-1 lg:text-left">
                  <h3 className="text-xl font-bold text-amber-900 sm:text-2xl">Dr. Mark Johnson</h3>
                  <p className="text-base font-bold text-black sm:text-lg">Age 66, PhD, Author</p>
                  <p className="text-base font-bold text-black sm:text-lg">30 Years Experience Online</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="flex h-full flex-col rounded-xl border-2 border-black/20 bg-white px-5 py-6 sm:px-7 sm:py-8 lg:px-9 lg:py-10">
                <p className="text-base font-bold leading-relaxed text-black sm:text-lg lg:text-xl lg:leading-relaxed">
                  We help <span className="font-bold text-amber-900">55+ entrepreneurs</span> build real online income
                  with clear, step-by-step guidance. Led by{' '}
                  <span className="font-bold text-amber-900">Dr. Mark Johnson</span>, we replace tech overwhelm with
                  proven strategies and support.
                </p>

                <div className="mt-6 space-y-3 border-t border-black/10 pt-6 text-black font-bold sm:mt-7 sm:space-y-4 sm:pt-7">
                  <h3 className="text-xl font-bold sm:text-2xl lg:text-3xl">30 Years Experience</h3>
                  <p className="text-base leading-relaxed sm:text-lg lg:text-xl">
                    Online since &quot;AOL dialup&quot; years! Mark has been building online businesses since the early
                    days of the internet.
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg">
                    PhD, Author, Online Teaching &amp; Mentoring Expert
                  </p>
                </div>

                <div className="mt-auto flex flex-col items-center gap-5 border-t border-black/10 pt-6 sm:gap-6 sm:pt-8">
                  <p className="text-center text-base font-bold text-black sm:text-lg">
                    Built By: www.SeniorsStuck CEO Mark Johnson
                  </p>
                  <div className="flex w-full max-w-xl flex-col justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4">
                    <a
                      href="http://www.60somethingthebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-purple-700 px-4 py-3 text-center text-sm font-bold text-white wrap-break-word transition-colors hover:bg-purple-800 sm:flex-1 sm:px-6 sm:py-3.5 sm:text-lg"
                    >
                      Type 2 Diabetes – 60something website
                    </a>
                    <a
                      href="https://www.60somethingteam.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-purple-700 px-4 py-3 text-center text-sm font-bold text-white wrap-break-word transition-colors hover:bg-purple-800 sm:flex-1 sm:px-6 sm:py-3.5 sm:text-lg"
                    >
                      Get Legacy 2.0 DFY Website BluePrint
                    </a>
                  </div>
                  <div className="w-full max-w-2xl px-1 text-center text-sm font-bold leading-snug text-black sm:text-base lg:text-lg">
                    For Retired Teachers and Coaches – Seeking an Online Income DFY Business – Unlimited Leads and
                    Complete Automation/System for Us –{' '}
                    <a
                      href="https://the-homefield-advantage.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-900 underline underline-offset-4 hover:text-amber-950"
                    >
                      Click to Learn More
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-white/80 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border-2 border-black/20 bg-white p-4 shadow-2xl sm:p-8">
            <button
              onClick={closeFormModal}
              className="absolute top-4 right-4 text-black font-bold hover:text-amber-800 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <form
              className="space-y-6"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                  Get Your FREE Guide
                </h2>
                <p className="text-black font-bold text-xl">Start building your online income today</p>
              </div>

              {/* Thank You Message */}
              {isSuccess && (
                <div className="bg-green-500/20 border-2 border-green-400/50 rounded-lg p-6 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="w-12 h-12 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-2xl font-bold text-green-300 mb-2">Thank You!</h3>
                      <p className="text-green-300 text-base">Your information has been saved successfully.</p>
                      <p className="text-green-300 text-base mt-2">Your FREE Guide is downloading now!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errors.submit && (
                <div className="bg-red-500/20 border-2 border-red-400/50 rounded-lg p-4 text-red-300 text-sm sm:text-base">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{errors.submit}</span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="modal-name" className="block text-black font-bold mb-2 text-sm sm:text-base">
                  Full Name <span className="text-amber-900">*</span>
                </label>
                <input
                  type="text"
                  id="modal-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/40 border-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-black font-bold placeholder:text-purple-300/50 text-sm sm:text-base ${errors.name ? 'border-red-400/50' : 'border-purple-500/50'
                    }`}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="mt-1 text-red-400 text-xs sm:text-sm">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="modal-email" className="block text-black font-bold mb-2 text-sm sm:text-base">
                  Email Address <span className="text-amber-900">*</span>
                </label>
                <input
                  type="email"
                  id="modal-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/40 border-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-black font-bold placeholder:text-purple-300/50 text-sm sm:text-base ${errors.email ? 'border-red-400/50' : 'border-purple-500/50'
                    }`}
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-red-400 text-xs sm:text-sm">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="modal-message" className="block text-black font-bold mb-2 text-sm sm:text-base">
                  Message <span className="text-amber-900">*</span>
                </label>
                <textarea
                  id="modal-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 bg-white/40 border-2 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-black font-bold placeholder:text-purple-300/50 text-sm sm:text-base resize-none ${errors.message ? 'border-red-400/50' : 'border-purple-500/50'
                    }`}
                  placeholder="What have you been stuck on? What have you been wanting to do online?"
                  disabled={isLoading}
                />
                {errors.message && (
                  <p className="mt-1 text-red-400 text-xs sm:text-sm">{errors.message}</p>
                )}
                <p className="mt-2 text-purple-800/70 text-xs sm:text-sm italic">
                  Mark reads all messages and will be back to you asap
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-4 md:py-6 px-6 md:px-8 rounded-lg text-xl md:text-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit & Get FREE Guide'
                )}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm">
          <div className="bg-white border-2 border-black/20 rounded-2xl p-8 shadow-2xl relative max-w-md w-full">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-black font-bold hover:text-amber-800 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </h2>
              <p className="text-black font-bold text-xl">
                {authMode === 'login'
                  ? 'Login to access your account'
                  : 'Create an account to get started'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authError && (
                <div className={`border-2 rounded-lg p-4 text-sm ${authError.includes('successfully') || authError.includes('created') || authError.includes('Account created')
                    ? 'bg-green-500/20 border-green-400/50 text-green-300'
                    : 'bg-red-500/20 border-red-400/50 text-red-300'
                  }`}>
                  {authError}
                </div>
              )}

              <div>
                <label htmlFor="auth-email" className="block text-purple-100 font-semibold mb-2 text-sm sm:text-base">
                  Email Address <span className="text-amber-900">*</span>
                </label>
                <input
                  type="email"
                  id="auth-email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/40 border-2 border-purple-500/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-black font-bold placeholder:text-purple-300/50 text-sm sm:text-base"
                  placeholder="your@email.com"
                  required
                  disabled={authLoading}
                />
              </div>

              <div>
                <label htmlFor="auth-password" className="block text-purple-100 font-semibold mb-2 text-sm sm:text-base">
                  Password <span className="text-amber-900">*</span>
                </label>
                <input
                  type="password"
                  id="auth-password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/40 border-2 border-purple-500/50 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-black font-bold placeholder:text-purple-300/50 text-sm sm:text-base"
                  placeholder="Enter your password"
                  required
                  disabled={authLoading}
                  minLength={6}
                />
                {authMode === 'signup' && (
                  <p className="mt-1 text-purple-300/70 text-xs">Password must be at least 6 characters</p>
                )}
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-4 md:py-6 px-6 md:px-8 rounded-lg text-xl md:text-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {authMode === 'login' ? 'Logging in...' : 'Signing up...'}
                  </span>
                ) : (
                  authMode === 'login' ? 'Login' : 'Sign Up'
                )}
              </button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-purple-500/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-purple-900/95 text-purple-300">OR</span>
                </div>
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="w-full bg-white hover:bg-gray-100 text-gray-700 font-bold py-4 px-6 rounded-lg text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {authLoading ? 'Signing in...' : 'Continue with Google'}
              </button>

              <div className="space-y-3">
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode(authMode === 'login' ? 'signup' : 'login');
                      setAuthError('');
                      setAuthEmail('');
                      setAuthPassword('');
                    }}
                    className="text-purple-300 hover:text-amber-200 text-sm transition-colors"
                  >
                    {authMode === 'login'
                      ? "Don't have an account? Sign up"
                      : 'Already have an account? Login'}
                  </button>
                </div>

                {authMode === 'login' && (
                  <div className="text-center">
                    <p className="text-purple-300/70 text-xs mb-2">
                      Having trouble logging in?
                    </p>
                    <p className="text-purple-300/70 text-xs">
                      Make sure you're using the same email and password you used to sign up.
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && messageModalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm">
          <div className="bg-white border-2 border-black/20 rounded-2xl p-8 shadow-2xl relative max-w-md w-full">
            <button
              onClick={() => {
                setShowMessageModal(false);
                setMessageModalContent(null);
              }}
              className="absolute top-4 right-4 text-black font-bold hover:text-amber-800 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                {messageModalContent.title}
              </h2>
              <p className="text-black font-bold text-lg leading-relaxed">
                {messageModalContent.message}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageModalContent(null);
                }}
                className="flex-1 bg-purple-700 hover:bg-purple-800 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors"
              >
                OK
              </button>
              {messageModalContent.message.includes('dashboard') && (
                <button
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessageModalContent(null);
                    router.push('/dashboard');
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-black font-bold py-4 px-6 rounded-lg text-lg transition-colors"
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-black/20 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-black font-bold text-lg">
            © {new Date().getFullYear()} SeniorsStuck.com. All rights reserved.
          </p>
          <p className="text-black font-bold text-lg mt-4">
            <a href="mailto:mjohnsonsports@aol.com" className="font-bold text-amber-900 underline-offset-2 hover:text-amber-950 hover:underline transition-colors">
              mjohnsonsports@aol.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
