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
import { Check } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useToast } from '../ui/use-toast';
import InputformField from '../formField';
import { Textarea } from '../ui/textarea';
import { addLesson } from '@/action/addLesson';
import { useSession } from 'next-auth/react';


const FormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(1, 'Description is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  // Add more fields as needed
});

type lessonFormValue = z.infer<typeof FormSchema>;

interface LessonFormProps {
  initialData: lessonFormValue | null;
}
export const LessonForm: React.FC<LessonFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const title = initialData ? 'Edit lesson' : 'Add lesson';
  const description = initialData ? 'Edit a Lesson.' : 'Add a new lesson';
  const toastMessage = initialData ? 'Lesson updated.' : 'Lesson Added.';
  const action = initialData ? 'Save changes' : 'Add';

  const defaultValues = initialData || {
    name: '',
    date: '',
    description: '',
    startTime: '',
    endTime: '',
  };

  const form = useForm<lessonFormValue>({
    resolver: zodResolver(FormSchema),
    defaultValues
  });

  const onSubmit = async (data: lessonFormValue) => {
    // Combine the date and time fields into full date-time strings
    const startDateTime = new Date(`${data.date}T${data.startTime}:00`).toISOString();
    const endDateTime = new Date(`${data.date}T${data.endTime}:00`).toISOString();
  
    const formattedData = {
      ...data,
      studentId: params.studentId,
      //@ts-ignore
      tutorId: session?.id, // Correct session object access
      startTime: startDateTime, // Set the formatted ISO start time
      endTime: endDateTime,     // Set the formatted ISO end time
    };
  

    try {
      setLoading(true);
      const res = await addLesson(formattedData);

      if (res.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: res.error || 'There was a problem with your request.'
        });
      } else if (res.status === 'success') {
        toast({
          variant: 'default',
          title: toastMessage,
          description: 'Lesson details updated successfully'
        });
        // Optional: handle navigation or refresh after success
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.'
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        <Separator />

        <div className="gap-10 py-4 md:grid md:grid-cols-2">
          <InputformField
            control={form.control}
            loading={true}
            label="Student Name"
            placeholder="Yaseen"
            type="text"
            name="name"
          />
          <InputformField
            control={form.control}
            loading={loading}
            label="Date"
            placeholder="Select date of lesson"
            type="date"
            name="date"
          />
          <InputformField
            control={form.control}
            loading={loading}
            label="Start Time"
            placeholder="Select start time of lesson"
            type="time"
            name="startTime" // Corrected field name
          />
          <InputformField
            control={form.control}
            loading={loading}
            label="End Time"
            placeholder="Select end time of lesson"
            type="time"
            name="endTime" // Corrected field name
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Lesson Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Conducted lesson and taught algebra chapter one to student"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button disabled={loading} className="ml-auto mt-10" type="submit">
          <Check className="mr-2 h-4 w-4" /> {action}
        </Button>
      </form>
    </Form>
  );
};