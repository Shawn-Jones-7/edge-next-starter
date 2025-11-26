/**
 * Terms of Service Page
 * Provides information about the terms and conditions of using the service
 */

import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Force dynamic rendering to avoid SSG issues with i18n navigation
export const dynamic = 'force-dynamic';

// Generate static params for all supported locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

// eslint-disable-next-line complexity
export default async function TermsOfServicePage({ params }: TermsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations();

  const lastUpdated = new Date().toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold">{t('terms.title')}</h1>
        <p className="text-muted-foreground">{t('terms.lastUpdated', { date: lastUpdated })}</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{locale === 'zh' ? '1. 条款接受' : '1. Acceptance of Terms'}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              {locale === 'zh'
                ? '欢迎使用我们的服务。通过访问或使用我们的服务，您同意受这些服务条款（"条款"）的约束。如果您不同意这些条款，请不要使用我们的服务。'
                : 'Welcome to our service. By accessing or using our service, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our service.'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{locale === 'zh' ? '2. 服务说明' : '2. Description of Service'}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              {locale === 'zh'
                ? '我们的服务是基于 Next.js 和 Cloudflare 基础设施构建的企业网站，为用户提供：'
                : 'Our service is a web application built on Next.js and Cloudflare infrastructure, providing users with:'}
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                {locale === 'zh' ? '产品和服务信息展示' : 'Product and service information display'}
              </li>
              <li>
                {locale === 'zh' ? '联系表单提交功能' : 'Contact form submission functionality'}
              </li>
              <li>
                {locale === 'zh' ? '文件上传和存储功能' : 'File upload and storage functionality'}
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{locale === 'zh' ? '3. 用户行为' : '3. User Conduct'}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>{locale === 'zh' ? '您同意不会：' : 'You agree not to:'}</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                {locale === 'zh'
                  ? '将服务用于任何非法或未经授权的目的'
                  : 'Use the service for any illegal or unauthorized purpose'}
              </li>
              <li>
                {locale === 'zh'
                  ? '尝试未经授权访问服务或相关系统'
                  : 'Attempt to gain unauthorized access to the service or related systems'}
              </li>
              <li>
                {locale === 'zh'
                  ? '干扰或破坏服务或服务器'
                  : 'Interfere with or disrupt the service or servers'}
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{locale === 'zh' ? '4. 免责声明' : '4. Disclaimers'}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              {locale === 'zh'
                ? '服务按"原样"和"可用"提供，不提供任何明示或暗示的保证。我们不保证服务将不间断、无错误或安全。'
                : 'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{locale === 'zh' ? '5. 联系我们' : '5. Contact Us'}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              {locale === 'zh'
                ? '如果您对这些条款有任何疑问，请通过我们的联系页面与我们联系。'
                : 'If you have any questions about these Terms, please contact us through our contact page.'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 flex justify-center gap-4">
        <Link href="/privacy" className="text-primary hover:underline">
          {t('footer.privacy')}
        </Link>
        <span className="text-muted-foreground">•</span>
        <Link href="/" className="text-primary hover:underline">
          {t('common.backHome')}
        </Link>
      </div>
    </div>
  );
}