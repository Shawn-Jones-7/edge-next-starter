'use client';

/* eslint-disable max-lines-per-function */
import * as React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Subject options that match API expectations
const SUBJECT_OPTIONS = ['product', 'support', 'partnership', 'pricing', 'other'] as const;

// Form schema factory - creates schema with translated error messages
function createFormSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(1, t('contact.form.nameRequired')),
    email: z.string().min(1, t('contact.form.emailRequired')).email(t('contact.form.emailInvalid')),
    phone: z.string().optional(),
    company: z.string().optional(),
    subject: z.enum(SUBJECT_OPTIONS, t('contact.form.subjectRequired')),
    message: z
      .string()
      .min(1, t('contact.form.messageRequired'))
      .min(10, t('contact.form.messageMinLength')),
  });
}

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

interface ContactFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function ContactForm({ onSuccess, onError }: ContactFormProps) {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const formSchema = React.useMemo(() => createFormSchema(t), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: undefined,
      message: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(errorData.error || 'Failed to send message');
      }

      setSubmitStatus('success');
      form.reset();
      onSuccess?.();
    } catch (error) {
      setSubmitStatus('error');
      onError?.(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  }

  // Show success message
  if (submitStatus === 'success') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950">
        <h3 className="mb-2 text-lg font-semibold text-green-800 dark:text-green-200">
          {t('contact.success.title')}
        </h3>
        <p className="text-green-700 dark:text-green-300">{t('contact.success.description')}</p>
        <Button variant="outline" className="mt-4" onClick={() => setSubmitStatus('idle')}>
          {t('contact.form.submit')}
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Error banner */}
        {submitStatus === 'error' && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
            <p className="text-sm text-red-700 dark:text-red-300">
              {t('contact.error.description')}
            </p>
          </div>
        )}

        {/* Name field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('contact.form.name')} *</FormLabel>
              <FormControl>
                <Input placeholder={t('contact.form.namePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('contact.form.email')} *</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t('contact.form.emailPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone and Company in a row on larger screens */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Phone field (optional) */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('contact.form.phone')}</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder={t('contact.form.phonePlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Company field (optional) */}
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('contact.form.company')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('contact.form.companyPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Subject select */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('contact.form.subject')} *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('contact.form.subjectPlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SUBJECT_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t(`contact.form.subjectOptions.${option}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message textarea */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('contact.form.message')} *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('contact.form.messagePlaceholder')}
                  className="min-h-[120px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
        </Button>
      </form>
    </Form>
  );
}
