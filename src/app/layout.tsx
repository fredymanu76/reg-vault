import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'REG-VAULT | AI-Driven FCA Authorisation Platform',
  description: 'A regulator-grade, AI-driven FCA application production platform with human verification, full auditability, and traceability to regulation.',
  keywords: ['FCA', 'authorisation', 'regulatory', 'compliance', 'fintech', 'payment services'],
  authors: [{ name: 'REG-VAULT' }],
  icons: {
    icon: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
