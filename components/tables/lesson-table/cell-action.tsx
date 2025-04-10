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
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePathname } from 'next/navigation';


interface CellActionProps {
  data: Tutor;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname()
  const router = useRouter();

  // get first two part of url tilll second /
  const url = path.split('/')[2];

  const onConfirm = async () => {
    setLoading(true);
    //@ts-ignore

    const res = await deleteDb(data?.id, 'lesson');
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
          <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px] rounded-md">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`${url}/update/${data.id}`)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setOpen(true)}
            className="cursor-pointer text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            {loading ? 'Deleting...' : 'Delete'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
