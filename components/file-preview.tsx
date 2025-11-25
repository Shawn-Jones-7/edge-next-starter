/**
 * FilePreview Component
 * Renders preview for uploaded files based on content type
 * Supports images, audio, video, and generic file links
 */

import Image from 'next/image';

interface FilePreviewProps {
  file: {
    url?: string;
    key: string;
    name?: string;
    contentType?: string;
  };
}

export function FilePreview({ file }: FilePreviewProps) {
  // Handle missing URL or content type
  if (!file.url || !file.contentType) {
    return (
      <div className="text-sm text-muted-foreground">File uploaded: {file.name || file.key}</div>
    );
  }

  // Image preview
  if (file.contentType.startsWith('image/')) {
    return (
      <Image
        src={file.url}
        alt={file.name || file.key}
        width={800}
        height={600}
        className="h-auto w-full max-w-xl rounded-md border"
      />
    );
  }

  // Audio preview
  if (file.contentType.startsWith('audio/')) {
    return (
      <audio controls className="w-full">
        <source src={file.url} type={file.contentType} />
        Your browser does not support the audio element.
      </audio>
    );
  }

  // Video preview
  if (file.contentType.startsWith('video/')) {
    return (
      <video controls className="w-full max-w-xl rounded-md border">
        <source src={file.url} type={file.contentType} />
        Your browser does not support the video tag.
      </video>
    );
  }

  // Generic file link
  return (
    <a href={file.url} target="_blank" rel="noreferrer" className="text-primary underline">
      Open file
    </a>
  );
}
