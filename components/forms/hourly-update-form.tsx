'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Check, Loader2,  } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import InputformField from '../formField';
import { updateTutorHourlyRate } from '@/action/tutorHourly';
import { useRouter } from 'next/navigation';


export const FormSchema = z.object({
  hourly: z.string().min(1, "Hourly rate is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Hourly rate must be a positive number",
  }),
});

type HourlyFormValue = z.infer<typeof FormSchema>;

interface HourlyUpdateFormProps {
  initialData: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export const HourlyUpdateForm: React.FC<HourlyUpdateFormProps> = ({ initialData, isOpen, onClose }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const action = initialData ? 'Update' : 'Add';
  const router = useRouter();

  const form = useForm<HourlyFormValue>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      hourly: initialData?.hourly || '', // Use initialData.hourly or an empty string
    },
  });
  

  const onSubmit = async (data: HourlyFormValue) => {
    try {
      setLoading(true);
      // Simulate API call
      await updateTutorHourlyRate(initialData.id, data.hourly);
      toast({
        title: "Success",
        description: `Hourly rate ${action.toLowerCase()}ed: $${data.hourly}/hour`,
      });
      onClose();
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem updating your hourly rate.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{action} Hourly Rate</DialogTitle>
          <DialogDescription>
            Enter the hourly rate for the tutor.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
           <InputformField loading={false} label={'Hourly Rate'} placeholder={'00.0'} type={'text'} name={'hourly'} control={form.control}           
           />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" /> {action} Rate
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};