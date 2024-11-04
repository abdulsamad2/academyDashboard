'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tutor } from '@prisma/client';
import { deleteDb } from '@/action/factoryFunction';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  PlusCircle, 
  BookOpen, 
  UserPlus,
  Loader2
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface CellActionProps {
  data: Tutor;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);
      //@ts-ignore
      const res = await deleteDb(data?.id, 'student');
      if (res) {
        router.refresh();
        toast({
          title: "Student deleted",
          description: "The student has been successfully removed.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem deleting the student.",
        variant: "destructive",
      });
    } finally {
      setOpen(false);
      setLoading(false);
    }
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
          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Student Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push(`/tutor-dashboard/lesson/${data.id}`)}
            className="cursor-pointer"
          >
            <PlusCircle className="mr-2 h-4 w-4 text-green-500" />
            Add New Lesson
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/tutor-dashboard/lesson/?id=${data.id}`)}
            className="cursor-pointer"
          >
            <BookOpen className="mr-2 h-4 w-4 text-purple-500" />
            View All Lessons
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setOpen(true)}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            {loading ? 'Deleting...' : 'Delete Student'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};