'use client';

import { useEffect, useState } from 'react';

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
    { href: '/product', label: 'Product' },
    { href: '/enough-is-enough', label: 'Enough is Enough' },
    { href: '/implementation-masters-program', label: 'Implementation Masters Program' },
    { href: '/freelancer-detector-kit', label: 'Freelancer Detector Kit' },
  ] as const;

  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-50 w-full max-w-[100vw] border-b border-purple-300/20 bg-linear-to-r from-[#1a0733] via-[#120625] to-black shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-6 md:justify-center md:px-8 md:py-5">
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
