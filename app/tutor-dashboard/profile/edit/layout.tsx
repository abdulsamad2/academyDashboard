// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required


interface layoutProps{
  children: React.ReactNode;
  params: any;
}


export default async function Layout({ children, params }:layoutProps) {
 
  return (
    <>
        <main className="flex-1 max-w-screen-md mx-auto overflow-x-hidden pt-16">{children}</main>
     
    </>
  );
}
