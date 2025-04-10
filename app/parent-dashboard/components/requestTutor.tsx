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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, GraduationCap, MapPin, User, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const LocationOptions = [
  { label: 'Online Tuition', value: 'online' },
  { label: 'Home Tuition', value: 'home' },
  { label: 'Center Tuition', value: 'center' }
] as const;

const level = [
  { label: 'Below 6 years old', value: 'below_6_years_old' },
  { label: 'Standard 1', value: 'standard_1' },
  { label: 'Standard 2', value: 'standard_2' },
  { label: 'Standard 3', value: 'standard_3' },
  { label: 'Standard 4', value: 'standard_4' },
  { label: 'Standard 5', value: 'standard_5' },
  { label: 'Standard 6', value: 'standard_6' },
  { label: 'Form 1', value: 'form_1' },
  { label: 'Form 2', value: 'form_2' },
  { label: 'Form 3', value: 'form_3' },
  { label: 'Form 4', value: 'form_4' },
  { label: 'Form 5', value: 'form_5' },
  { label: 'Matric / Diploma', value: 'matric_diploma' },
  { label: 'Degree', value: 'degree' },
  { label: 'Adult', value: 'adult' },
  { label: 'other', value: 'other' }
] as const;

const gender = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' }
];
export const FormSchema = z
  .object({
    start: z.date().min(new Date(1), { message: 'Please select a start date' }),
    subject: z.string().min(1, { message: 'Please select a subject' }),
    level: z.string().min(1, { message: 'Please select an education level' }),
    mode: z.string().min(1, { message: 'Please select a mode' }),
    requriments: z.string().min(3, { message: 'Add more details' }),
    studentgender: z.string().min(1, { message: 'Please select a gender' }),
    tutorgender: z.string().min(1, { message: 'Please select a gender' }),
    lastscore: z.string().min(1, { message: 'Please select a last score' }),

    // need to add data time for start

    location: z.string().min(1, { message: 'Please select a location' }),
    studentName: z
      .string()
      .min(1, { message: 'Please enter the student name' }),
    studentAge: z
      .string()
      .min(1, { message: 'Please enter a valid age' })
      .refine(
        (value) => {
          const age = parseInt(value, 10);
          return age >= 4; // Ensure age is greater than or equal to 4
        },
        { message: 'Age must be at least 4 years old' }
      ),
    dayAvailable: z.string().min(1, { message: 'Please enter available days' }),
    timeRange: z.string().min(1, { message: 'Please enter the time range' }),
    hoursPerSession: z
      .string()
      .min(1, { message: 'Please enter hours per session' }),
    sessionsPerWeek: z
      .string()
      .min(1, { message: 'Please enter sessions per week' }),
    sessionsPerMonth: z
      .string()
      .min(1, { message: 'Please enter sessions per month' })
  })
  .refine((data) => data.subject !== 'Select Subject', {
    message: 'Please select a subject',
    path: ['subject']
  });

type TutorRequestFormValues = z.infer<typeof FormSchema>;

interface TutorRequestFormProps {
  initialData: TutorRequestFormValues | null;
  id?: string;
  onSuccess: () => void;
}

export const RequestTutorForm: React.FC<TutorRequestFormProps> = ({
  initialData,
  onSuccess,
  id
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const action = initialData ? 'Save changes' : 'Submit request';

  const defaultValues = initialData
    ? initialData
    : {
        subject: '',
        studentgender: 'Male',
        tutorgender: 'Female',
        lastscore: '',
        level: '',
        mode: '',
        requriments: '',
        start: new Date(),
        location: '',
        studentName: '',
        studentAge: String(0),
        dayAvailable: '',
        timeRange: '',
        hoursPerSession: '1',
        sessionsPerWeek: '1',
        sessionsPerMonth: '1'
      };

  const form = useForm<TutorRequestFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues
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
        router.push('/parent-dashboard');
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Student Information Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Student Information</h3>
          </div>
          <Separator className="mb-4" />
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputformField
              control={form.control}
              loading={loading}
              label="Student Name"
              name="studentName"
              placeholder="E.g. Arfa Kareem"
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
            <SelectFormField
              control={form.control}
              loading={loading}
              label="Gender"
              name="studentgender"
              options={gender}
              placeholder="Student Gender"
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Education Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <ScrollArea className="h-[200px] w-full">
                        {level.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <InputformField
              type="text"
              control={form.control}
              loading={loading}
              label="Last Score or Grade"
              name="lastscore"
              placeholder="E.g. 80% or A"
            />
          </div>
        </div>

        {/* Tutoring Requirements Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Tutoring Requirements</h3>
          </div>
          <Separator className="mb-4" />
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectFormField
              control={form.control}
              loading={loading}
              label="Mode of Tutoring"
              name="mode"
              options={LocationOptions}
              placeholder="Select mode of tuition"
            />
            <InputformField
              type="text"
              control={form.control}
              loading={loading}
              label="Subject"
              name="subject"
              placeholder="E.g. Mathematics, Physics, English"
            />
            <SelectFormField
              control={form.control}
              loading={loading}
              label="Preferred Tutor Gender"
              name="tutorgender"
              options={[
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Any', value: 'any' }
              ]}
              placeholder="Select your preferred tutor's gender"
            />
            <InputformField
              control={form.control}
              loading={loading}
              label="Address/Location"
              name="location"
              placeholder="E.g. Jalan Sulaiman 3, Taman Putra Sulaiman, Ampang"
              type="text"
            />
          </div>
        </div>

        {/* Schedule Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Schedule & Timing</h3>
          </div>
          <Separator className="mb-4" />
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputformField
              control={form.control}
              loading={loading}
              label="Start Date"
              name="start"
              placeholder="When do you want to start classes"
              type="date"
            />
            <InputformField
              control={form.control}
              loading={loading}
              label="Available Days"
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
            <SelectFormField
              control={form.control}
              loading={loading}
              label="Session Duration"
              name="hoursPerSession"
              placeholder="Select the duration of your session"
              options={[
                { label: '30 minutes', value: '0.5' },
                { label: '1 hour', value: '1' },
                { label: '1 hour and 30 minutes', value: '1.5' },
                { label: '2 hours', value: '2' },
                { label: '2 hours and 30 minutes', value: '2.5' },
                { label: '3 hours', value: '3' },
                { label: '3 hours and 30 minutes', value: '3.5' },
                { label: '4 hours', value: '4' }
              ]}
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
          </div>
        </div>

        {/* Additional Requirements */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Additional Requirements</h3>
          </div>
          <Separator className="mb-4" />

          <Card className="border-dashed">
            <CardContent className="pt-6">
              <Label htmlFor="requriments" className="mb-2 block">
                Special Requirements or Instructions
              </Label>
              <Textarea
                id="requriments"
                {...form.register('requriments')}
                className="min-h-[120px] resize-none"
                placeholder="E.g. Need a math teacher willing to take online classes and must know Mandarin. The student needs more help with algebra and geometry."
              />
              {form.formState.errors.requriments && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.requriments.message}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            className="min-w-[150px]"
            type="submit"
            disabled={loading}
            size="lg"
          >
            {loading ? 'Please wait...' : action}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RequestTutorForm;
