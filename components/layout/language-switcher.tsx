'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { useLocale } from 'next-intl';

import { cn } from '@/lib/utils/index';

interface LanguageSwitcherProps {
  className?: string;
}

const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  zh: '中',
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function handleLocaleChange(newLocale: Locale) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => handleLocaleChange(l)}
          className={cn(
            'rounded px-2 py-1 text-sm transition-colors',
            l === locale
              ? 'bg-foreground text-background'
              : 'text-muted-foreground hover:text-foreground'
          )}
          aria-current={l === locale ? 'true' : undefined}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
