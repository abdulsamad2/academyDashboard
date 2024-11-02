import { ScrollArea } from '@/components/ui/scroll-area';
import InvoicePage from '../component/invoicePage';


export default async function Page({ params }: any) {
  const id = params.studentId;
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-8">
        <InvoicePage studentId={id}/>
      </div>
    </ScrollArea>
  );
}
export const revalidate = 0;