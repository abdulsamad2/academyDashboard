'use client';

import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

export default function DefaultColor({
  children,
  
}: {
  children: React.ReactNode;
}) {
  return (
      <ThemeProvider
        attribute="class"
        defaultTheme="light" 
        enableSystem={true}
      >
        {children}
      </ThemeProvider>

  );
}
