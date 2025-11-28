'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import { Container } from './container';
import { Logo } from './logo';
import { ThemeSwitcher } from './theme-switcher';

export function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background">
      <Container className="py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Left: Logo */}
          <Logo showText={false} />

          {/* Center: Links */}
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              {t('privacy')}
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              {t('terms')}
            </Link>
          </nav>

          {/* Right: Theme switcher (like Vercel) */}
          <ThemeSwitcher />
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          {t('copyright', { year: currentYear })}
        </div>
      </Container>
    </footer>
  );
}
