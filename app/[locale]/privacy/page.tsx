/**
 * Privacy Policy Page
 * Provides information about data collection, usage, and protection
 */

import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Generate static params for all supported locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPolicyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return <PrivacyContent locale={locale as Locale} />;
}

// eslint-disable-next-line complexity
function PrivacyContent({ locale }: { locale: Locale }) {
  const t = useTranslations();

  const lastUpdated = new Date().toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">{t('privacy.title')}</h1>
        <p className="text-muted-foreground">{t('privacy.lastUpdated', { date: lastUpdated })}</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{locale === 'zh' ? '1. 简介' : '1. Introduction'}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              {locale === 'zh'
                ? '欢迎使用我们的服务。我们尊重您的隐私，并致力于保护您的个人数据。本隐私政策将告诉您我们如何在您使用我们的服务时处理您的个人数据，并告诉您您的隐私权以及法律如何保护您。'
                : 'Welcome to our service. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your personal data when you use our service and tell you about your privacy rights and how the law protects you.'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {locale === 'zh' ? '2. 我们收集的信息' : '2. Information We Collect'}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>{locale === 'zh' ? '联系信息：' : 'Contact Information:'}</strong>{' '}
                {locale === 'zh'
                  ? '当您通过我们的联系表单提交信息时，我们会收集您的姓名、邮箱、电话和公司信息。'
                  : 'When you submit information through our contact form, we collect your name, email, phone, and company information.'}
              </li>
              <li>
                <strong>{locale === 'zh' ? '使用数据：' : 'Usage Data:'}</strong>{' '}
                {locale === 'zh'
                  ? '关于您如何使用我们服务的信息，包括页面浏览和交互模式。'
                  : 'Information about how you use our service, including page views and interaction patterns.'}
              </li>
              <li>
                <strong>{locale === 'zh' ? '设备信息：' : 'Device Information:'}</strong>{' '}
                {locale === 'zh'
                  ? '浏览器类型、操作系统、IP 地址和设备标识符。'
                  : 'Browser type, operating system, IP address, and device identifiers.'}
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {locale === 'zh' ? '3. 数据存储和安全' : '3. Data Storage and Security'}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              {locale === 'zh'
                ? '您的数据使用 Cloudflare 的全球基础设施存储，包括：'
                : "Your data is stored using Cloudflare's global infrastructure:"}
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>{locale === 'zh' ? '数据库：' : 'Database:'}</strong> Cloudflare D1
              </li>
              <li>
                <strong>{locale === 'zh' ? '文件存储：' : 'File Storage:'}</strong> Cloudflare R2
              </li>
              <li>
                <strong>{locale === 'zh' ? '缓存：' : 'Cache:'}</strong> Cloudflare KV
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{locale === 'zh' ? '4. 联系我们' : '4. Contact Us'}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              {locale === 'zh'
                ? '如果您对本隐私政策有任何疑问，请通过我们的联系页面与我们联系。'
                : 'If you have any questions about this privacy policy, please contact us through our contact page.'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 flex justify-center gap-4">
        <Link href="/terms" className="text-primary hover:underline">
          {t('footer.terms')}
        </Link>
        <span className="text-muted-foreground">•</span>
        <Link href="/" className="text-primary hover:underline">
          {t('common.backHome')}
        </Link>
      </div>
    </div>
  );
}
