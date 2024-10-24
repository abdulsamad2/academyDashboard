'use client';
import { deleteDb } from '@/action/factoryFunction';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Employee } from '@/constants/data';
import { Tutor } from '@prisma/client';
import { Edit, MoreHorizontal, Plus, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

interface CellActionProps {
  data: Tutor;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    setLoading(true);
    //@ts-ignore

    const res = await deleteDb(data?.id, 'student');
    if (res) {
      router.refresh();
    }
    setOpen(false);
    setLoading(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem  onClick={() => router.push(`/tutor-dashboard/lesson/${data.id}`)}>
            <Plus className="mr-2 h-4 w-4" />
            {loading ? '...' : ''} Add Lesson
          </DropdownMenuItem>
          <DropdownMenuItem  onClick={() => router.push(`/tutor-dashboard/lesson/?id=${data.id}`)}>
            <Plus className="mr-2 h-4 w-4" />
            {loading ? '...' : ''} View All Lesson for this student
          </DropdownMenuItem>
        
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
