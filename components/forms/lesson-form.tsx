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
import { Check } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'; // Add this import
import { useForm } from 'react-hook-form';
import { useToast } from '../ui/use-toast';
import InputformField from '../formField';
import { Textarea } from '../ui/textarea';
import { addLesson, updateLesson } from '@/action/addLesson';
import { useSession } from 'next-auth/react';
import SelectFormField from '../selectFromField';
import { getTutorHourlyForThisStudent } from '@/action/tutorHourly';

// Updated schema with more strict subject validation
const FormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  date: z.date().min(new Date(1), { message: 'Please select a class date' }),
  description: z.string().min(1, 'Description is required'),
  startTime: z.string().min(1, { message: 'Please select a start time' }),
  endTime: z.string().min(1, { message: 'Please select an end time' }),
  subject: z.string().min(1, 'Subject selection is required')
});

type LessonFormValue = z.infer<typeof FormSchema>;

interface LessonFormProps {
  initialData: {
    studentId?: string;
    tutorId?: string;
    [key: string]: any;
  } | null;
  subjects: any[];
}

export const LessonForm: React.FC<LessonFormProps> = ({
  initialData,
  subjects
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [tutorhourly, setTutorHourly] = useState<number | undefined>(undefined);

  const title = initialData ? 'Edit lesson' : 'Add lesson';
  const description = initialData ? 'Edit a Lesson.' : 'Add a new lesson';
  const toastMessage = initialData ? 'Lesson updated.' : 'Lesson Added.';
  const action = initialData ? 'Save changes' : 'Add';
  const studentId = (Array.isArray(params.studentId) ? params.studentId[0] : params.studentId || initialData?.studentId) as string;
  //@ts-ignore
  const tutorId = initialData?.tutorId || session?.id;

  useEffect(() => {
    const getTutorHourly = async () => {
      //@ts-ignore
      const tutorhourly = await getTutorHourlyForThisStudent(
        studentId as string,
        tutorId
      );
      setTutorHourly(tutorhourly);
    };
    getTutorHourly();
    //@ts-ignore
  }, [studentId, tutorId]);

  // Format initial time values if they exist
  const formatTimeFromDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const defaultValues = {
    name: initialData?.name || '',
    date: initialData?.date ? new Date(initialData.date) : new Date(),
    description: initialData?.description || '',
    subject: initialData?.subject || '',
    startTime: initialData?.startTime
      ? formatTimeFromDate(initialData.startTime)
      : '',
    endTime: initialData?.endTime ? formatTimeFromDate(initialData.endTime) : ''
  };

  // Format subject options
  const formattedSubjects =
    subjects?.map((item: any) => ({
      value: item,
      label: item
    })) || [];

  // If initial data has subject, format it
  const initialSubjectOptions =
    initialData?.subject?.map((item: any) => ({
      value: item,
      label: item
    })) || formattedSubjects;

  const form = useForm<LessonFormValue>({
    resolver: zodResolver(FormSchema), // Add resolver here
    defaultValues
  });

  const onSubmit = async (data: LessonFormValue) => {
    try {
      setLoading(true);

      // Validate subject is selected
      if (!data.subject) {
        toast({
          variant: 'destructive',
          title: 'Subject Required',
          description: 'Please select a subject for the lesson'
        });
        return;
      }

      // Create date objects for start and end times
      const [startHours, startMinutes] = data.startTime.split(':').map(Number);
      const [endHours, endMinutes] = data.endTime.split(':').map(Number);

      const startDateTime = new Date(data.date);
      startDateTime.setHours(startHours, startMinutes, 0);

      const endDateTime = new Date(data.date);
      endDateTime.setHours(endHours, endMinutes, 0);

      // Calculate duration in minutes
      const durationMs = endDateTime.getTime() - startDateTime.getTime();
      const durationMinutes = Math.floor(durationMs / (1000 * 60));

      // Validate that end time is after start time
      if (durationMinutes <= 0) {
        toast({
          variant: 'destructive',
          title: 'Invalid Time Selection',
          description: 'End time must be after start time'
        });
        return;
      }

      const formattedData = {
        ...data,
        studentId: studentId,
        //@ts-ignore
        tutorId: tutorId || session?.id,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        totalDuration: durationMinutes,
        tutorhourly
      };

      const isUpdating = Boolean(initialData?.lessonId);
      const res = await (isUpdating
        ? updateLesson(initialData?.lessonId, formattedData)
        : addLesson(formattedData));

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
        router.refresh();
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
          <SelectFormField
            name="subject"
            label="Select Subject *"
            options={initialSubjectOptions}
            control={form.control}
            placeholder="Select a subject (required)"
          />
          <InputformField
            control={form.control}
            loading={loading}
            label="Date"
            placeholder="Select date of lesson"
            type="date"
            name="date"
          />
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <input
                    type="time"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <input
                    type="time"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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

export default LessonForm;
