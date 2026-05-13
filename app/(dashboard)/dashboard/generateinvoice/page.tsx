import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import Link from 'next/link';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Generate invoice', link: '/dashboard/generateinvoice' }
];

export default function Page() {
  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Generate invoice"
        description="Create a new invoice for a parent"
      />
      <EmptyState
        icon={FileText}
        title="Start from a student"
        description="Pick a student from the Lessons page and click ‘Generate invoice’, or start a fresh invoice below."
        action={
          <Button asChild>
            <Link href="/dashboard/generateinvoice/new">New blank invoice</Link>
          </Button>
        }
      />
    </>
  );
}
