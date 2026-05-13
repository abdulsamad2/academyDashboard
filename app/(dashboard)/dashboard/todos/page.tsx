import { Breadcrumbs } from '@/components/breadcrumbs';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import NewTaskDialog from '@/components/kanban/new-task-dialog';
import { PageHeader } from '@/components/ui/page-header';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Todos', link: '/dashboard/todos' }
];

export default function Page() {
  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Todos"
        description="Manage your daily tasks"
        actions={<NewTaskDialog />}
      />
      <KanbanBoard />
    </>
  );
}
