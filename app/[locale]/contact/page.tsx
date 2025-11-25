/**
 * Contact Page
 * Contact form with internationalization support
 */

import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { ContactForm } from '@/components/contact-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Generate static params for all supported locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return <ContactContent />;
}

function ContactContent() {
  const t = useTranslations();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold">{t('contact.title')}</h1>
        <p className="text-lg text-muted-foreground">{t('contact.description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('contact.subtitle')}</CardTitle>
          <CardDescription>{t('contact.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ContactForm />

          <div className="flex justify-center pt-4">
            <Button variant="outline" asChild>
              <Link href="/">{t('common.backHome')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
