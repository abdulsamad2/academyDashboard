'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Check, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  studentRegistration,
  updateStudent
} from '@/action/studentRegistration';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import userRouter, { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const FormSchema = z.object({
  adminId: z.string().optional(),
  name: z
    .string()
    .min(3, { message: 'Student Name must be at least 3 characters' }),
  state: z.string().min(1, { message: 'Please select a state' }),
  address: z.string().min(1, { message: 'Address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  gender: z.string().min(1, { message: 'Please select a gender' }),
  studymode: z.string().min(1, { message: 'Please select a study mode' }),
  level: z.string().min(1, { message: 'Please select an education level' }),
  school: z.string().min(1, { message: 'School name is required' }),
  age: z.string().min(1, { message: 'Age is required' }),
  sessionDuration: z
    .string()
    .min(1, { message: 'Please select a session duration' }),
  sessionFrequency: z
    .string()
    .min(1, { message: 'Please select a session frequency' }),
  subject: z
    .array(z.string())
    .min(1, { message: 'Please select at least one subject' })
});

type StudentFormValue = z.infer<typeof FormSchema>;

interface StudentFormProps {
  initialData?: StudentFormValue | null;
  subject: { name: string }[];
  studentId?: string | null;
}

const MStates = [
  { label: 'Kuala Lumpur', value: 'kl' },
  { label: 'Selangor', value: 'sg' },
  { label: 'Pulau Pinang', value: 'pp' },
  { label: 'Johor', value: 'joh' },
  { label: 'Perak', value: 'prk' },
  { label: 'Melaka', value: 'mlk' },
  { label: 'Negeri Sembilan', value: 'ns' },
  { label: 'Terengganu', value: 'trg' },
  { label: 'Kelantan', value: 'kltn' },
  { label: 'Kedah', value: 'kd' },
  { label: 'Perlis', value: 'pls' },
  { label: 'Pahang', value: 'pah' },
  { label: 'Sabah', value: 'sb' },
  { label: 'Sarawak', value: 'srw' }
];

const Gender = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' }
];

const studyMode = [
  { label: 'Home Tuition', value: 'home' },
  { label: 'Online Tuition', value: 'online' },
  { label: 'Center Tuition', value: 'center' }
];

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

const sessionDuration = [
  { label: '0.5 hour /30 minutes', value: '0.5' },
  { label: '1 hour', value: '1' },
  { label: '1.5 hour', value: '1.5' },
  { label: '2 hour', value: '2' },
  { label: '2.5 hour', value: '2.5' },
  { label: '3 hour', value: '3' },
  { label: '3.5 hour', value: '3.5' }
];

const sessionFrequency = [
  { label: 'Once a week', value: '1' },
  { label: 'Twice a week', value: '2' },
  { label: '3 days in a week', value: '3' },
  { label: '4 days in a week', value: '4' },
  { label: 'daily', value: '5' }
];
const getLevelValue = (label: string) => {
  const matchedLevel = level.find((lvl) => lvl.label === label);
  return matchedLevel ? matchedLevel.value : '';
};

export const StudentForm: React.FC<StudentFormProps> = ({
  studentId,
  initialData,
  subject
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();
  
  const title = initialData ? 'Edit Student' : 'Add Student';
  const description = initialData
    ? 'Edit student information.'
    : 'Register a new student.';
  const toastMessage = initialData
    ? 'Student updated successfully.'
    : 'Student registered successfully.';
  const action = initialData ? 'Save changes' : 'Register';

  const form = useForm<StudentFormValue>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          level: initialData.level || '' // Ensure level is set
        }
      : {
          name: '',
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
          adminId: '',
          subject: []
        }
  });

  const onSubmit = async (data: StudentFormValue) => {
    try {
      setLoading(true);
      const res = initialData
        ? // @ts-ignore
          await updateStudent(initialData?.id, data)
        : await studentRegistration(data);
      if (res?.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: res.error
        });
      } else if (res?.success) {
        toast({
          title: 'Success',
          description: toastMessage
        });
        router.back();
        form.reset();
      } else {
        throw new Error('Unexpected response');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description:
          'There was a problem registering the student. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {
                //@ts-ignore
                session.data.role === 'admin' && (
                  <FormField
                    control={form.control}
                    name="adminId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>admin Id </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter student name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              }
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter student name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MStates.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Gender.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter age" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter school name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <ScrollArea className="h-[200px] w-full">
                          {level.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
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
              <FormField
                control={form.control}
                name="studymode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Study Mode</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select study mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {studyMode.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sessionDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Duration</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select session duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sessionDuration.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sessionFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select session frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sessionFrequency.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subjects</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) =>
                        field.onChange([...field.value, value])
                      }
                      value={field.value[field.value.length - 1] || ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subjects" />
                      </SelectTrigger>
                      <SelectContent className="h-48 overflow-y-auto">
                        <ScrollArea>
                          {subject.map((item) => (
                            <SelectItem key={item.name} value={item.name}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {field.value.map((sub, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => {
                          const newValue = field.value.filter(
                            (_, i) => i !== index
                          );
                          field.onChange(newValue);
                        }}
                      >
                        {sub} ×
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={form.handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" /> {action}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
