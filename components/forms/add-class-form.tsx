'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useToast } from '../ui/use-toast';
import InputformField from '../formField';
import SelectFormField from '../selectFromField';

const FormSchema = z.object({
  date: z.string(),
  starttime: z.string(),  // fixed typo
  endtime: z.string(),
  subjectId: z.string(),
  studentId: z.string(),
  description: z.string().min(1),
});

type classFormValue = z.infer<typeof FormSchema>;

interface classFormProps {
  initialData: classFormValue | null;
  subjects: any[];
  students: any[];
}

export const ClassForm: React.FC<classFormProps> = ({ initialData, subjects, students }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit class' : 'Add class';
  const description = initialData ? 'Edit a Class.' : 'Add a new Class';
  const toastMessage = initialData ? 'Class updated.' : 'Class Added.';
  const action = initialData ? 'Save changes' : 'Add';

  const defaultValues = initialData
    ? initialData
    : {
        date: '',
        starttime: '',
        endtime: '',
        subjectId: '',
        studentId: '',
        description: '',
      };

  const form = useForm<classFormValue>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const subjectsFormatted = subjects.map(item => ({
    value: item.id,
    label: item.name,
  }));

  const studentsFormatted = students.map(item => ({
    value: item.id,
    label: item.name,
  }));

  const onSubmit = async (data: classFormValue) => {
    try {
      setLoading(true);
      const res = { status: 'success', error: null, _id: 'XXX' };
      if (res.error) {
        toast({
          variant: 'destructive',
          title: res.error,
          description: 'There was a problem with your request.',
        });
      } else if (res.status === 'success') {
        toast({
          variant: 'default',
          title: toastMessage,
          description: 'Class details updated successfully',
        });
        router.refresh();
        router.push(`/dashboard/Students/${res._id}`);
      } else {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      // await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <Separator />
          <div className="gap-8 md:grid md:grid-cols-2">
            <InputformField
              type="date"
              control={form.control}
              loading={loading}
              label="Date"
              placeholder="Select a Date"
              name="date"
            />
            <InputformField
              type="time"
              control={form.control}
              loading={loading}
              label="Start Time"
              placeholder="Select a start time"
              name="starttime"
            />
            <InputformField
              type="time"
              control={form.control}
              loading={loading}
              label="End Time"
              placeholder="Select an end time"
              name="endtime"
            />
            <SelectFormField
              control={form.control}
              loading={loading}
              label="Student"
              placeholder="Select a student"
              name="studentId"
              options={studentsFormatted}
            />
            <SelectFormField
              control={form.control}
              loading={loading}
              label="Subject"
              placeholder="Select a subject"
              name="subjectId"
              options={subjectsFormatted}
            />
            <InputformField
              control={form.control}
              loading={loading}
              type="text"
              label="Description"
              placeholder="Enter a description"
              name="description"
            />
          </div>

          <Separator />
          <Button disabled={loading} className="ml-auto" type="submit">
            <Check className="mr-2 h-4 w-4" /> {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
