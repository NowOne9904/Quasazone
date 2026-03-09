import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Quasarzone Widget',
  description: 'Smart PC quote widget for Quasarzone',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased bg-gray-50 text-gray-900 border-none m-0 p-0">
        {children}
      </body>
    </html>
  );
}
