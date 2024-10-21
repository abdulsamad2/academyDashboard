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
import { useState, useEffect } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useToast } from '../ui/use-toast';
import InputformField from '../formField';
import SelectFormField from '../selectFromField';
import { studentRegistration } from '@/action/studentRegistration';
import MultiSelectFormField from '../ui/multi-select';

const MStates = [{ label: 'Kuala Lumpur', value: 'kl' }, { label: 'Selangor', value: 'sg' }, { label: 'Pulau Pinang', value: 'pp' }, { label: 'Johor', value: 'joh' }, { label: 'Perak', value: 'prk' }, { label: 'Melaka', value: 'mlk' }, { label: 'Negeri Sembilan', value: 'ns' }, { label: 'Terengganu', value: 'trg' }, { label: 'Kelantan', value: 'kltn' }, { label: 'Kedah', value: 'kd' }, { label: 'Perlis', value: 'pls' }, { label: 'Pahang', value: 'pah' }, { label: 'Sabah', value: 'sb' }, { label: 'Sarawak', value: 'srw' }] as const;

const Gender = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

const studyMode = [
  { label: 'Home Tuition', value: 'home' },
  { label: 'Online Tuition', value: 'online' },
  { label: 'Center Tuition', value: 'center' },
];

const level = [
  { label: 'Below 6 years / Children', value: 'kg' },
  { label: 'Primary School', value: 'primary' },
  { label: 'Secondary School', value: 'secondary' },
  { label: 'Diploma / Degree', value: 'degree' },
  { label: 'Adult', value: 'Adult' },
];

const sessionDuration = [
  { label: '0.5 hour /30 minutes', value: '0.5' },
  { label: '1 hour', value: '1' },
  { label: '1.5 hour', value: '1.5' },
  { label: '2 hour', value: '2' },
  { label: '2.5 hour', value: '2.5' },
  { label: '3 hour', value: '3' },
  { label: '3.5 hour', value: '3.5' },

];

const sessionFrequency = [
  { label: 'Once a week', value: '1' },
  { label: 'Twice a week', value: '2' },
  { label: '3 days in a week', value: '3' },
  { label: '4 days in a week', value: '4' },
  { label: 'daily', value: '5' },



] as const;

const FormSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  name: z.string().min(3, { message: 'Student Name must be at least 3 characters' }),
  state: z.string(),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  address: z.string().min(1, { message: 'Address must be at least 1 character' }),
  city: z.string().min(1, { message: 'City must be at least 1 character' }),
  gender: z.string(),
  studymode: z.string(),
  level: z.string(),
  school: z.string(),
  age: z.string(),
  sessionDuration: z.string(),
  sessionFrequency: z.string(),
  subject: z.array(z.string()),
});

type studentFormValue = z.infer<typeof FormSchema>;

interface StudentFormProps {
  initialData: studentFormValue | null;
  subject: { name: string }[]; // Assuming subject is an array of objects with 'name' property
}

export const StudentForm: React.FC<StudentFormProps> = ({ initialData, subject }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Edit Student' : 'Add Student';
  const description = initialData ? 'Edit a Student.' : 'Add a new Student';
  const toastMessage = initialData ? 'Student updated.' : 'Student Added.';
  const action = initialData ? 'Save changes' : 'Add';

  const formattedSubject = subject.map(item => ({
    value: item.name,
    label: item.name,
  }));

  const defaultValues = initialData
    ? initialData
    : {
      email: '',
      name: '',
      phone: '',
      state: '',
      address: '',
      city: '',
      gender: '',
      studymode: '',
      level: '',
      school: '',
      age: '',
      sessionDuration: '',
      sessionFrequency: '',
      subject: [],
    };

  const form = useForm<studentFormValue>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  // Log validation errors
  useEffect(() => {
    console.log('Form Errors:', form.formState.errors);
  }, [form.formState.errors]);

  const onSubmit = async (data: studentFormValue) => {
    try {
      setLoading(true);
      const res = await studentRegistration(data);

      if (res?.error) {
        toast({
          variant: 'destructive',
          title: res.error,
          description: 'There was a problem with your request.',
        });
      } else if (res?.success) {
        toast({
          variant: 'default',
          title: toastMessage,
          description: 'Student details updated successfully',
        });
        // Additional actions on success
      } else {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
        });
      }
    } catch (error) {
      console.error('Submission Error:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log('Validation Errors:', errors);
        })}
        className="w-full space-y-2"
      >
        <Separator />

        <div className="gap-8 md:grid md:grid-cols-3">
          <InputformField
            control={form.control}
            loading={loading}
            label="Name"
            placeholder="Jameel"
            type="text"
            name="name"
          />
          <InputformField
            control={form.control}
            loading={loading}
            label="Email"
            placeholder="Add student or Guardian email"
            type="email"
            name="email"
          />
          <InputformField
            control={form.control}
            loading={loading}
            label="Phone"
            placeholder="Add student or Guardian number"
            type="text"
            name="phone"
          />
          <InputformField
            control={form.control}
            loading={loading}
            label="Address"
            placeholder="Kuala Lumpur 2nd street"
            type="text"
            name="address"
          />
          <InputformField
            control={form.control}
            loading={loading}
            label="City"
            placeholder="Penang"
            type="text"
            name="city"
          />
          <SelectFormField
            control={form.control}
            loading={loading}
            label="State"
            placeholder="Select State"
            name="state"
            //@ts-ignore
            options={MStates}
          />
        </div>

        <div className="gap-8 md:grid md:grid-cols-3">
          <InputformField
            control={form.control}
            loading={loading}
            label="School Name"
            placeholder="Enter School Name"
            type="text"
            name="school"
          />
          <InputformField
            control={form.control}
            loading={loading}
            label="Age"
            placeholder="5 years old"
            type="text"
            name="age"
          />
          <SelectFormField
            control={form.control}
            loading={loading}
            label="Gender"
            placeholder="Select Gender"
            name="gender"
            options={Gender}
          />
          <SelectFormField
            control={form.control}
            loading={loading}
            label="Study Mode"
            placeholder="Select Study Mode"
            name="studymode"
            options={studyMode}
          />
          <SelectFormField
            control={form.control}
            loading={loading}
            label="Level"
            placeholder="Select Level"
            name="level"
            options={level}
          />
          <MultiSelectFormField
            control={form.control}
            loading={loading}
            label="Subject"
            placeholder="Select Subjects"
            name="subject"
            options={formattedSubject}
          />
          <SelectFormField
            control={form.control}
            loading={loading}
            label="Class Duration"
            placeholder="Select a class duration you need for your kid"
            name="sessionDuration"
            options={sessionDuration}
          />
          <SelectFormField
            control={form.control}
            loading={loading}
            label="Class Frequency"
            placeholder="Select classes per week for your kid"
            name="sessionFrequency"
            //@ts-ignore
            options={sessionFrequency}
          />
        </div>

        <Separator />
        <Button disabled={loading} className="ml-auto" type="submit">
          <Check className="mr-2 h-4 w-4" /> {action}
        </Button>
      </form>
    </Form>
  );
};
