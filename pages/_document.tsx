/**
 * Custom Document for Pages Router compatibility
 * This file is required to prevent Next.js internal error page generation from failing
 */

import { Html, Head, Main, NextScript } from 'next/document';

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
