'use client';

import * as React from 'react';

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils/index';

import { LanguageSwitcher } from './language-switcher';

interface MobileNavProps {
  className?: string;
}

const NAV_ITEMS = [
  { href: '/', key: 'home' },
  { href: '/contact', key: 'contact' },
] as const;

export function MobileNav({ className }: MobileNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const t = useTranslations('nav');
  const pathname = usePathname();

  // Close menu when route changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className={cn('md:hidden', className)}>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 flex h-10 w-10 items-center justify-center"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <div className="flex h-4 w-5 flex-col justify-between">
          <span
            className={cn(
              'block h-0.5 w-full bg-current transition-transform duration-300',
              isOpen && 'translate-y-1.5 rotate-45'
            )}
          />
          <span
            className={cn(
              'block h-0.5 w-full bg-current transition-opacity duration-300',
              isOpen && 'opacity-0'
            )}
          />
          <span
            className={cn(
              'block h-0.5 w-full bg-current transition-transform duration-300',
              isOpen && '-translate-y-2 -rotate-45'
            )}
          />
        </div>
      </button>

      {/* Full screen overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'text-2xl font-medium transition-colors',
                pathname === item.href ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="mt-8 border-t border-border pt-8">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </div>
  );
}
