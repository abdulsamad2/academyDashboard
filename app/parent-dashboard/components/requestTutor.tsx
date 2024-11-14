'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import InputformField from '@/components/formField';
import { useToast } from '@/components/ui/use-toast';
import SelectFormField from '@/components/selectFromField';
import { jobCreation, updateJob } from '@/action/jobActions';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const LocationOptions = [
  { label: 'Online', value: 'online' },
  { label: 'At Home', value: 'home' },
  { label: 'At Nearest Tuition Center', value: 'center' }
] as const;

const EducationLevels = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Higher Secondary', value: 'higher_secondary' },
  { label: 'University', value: 'university' }
] as const;

export const FormSchema = z.object({
  start: z
    .date()
    .min(new Date(1), { message: 'Please select a start date' }),
  subject: z.string().min(1, { message: 'Please select a subject' }),
  level: z.string().min(1, { message: 'Please select an education level' }),
  mode: z.string().min(1, { message: 'Please select a mode' }),
  requriments: z.string().min(3, { message: 'Add more details' }),
  hourly: z.string().min(1, { message: 'Please select an hourly rate' }),
  // need to add data time for start

  location: z.string().min(1, { message: 'Please select a location' }),
  studentName: z.string().min(1, { message: 'Please enter the student name' }),
  studentAge: z.string().min(1, { message: 'Please enter a valid age' }),
  dayAvailable: z.string().min(1, { message: 'Please enter available days' }),
  timeRange: z.string().min(1, { message: 'Please enter the time range' }),
  hoursPerSession: z.string().min(1, { message: 'Please enter hours per session' }),
  sessionsPerWeek: z.string().min(1, { message: 'Please enter sessions per week' }),
  sessionsPerMonth: z.string().min(1, { message: 'Please enter sessions per month' }),
}).refine((data) => data.subject !== 'Select Subject', {
  message: 'Please select a subject',
  path: ['subject']
});

type TutorRequestFormValues = z.infer<typeof FormSchema>;

interface TutorRequestFormProps {
  initialData: TutorRequestFormValues | null;
  id?: string
  onSuccess: () => void;
}

export const RequestTutorForm: React.FC<TutorRequestFormProps> = ({
  initialData, onSuccess, id
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const action = initialData ? 'Save changes' : 'Submit request';

  const defaultValues = initialData
    ? initialData
    : {
      subject: '',
      level: '',
      mode: '',
      requriments: '',
      hourly: '',
      start: new Date(),
      location: '',
      studentName: '',
      studentAge: String(0),
      dayAvailable: '',
      timeRange: '',
      hoursPerSession: '1',
      sessionsPerWeek: '1',
      sessionsPerMonth: '1',

    };

  const form = useForm<TutorRequestFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const onSubmit = async (data: TutorRequestFormValues) => {
    try {
      setLoading(true);
      let res;

      if (initialData) {
        //@ts-ignore
        res = await updateJob({ id: initialData.id, ...data });
      } else {
        res = await jobCreation({ ...data });
      }
              //@ts-ignore

      if (!res.error) {
        onSuccess();
        toast({
          variant: 'default',
          title: 'Success',
          description: 'Request submitted successfully'
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
      <form onSubmit={form.handleSubmit(onSubmit)} className=" grid grid-cols-1 items-center justify-around md:grid-cols-2 gap-2">
        <InputformField
          type="text"
          control={form.control}
          loading={loading}
          label="Subject"
          name="subject"
          placeholder="E.g. Maths"
        />
        <SelectFormField
          control={form.control}
          loading={loading}
          label="Student Level"
          name="level"
          options={EducationLevels}
          placeholder="Please Select Student Level"
        />
        <SelectFormField
          control={form.control}
          loading={loading}
          label="Mode"
          name="mode"
          options={LocationOptions}
          placeholder="Select mode of tuition"
        />
        <InputformField
          control={form.control}
          loading={loading}
          label="When do you want your kids to start class"
          name="start"
          placeholder="E.g. 1st January 2024"
          type="date"
        />
        <InputformField
          control={form.control}
          loading={loading}
          label="Location"
          name="location"
          placeholder="E.g. Jalan Sulaiman 3, Taman Putra Sulaiman, Ampang"
          type="text"
        />
        <InputformField
          control={form.control}
          loading={loading}
          label="Hourly Compensation for tutor"
          name="hourly"
          placeholder="E.g. 100"
          type="number"
        />
        <InputformField
          control={form.control}
          loading={loading}
          label="Student Name"
          name="studentName"
          placeholder="E.g. John Doe"
          type="text"
        />
        <InputformField
          control={form.control}
          loading={loading}
          label="Student Age"
          name="studentAge"
          placeholder="E.g. 12"
          type="number"
        />
        <InputformField
          control={form.control}
          loading={loading}
          label="Days Available"
          name="dayAvailable"
          placeholder="E.g. Monday, Wednesday, Friday"
          type="text"
        />
        <InputformField
          control={form.control}
          loading={loading}
          label="Time Range"
          name="timeRange"
          placeholder="E.g. 2:00 PM - 4:00 PM"
          type="text"
        />
        <InputformField
          control={form.control}
          loading={loading}
          label="Hours Per Session"
          name="hoursPerSession"
          placeholder="E.g. 2"
          type="number"
        />
        <InputformField
          control={form.control}
          loading={loading}
          label="Sessions Per Week"
          name="sessionsPerWeek"
          placeholder="E.g. 3"
          type="number"
        />
        <InputformField
          control={form.control}
          loading={loading}
          label="Sessions Per Month"
          name="sessionsPerMonth"
          placeholder="E.g. 12"
          type="number"
        />
        <div className='col-span-full'>
          <Label htmlFor="requriments">
            Additional Details or Requirements
          </Label>
          <Textarea
            id="requriments"
            {...form.register('requriments')}
            className="min-h-[100px]"
            placeholder="E.g. Need a math teacher willing to take online classes and must know Mandarin"
          />
          {form.formState.errors.requriments && (
            <p className="text-red-500">
              {form.formState.errors.requriments.message}
            </p>
          )}
        </div>
        <Button
          className="w-full justify-center"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Please wait...' : action}
        </Button>
      </form>
    </Form>
  );
};

export default RequestTutorForm;