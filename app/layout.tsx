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
      {/* 
        Using bg-transparent allows the iframe to perfectly blend with Quasarzone's 
        user-selected theme (light/dark base). We force dark mode elements internally.
      */}
      <body className="antialiased bg-transparent text-zinc-100 border-none m-0 p-0 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
