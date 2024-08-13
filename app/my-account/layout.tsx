// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required

import Header from '@/components/layout/header';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <main className="flex-1 overflow-hidden pt-16">{children}</main>
      </div>
    </>
  );
}
