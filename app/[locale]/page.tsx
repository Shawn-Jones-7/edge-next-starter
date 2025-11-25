/**
 * Home Page
 * B2B enterprise landing page with i18n support
 */

import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';

// Generate static params for all supported locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale as Locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations();

  return (
    <div className="flex min-h-screen flex-col p-8">
      {/* Top Navigation Bar */}
      <nav className="mx-auto mb-12 flex w-full max-w-6xl items-center justify-between">
        <h1 className="text-xl font-bold">{t('common.companyName')}</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/contact">{t('common.contactUs')}</Link>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold">{t('home.title')}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">{t('home.subtitle')}</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
            <h2 className="mb-2 text-xl font-semibold">{t('home.products.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('home.products.description')}</p>
          </div>

          <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
            <h2 className="mb-2 text-xl font-semibold">{t('home.services.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('home.services.description')}</p>
          </div>

          <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
            <h2 className="mb-2 text-xl font-semibold">{t('home.solutions.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('home.solutions.description')}</p>
          </div>

          <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
            <h2 className="mb-2 text-xl font-semibold">{t('home.support.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('home.support.description')}</p>
          </div>
        </div>

        <div id="contact" className="mt-8 text-center">
          <Button size="lg" asChild>
            <Link href="/contact">{t('common.getInTouch')}</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 py-6 dark:border-gray-800">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="transition hover:text-primary hover:underline">
              {t('footer.privacy')}
            </Link>
            <span>|</span>
            <Link href="/terms" className="transition hover:text-primary hover:underline">
              {t('footer.terms')}
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </div>
  );
}
