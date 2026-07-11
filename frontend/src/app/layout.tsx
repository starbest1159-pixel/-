import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TH77 Prime - Lottery Management Platform',
  description: 'Comprehensive lottery management platform for agents, masters, and admins',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
