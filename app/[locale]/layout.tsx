/**
 * Locale Layout
 * Root layout for locale-specific pages with i18n support
 */

import { notFound } from 'next/navigation';

import { routing, type Locale } from '@/i18n/routing';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import { Footer, Header } from '@/components/layout';
import { ThemeProvider } from '@/components/providers';

// Generate static params for all supported locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Generate metadata based on locale
export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;

  const validLocale: Locale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;

  const title =
    validLocale === 'zh' ? 'B2B 企业 - 企业解决方案' : 'B2B Enterprise - Enterprise Solutions';

  const description =
    validLocale === 'zh'
      ? '您值得信赖的企业解决方案合作伙伴'
      : 'Your trusted B2B partner for enterprise solutions';

  return {
    title,
    description,
  };
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Load messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
