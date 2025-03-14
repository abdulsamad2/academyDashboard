'use client';

import { ThemeProvider } from 'next-themes';
;

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
