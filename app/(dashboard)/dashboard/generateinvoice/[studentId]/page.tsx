import { ScrollArea } from '@/components/ui/scroll-area';
import ModernInvoicePage from '../component/invoicePage';


// In your page.tsx for the invoice page route
interface PageProps {
  params: {
    studentId: string;
  };
  searchParams: {
    month?: string;
    year?: string;
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { studentId } = params;
  const month = searchParams.month ? parseInt(searchParams.month) : undefined;
  const year = searchParams.year ? parseInt(searchParams.year) : undefined;
  
  return (
    <ModernInvoicePage 
      studentId={studentId} 
      initialMonth={month} 
      initialYear={year}
    />
  );
}