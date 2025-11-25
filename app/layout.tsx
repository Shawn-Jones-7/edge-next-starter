/**
 * Root Layout
 * Global CSS imports only - locale-specific layout is in [locale]/layout.tsx
 */

import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
