import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';
import { auth } from '@/auth';
import DefaultColor from '@/lib/provider';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UHIL | Dashboard',
  description: 'UHIL Dashboard '
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <DefaultColor>
        <body className={`${inter.className} overflow-hidden`}>
          <NextTopLoader showSpinner={false} />
          <Providers session={session}>
            <Toaster />
            {children}
          </Providers>
        </body>
      </DefaultColor>
    </html>
  );
}
