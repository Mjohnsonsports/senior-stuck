'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const resourceLinks = [
  { href: '/product', label: 'Newsletter' },
  { href: '/enough-is-enough', label: 'Enough is Enough' },
  { href: '/implementation-masters-program', label: 'Implementation Masters Program' },
  { href: '/freelancer-detector-kit', label: 'Freelancer Detector Kit' },
] as const;

const BLOG_URL = 'https://www.seniorsstuck.com/blog';
const CONTACT_EMAIL = 'mjohnsonsports@aol.com';

type MainNavProps = {
  onFreeStarterKitClick?: () => void;
};

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

function ChevronDown({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 transition-transform ${className}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function MainNav({ onFreeStarterKitClick }: MainNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [hash, setHash] = useState('');
  const resourcesRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    setHash(window.location.hash);
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [pathname]);

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
      if (e.key === 'Escape') {
        setOpen(false);
        setResourcesOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const isPathActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isResourcesActive = resourceLinks.some(({ href }) => isPathActive(href));

  const isAnchorActive = (anchor: string) => pathname === '/' && hash === anchor;

  const navLinkClass = (active: boolean) =>
    [
      'relative inline-flex items-center gap-1 pb-1 text-sm font-semibold tracking-wide text-purple-700 transition-colors lg:text-[15px]',
      active
        ? 'after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:h-[3px] after:rounded-full after:bg-purple-700'
        : 'hover:text-purple-900',
    ].join(' ');

  const drawerLinkClass = (active: boolean) =>
    [
      'block w-full rounded-lg px-4 py-3 text-base font-semibold transition-colors',
      active
        ? 'bg-purple-50 text-purple-700'
        : 'text-slate-600 hover:bg-slate-100 hover:text-purple-700',
    ].join(' ');

  const closeMobile = () => {
    setOpen(false);
    setMobileResourcesOpen(false);
  };

  const FreeStarterKitButton = ({ className = '' }: { className?: string }) => {
    const buttonClass = `inline-flex shrink-0 items-center justify-center rounded-full bg-purple-700 px-4 py-2.5 text-center text-[11px] font-bold leading-tight text-white shadow-sm transition-colors hover:bg-purple-800 sm:px-5 sm:text-xs ${className}`;

    if (onFreeStarterKitClick) {
      return (
        <button type="button" className={buttonClass} onClick={onFreeStarterKitClick}>
          Free Making Money Online Guidebook
        </button>
      );
    }

    return (
      <Link href="/#free-guide" className={buttonClass} onClick={closeMobile}>
        Free Making Money Online Guidebook
      </Link>
    );
  };

  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-50 w-full max-w-[100vw] shadow-sm">
        {/* Social top bar */}
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
        <header className="w-full border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 md:hidden"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            aria-label="Open menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <nav className="hidden min-w-0 flex-1 items-center justify-center md:flex" aria-label="Main">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:gap-x-9">
              <li>
                <Link href="/" className={navLinkClass(isPathActive('/'))}>
                  Home
                </Link>
              </li>

              <li className="relative" ref={resourcesRef}>
                <button
                  type="button"
                  className={navLinkClass(isResourcesActive)}
                  aria-expanded={resourcesOpen}
                  aria-haspopup="true"
                  onClick={() => setResourcesOpen((prev) => !prev)}
                >
                  Resources
                  <ChevronDown className={resourcesOpen ? 'rotate-180' : ''} />
                </button>

                {resourcesOpen && (
                  <ul
                    role="menu"
                    className="absolute top-full left-1/2 z-50 mt-3 min-w-[15rem] -translate-x-1/2 rounded-xl border border-slate-200 bg-white py-2 shadow-lg"
                  >
                    {resourceLinks.map(({ href, label }) => (
                      <li key={href} role="none">
                        <Link
                          href={href}
                          role="menuitem"
                          className={`block px-4 py-2.5 text-sm font-semibold transition-colors ${
                            isPathActive(href)
                              ? 'bg-purple-50 text-purple-700'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-purple-700'
                          }`}
                          onClick={() => setResourcesOpen(false)}
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              <li>
                <a href={BLOG_URL} target="_blank" rel="noreferrer" className={navLinkClass(false)}>
                  Award-Winning Blog
                </a>
              </li>

              <li>
                <Link href="/#about-heading" className={navLinkClass(isAnchorActive('#about-heading'))}>
                  About Mark
                </Link>
              </li>

              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className={navLinkClass(false)}>
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex shrink-0 items-center md:ml-0 md:justify-end">
            <FreeStarterKitButton />
          </div>
        </div>
        </header>
      </div>

      <div className="md:hidden" aria-hidden={!open}>
        <button
          type="button"
          className={`fixed inset-0 z-100 bg-black/40 transition-opacity duration-300 ${
            open ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={closeMobile}
        />

        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={`fixed top-0 right-0 z-110 flex h-full w-[min(100vw,20rem)] max-w-[85vw] flex-col border-l border-slate-200 bg-white shadow-[-8px_0_24px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out ${
            open ? 'translate-x-0' : 'pointer-events-none translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
            <span className="text-lg font-bold text-purple-700">Menu</span>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100"
              onClick={closeMobile}
              aria-label="Close menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3" aria-label="Main mobile">
            <ul className="flex flex-col gap-1">
              <li>
                <Link href="/" className={drawerLinkClass(isPathActive('/'))} onClick={closeMobile}>
                  Home
                </Link>
              </li>

              <li>
                <button
                  type="button"
                  className={`${drawerLinkClass(isResourcesActive)} flex w-full items-center justify-between`}
                  aria-expanded={mobileResourcesOpen}
                  onClick={() => setMobileResourcesOpen((prev) => !prev)}
                >
                  <span>Resources</span>
                  <ChevronDown className={mobileResourcesOpen ? 'rotate-180' : ''} />
                </button>
                {mobileResourcesOpen && (
                  <ul className="mt-1 space-y-1 border-l-2 border-purple-200 pl-3">
                    {resourceLinks.map(({ href, label }) => (
                      <li key={href}>
                        <Link
                          href={href}
                          className={drawerLinkClass(isPathActive(href))}
                          onClick={closeMobile}
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              <li>
                <a
                  href={BLOG_URL}
                  target="_blank"
                  rel="noreferrer"
                  className={drawerLinkClass(false)}
                  onClick={closeMobile}
                >
                  Award-Winning Blog
                </a>
              </li>

              <li>
                <Link
                  href="/#about-heading"
                  className={drawerLinkClass(isAnchorActive('#about-heading'))}
                  onClick={closeMobile}
                >
                  About Mark
                </Link>
              </li>

              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className={drawerLinkClass(false)} onClick={closeMobile}>
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <div className="border-t border-slate-200 p-4">
            <FreeStarterKitButton className="w-full" />
          </div>
        </div>
      </div>
    </>
  );
}
