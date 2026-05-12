import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuthHero } from './auth-hero';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthShell({
  title,
  subtitle,
  children,
  footer
}: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <AuthHero />

      <div className="relative flex min-h-screen flex-col bg-background">
        {/* Mobile gradient strip */}
        <div className="absolute inset-x-0 top-0 -z-10 h-48 bg-[linear-gradient(135deg,hsl(221_83%_53%/0.18),hsl(280_70%_55%/0.1))] lg:hidden" />

        {/* Mobile brand row */}
        <div className="flex items-center justify-between px-6 pt-6 lg:hidden">
          <Link
            href="https://uhilacademy.com"
            className="flex items-center gap-2"
          >
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-card p-1 shadow-elevated ring-1 ring-border">
              <Image
                src="/logo.jpg"
                alt="UHIL Academy logo"
                width={28}
                height={28}
                className="h-full w-full object-contain"
              />
            </span>
            <span className="font-semibold tracking-tight text-foreground">
              UHIL Academy
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-12">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                {title}
              </h2>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>

            {children}

            {footer ? (
              <div className="pt-2 text-center text-sm text-muted-foreground">
                {footer}
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-border/60 px-6 py-4 text-center text-xs text-muted-foreground sm:px-10 lg:px-12">
          By continuing, you agree to our{' '}
          <Link
            href="/terms"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Terms
          </Link>{' '}
          &{' '}
          <Link
            href="/privacy"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
