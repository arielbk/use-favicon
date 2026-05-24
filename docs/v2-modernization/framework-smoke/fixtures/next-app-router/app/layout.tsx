import type { ReactNode } from 'react';

export const metadata = {
  title: 'use-favicon smoke test',
  description: 'Next.js App Router fixture for use-favicon smoke testing.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
