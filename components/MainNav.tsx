'use client';

import { useEffect, useState } from 'react';

function SocialIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10 hover:text-purple-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300/60"
    >
      {children}
    </a>
  );
}

export default function MainNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const linkClass = 'text-white font-bold hover:text-purple-200 transition-colors';
  const linkDrawer =
    'block w-full rounded-lg px-4 py-3.5 text-base font-bold text-white transition-colors hover:bg-purple-700/70 active:bg-purple-600/70';

  const items = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/product', label: 'Newsletter' },
    { href: '/enough-is-enough', label: 'Enough is Enough' },
    { href: '/implementation-masters-program', label: 'Implementation Masters Program' },
    { href: '/freelancer-detector-kit', label: 'Freelancer Detector Kit' },
  ] as const;

  const socialLinks = [
    {
      href: 'https://www.youtube.com/@SeniorsStuck',
      label: 'YouTube: SeniorsStuck',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5A3 3 0 0 0 2.4 7.2 31.7 31.7 0 0 0 2 12a31.7 31.7 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1A31.7 31.7 0 0 0 22 12a31.7 31.7 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
        </svg>
      ),
    },
    {
      href: 'https://instagram.com/seniorsstuck/?hl=en',
      label: 'Instagram: SeniorsStuck',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-2.4a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z" />
        </svg>
      ),
    },
    {
      href: 'https://www.facebook.com/seniorsstuck/',
      label: 'Facebook: SeniorsStuck (Page 1)',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M13.5 22v-8h2.8l.5-3H13.5V9.1c0-.9.3-1.6 1.7-1.6h1.9V4.8c-.3 0-1.5-.1-2.9-.1-2.9 0-4.9 1.8-4.9 5V11H6.6v3h2.7v8h4.2Z" />
        </svg>
      ),
    },
    {
      href: 'https://www.facebook.com/profile.php?id=61587465736036',
      label: 'Facebook: SeniorsStuck (Page 2)',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M13.5 22v-8h2.8l.5-3H13.5V9.1c0-.9.3-1.6 1.7-1.6h1.9V4.8c-.3 0-1.5-.1-2.9-.1-2.9 0-4.9 1.8-4.9 5V11H6.6v3h2.7v8h4.2Z" />
        </svg>
      ),
    },
    {
      href: 'https://www.tiktok.com/@serniorsstuck',
      label: 'TikTok: serniorsstuck',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M16.7 2h-3.1v13.1a2.7 2.7 0 1 1-2.1-2.6V9.4a5.8 5.8 0 1 0 5.3 5.7V10a7.2 7.2 0 0 0 4.2 1.4V8.3A4.3 4.3 0 0 1 16.7 4V2Z" />
        </svg>
      ),
    },
    {
      href: 'https://www.pinterest.com/SeniorsStuck/_created/',
      label: 'Pinterest: SeniorsStuck',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
          <path d="M12.2 2C6.6 2 2 6.2 2 11.6c0 4.2 2.6 7.9 6.4 9.3-.1-.8-.2-2.1 0-3l1.4-5.7s-.4-.9-.4-2.1c0-2 1.2-3.5 2.7-3.5 1.3 0 1.9.9 1.9 2 0 1.2-.8 3.1-1.2 4.8-.3 1.4.7 2.5 2.1 2.5 2.5 0 4.4-2.6 4.4-6.4 0-3.3-2.4-5.7-5.9-5.7-4 0-6.4 3-6.4 6.1 0 1.2.5 2.6 1.1 3.3.1.2.1.3.1.5l-.4 1.6c-.1.5-.4.7-.8.5-1.5-.7-2.4-2.9-2.4-4.7 0-3.9 2.8-7.4 8.1-7.4 4.2 0 7.5 3 7.5 7.1 0 4.2-2.7 7.6-6.4 7.6-1.3 0-2.5-.6-2.9-1.5l-.8 3.1c-.3 1-1 2.4-1.5 3.2 1.1.3 2.2.4 3.4.4 5.6 0 10.2-4.2 10.2-9.6C22.4 6.2 17.8 2 12.2 2Z" />
        </svg>
      ),
    },
  ] as const;

  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-50 w-full max-w-[100vw] shadow-sm">
        {/* Top bar */}
        <div className="w-full bg-black">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-3 py-2 sm:px-6 md:px-8">
            {socialLinks.map(({ href, label, icon }) => (
              <SocialIconLink key={href} href={href} label={label}>
                {icon}
              </SocialIconLink>
            ))}
          </div>
        </div>

        {/* Main nav */}
        <div className="w-full border-b border-purple-300/20 bg-linear-to-r from-[#1a0733] via-[#120625] to-black">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-6 md:px-8 md:py-5">
          <span className="min-w-0 shrink truncate text-base font-bold text-white md:hidden">
            SeniorsStuck
          </span>

          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-purple-300/30 bg-white/10 text-white transition-colors hover:bg-white/15 md:hidden"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <nav className="hidden min-w-0 w-full md:block" aria-label="Main">
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-center text-sm font-bold leading-snug text-white md:text-base">
              {items.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className={linkClass}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      </div>

      {/* Mobile: right drawer */}
      <div className="md:hidden" aria-hidden={!open}>
        <button
          type="button"
          className={`fixed inset-0 z-100 bg-black/45 transition-opacity duration-300 ${
            open ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
        />

        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={`fixed top-0 right-0 z-110 flex h-full w-[min(100vw,20rem)] max-w-[85vw] flex-col border-l border-purple-300/20 bg-linear-to-b from-[#160a2d] via-[#10051f] to-black shadow-[-8px_0_24px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out ${
            open ? 'translate-x-0' : 'translate-x-full pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between gap-2 border-b border-purple-300/20 px-4 py-3">
            <span className="text-lg font-bold text-white">Menu</span>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-purple-300/30 text-white transition-colors hover:bg-white/10"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3" aria-label="Main mobile">
            <ul className="flex flex-col gap-1">
              {items.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className={linkDrawer}
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

    </>
  );
}
