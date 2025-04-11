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
import { useForm } from 'react-hook-form';
import { useToast } from '../ui/use-toast';
import InputformField from '../formField';
import { Textarea } from '../ui/textarea';
import { addLesson, updateLesson } from '@/action/addLesson';
import { useSession } from 'next-auth/react';
import SelectFormField from '../selectFromField';
import { getTutorHourlyForThisStudent } from '@/action/tutorHourly';
import AdminRestrictedDateField from '@/components/adminRestrictedDateField';
import { TimePicker } from '../time-picker';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Updated schema to handle time as strings with more specific validation
const FormSchema = z.object({
  name: z.string().min(1, 'Student name is required').max(100, 'Name is too long'),
  date: z.date({
    required_error: 'Please select a class date',
    invalid_type_error: 'Please select a valid date'
  }).min(new Date(1), { message: 'Please select a valid date' }),
  description: z.string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  startTime: z.string().min(1, { message: 'Start time is required' }),
  endTime: z.string().min(1, { message: 'End time is required' }),
  subject: z.string().min(1, 'Subject is required')
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

export const LessonForm: React.FC<LessonFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [tutorhourly, setTutorHourly] = useState<number | undefined>(undefined);

  const isEditing = Boolean(initialData?.lessonId);
  const title = isEditing ? 'Edit Lesson' : 'Add New Lesson';
  const description = isEditing 
    ? 'Edit the details of an existing lesson.' 
    : 'Create a new lesson for your student.';
  const toastMessage = isEditing ? 'Lesson updated.' : 'Lesson Added.';
  const action = isEditing ? 'Save Changes' : 'Create Lesson';
  const studentId = initialData?.studentId || params.studentId;
  //@ts-ignore
  const isAdmin = session?.role === 'admin';

  //@ts-ignore
  const tutorId = initialData?.tutorId || session?.id;

  useEffect(() => {
    const getTutorHourly = async () => {
      const tutorhourly = await getTutorHourlyForThisStudent(
        //@ts-ignore
        studentId,
        tutorId
      );
      setTutorHourly(tutorhourly);
    };
    getTutorHourly();
    //@ts-ignore
  }, [studentId, tutorId]);


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
   name: initialData?.name || initialData?.student?.name || '',
   date: initialData?.date ? new Date(initialData.date) : new Date(),
   description: initialData?.description || '',
   subject: initialData?.subj || '',
   startTime: initialData?.startTime
     ? formatTimeFromDate(initialData.startTime)
     : '',
   endTime: initialData?.endTime ? formatTimeFromDate(initialData.endTime) : ''
 };

  const formateSubject = initialData?.subject?.map((item: any) => ({
    value: item,
    label: item
  }));

  const form = useForm<LessonFormValue>({
    defaultValues,
    resolver: zodResolver(FormSchema),
    mode: "onBlur"
  });

  const onSubmit = async (data: LessonFormValue) => {
    try {
      setLoading(true);

      // Validate all required fields
      const missingFields = [];
      if (!data.name) missingFields.push('Student Name');
      if (!data.subject) missingFields.push('Subject');
      if (!data.date) missingFields.push('Date');
      if (!data.startTime) missingFields.push('Start Time');
      if (!data.endTime) missingFields.push('End Time');
      if (!data.description) missingFields.push('Description');

      if (missingFields.length > 0) {
        setLoading(false);
        toast({
          variant: 'destructive',
          title: 'Missing Required Fields',
          description: `Please fill in all required fields: ${missingFields.join(', ')}`
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
        setLoading(false);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
          <div className="space-y-2 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
          </div>
          
          {form.formState.errors && Object.keys(form.formState.errors).length > 0 && (
            <Alert variant="destructive" className="mb-4 sm:mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">
                Please fill in all required fields marked with *
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div className="space-y-4 sm:space-y-6">
              <div className="grid gap-4">
                <InputformField
                  control={form.control}
                  loading={initialData ? true : false}
                  label="Student Name *"
                  placeholder="Enter student name"
                  type="text"
                  name="name"
                  className="w-full"
                />
                <SelectFormField
                  name="subject"
                  label="Select Subject *"
                  options={formateSubject}
                  control={form.control}
                  className="w-full"
                />
                <AdminRestrictedDateField
                  name={'date'}
                  label={'Date *'}
                  placeholder={'Select Date'}
                  control={form.control}
                  isAdmin={isAdmin}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TimePicker
                    control={form.control}
                    name="startTime"
                    label="Start Time *"
                    className="w-full"
                  />
                  <TimePicker 
                    control={form.control} 
                    name="endTime" 
                    label="End Time *"
                    className="w-full"
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Add Lesson Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter lesson details (e.g., Conducted lesson and taught algebra chapter one to student)"
                          className="resize-none min-h-[100px] sm:min-h-[120px] w-full"
                          {...field}
                        />
                      </FormControl>
                      <div className="flex items-center justify-between mt-1">
                        <FormMessage className="text-xs" />
                        <p className="text-xs text-muted-foreground">
                          {field.value?.length || 0}/500 characters
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-end gap-4 border-t pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={loading}
              className="w-full sm:w-auto min-w-[100px]"
            >
              Cancel
            </Button>
            <Button 
              disabled={loading || !form.formState.isValid} 
              type="submit"
              className="w-full sm:w-auto min-w-[100px] bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  {action}
                </div>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" /> {action}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default LessonForm;
