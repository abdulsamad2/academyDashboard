import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata, Viewport } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';
import { auth } from '@/auth';
import DefaultColor from '@/lib/provider';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UHIL | Dashboard',
  description: 'UHIL Dashboard ',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
        <NextTopLoader showSpinner={false} />
        <DefaultColor>
          <Providers session={session}>
            <Toaster />
            {children}
          </Providers>
        </DefaultColor>
      </body>
    </html>
  );
}
