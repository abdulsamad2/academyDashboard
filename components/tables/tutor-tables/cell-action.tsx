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
import { Tutor } from '@prisma/client';
import { Clock10Icon, Edit, Hourglass, MoreHorizontal, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HourlyUpdateForm } from '@/components/forms/hourly-update-form';

interface CellActionProps {
  data: Tutor;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
   
  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>      
      <DialogContent>
      <HourlyUpdateForm
        initialData={data} // or { hourly: '30.00' } if you have initial data
        isOpen={open}
        onClose={()=>{
          setOpen(false);
        }}
      />        
      </DialogContent>
    </Dialog>
     
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/tutor/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Clock10Icon className="mr-2 h-4 w-4" />
            {loading ? 'Updating...' : ''} Update hourly
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
