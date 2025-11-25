/**
 * Upload Page
 * Simple UI to upload a file to R2 via /api/upload
 */

'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Link } from '@/i18n/navigation';
import { UploadService, type UploadResult } from '@/services';
import { useTranslations } from 'next-intl';

import { ApiError } from '@/lib/http';
import { FilePreview } from '@/components/file-preview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function UploadPage() {
  const t = useTranslations();
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [results, setResults] = useState<UploadResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  async function handleUpload() {
    if (!files || files.length === 0) {
      setError(t('upload.error.noFile'));
      return;
    }
    setIsUploading(true);
    setError(null);
    setResult(null);
    setIsAuthError(false);

    try {
      if (files.length === 1) {
        const uploadResult = await UploadService.uploadFile(files[0]!);
        setResult(uploadResult);
        setResults(null);
      } else {
        const uploadResults = await UploadService.uploadFiles(files);
        setResults(uploadResults);
        setResult(null);
      }
      setFiles(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e: unknown) {
      if (e instanceof ApiError) {
        if (e.statusCode === 401) {
          setError(e.message);
          setIsAuthError(true);
        } else {
          setError(e.message);
          setIsAuthError(false);
        }
      } else {
        const message = e instanceof Error ? e.message : t('upload.error.failed');
        setError(message);
        setIsAuthError(false);
      }
    } finally {
      setIsUploading(false);
    }
  }

  function handleLoginRedirect() {
    const callbackUrl = encodeURIComponent('/upload');
    router.push(`/login?callbackUrl=${callbackUrl}`);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('upload.title')}</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">{t('common.backHome')}</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="file"
              ref={fileInputRef}
              multiple
              onChange={(e) => setFiles(e.target.files || null)}
              disabled={isUploading}
            />
          </div>

          <Button onClick={handleUpload} disabled={isUploading || !files || files.length === 0}>
            {isUploading ? t('upload.uploading') : t('upload.upload')}
          </Button>

          {error && (
            <div className="space-y-3 rounded-md bg-destructive/15 p-4">
              <div className="text-sm text-destructive">{error}</div>
              {isAuthError && (
                <Button
                  onClick={handleLoginRedirect}
                  variant="default"
                  size="sm"
                  className="w-full"
                >
                  {t('upload.login')}
                </Button>
              )}
            </div>
          )}

          {result && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">{t('upload.success')}:</div>
              <pre className="overflow-auto rounded-md bg-muted p-3 text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
              {typeof result?.url === 'string' && result?.key && (
                <div className="space-y-2">
                  <div className="text-sm">{t('upload.preview')}</div>
                  <FilePreview file={result} />
                </div>
              )}
            </div>
          )}

          {results && results.length > 0 && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">{t('upload.success')}:</div>
              <div className="space-y-4">
                {results.map((item) => (
                  <div key={item.key} className="space-y-2">
                    <div className="text-sm font-medium">{item.name || item.key}</div>
                    <FilePreview file={item} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
