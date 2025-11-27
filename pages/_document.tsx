/**
 * Custom Document
 * This file is intentionally left minimal to prevent Next.js from checking for Html component imports
 * from @react-email/render during the build process
 */
import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
