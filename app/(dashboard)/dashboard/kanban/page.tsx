import { Breadcrumbs } from '@/components/breadcrumbs';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import NewTaskDialog from '@/components/kanban/new-task-dialog';
import { PageHeader } from '@/components/ui/page-header';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Kanban', link: '/dashboard/kanban' }
];

export default function Page() {
  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Kanban"
        description="Drag-and-drop task management"
        actions={<NewTaskDialog />}
      />
      <KanbanBoard />
    </>
  );
}
