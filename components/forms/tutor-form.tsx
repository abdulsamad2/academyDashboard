'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Loader2, X, RefreshCcw, Copy, Eye, EyeOff } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { tutorRegistration, updateTutor } from '@/action/tutorRegistration';
import clsx from 'clsx';
import EnhancedUpload from '../cloudinaryUpload';
import { useSession } from 'next-auth/react';
const MALAYSIAN_STATES = [
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

const COUNTRY = [{ label: 'Malaysia', value: 'Malaysia' }];
const EDUCATION = [
  {
    label: 'SPM',
    value: 'spm'
  },
  {
    label: 'Diploma',
    value: 'diploma'
  },
  {
    label: 'Masters',
    value: 'masters'
  },
  {
    label: 'Bachelors',
    value: 'bachelors'
  },
  {
    label: 'PhD',
    value: 'phd'
  }
];
const LEVELS = [
  { label: 'Kindergarten', value: 'kindergarten' },
  { label: 'Primary School', value: 'primary_school' },
  { label: 'Secondary School', value: 'secondary_school' },
  { label: 'Diploma', value: 'diploma' },
  { label: 'Degree', value: 'degree' },
  { label: 'Adult', value: 'adult' }
];

export const FormSchema = z.object({
  id: z.string().optional(),
  password: z.string().optional(),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  bio: z.string().min(50, { message: 'Bio must be at least 50 characters' }),
  state: z.string().min(1, { message: 'Please select a state' }),
  name: z.string().min(3, { message: 'Name is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  bank: z.string().min(1, { message: 'Bank name is required' }),
  bankaccount: z
    .string()
    .min(8, { message: 'Bank account must be at least 8 characters' }),
  currentposition: z
    .string()
    .min(1, { message: 'Current working position is required' }),
  education: z.string().min(1, { message: 'Education is required' }),
  spm: z.string().min(1, { message: 'SPM is required' }),
  certification: z.string().min(1, { message: 'Certification is required' }),
  age: z.string().min(1, { message: 'Age is required' }),

  subjects: z
    .array(z.string())
    .min(1, { message: 'Please select at least one subject' }),
  online: z.boolean(),
  experience: z
    .string()
    .min(50, { message: 'Experience must be at least 50 characters' }),
  profilepic: z.string().min(1, { message: 'Profile image must be uploaded' }),
  nric: z.string().min(1, { message: 'NRIC must be uploaded' }),
  resume: z.string().min(1, { message: 'Resume must be uploaded' }),
  country: z.string().min(1, { message: 'Country is required' }),
  levels: z.string().min(1, { message: 'Levels is required' }),
  degree: z.string().min(1, { message: 'Degree is required' }),
  phone: z.string().regex(/^\+60\d{9,10}$/, {
    message: 'Please enter a valid Malaysian phone number'
  })
});

type TutorFormValues = z.infer<typeof FormSchema>;

interface TutorFormProps {
  initialData: TutorFormValues | null;
  subject: { name: string }[];
}

export const TutorForm: React.FC<TutorFormProps> = ({
  initialData,
  subject
}) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [passgenLoad, setPassgenload] = useState(false);

  const title = initialData ? 'Edit Tutor Profile' : 'Create Tutor Profile';
  const description = initialData
    ? 'Update your tutor information.'
    : 'Complete your tutor profile to get started.';
  const toastMessage = initialData
    ? 'Tutor profile updated.'
    : 'Tutor profile created.';
  const action = initialData ? 'Save changes' : 'Submit';
  const generatePassword = () => {
    setPassgenload(true);
    const randomPassword =
      Math.random().toString(36).slice(-12) +
      Math.random().toString(36).slice(-12);
    form.setValue('password', randomPassword, {
      shouldValidate: true,
      shouldDirty: true
    });
    setPassgenload(false);
  };
  const copyPassword = () => {
    const password = form.getValues('password');
    if (password) {
      navigator.clipboard.writeText(password);
      toast({
        title: 'Password Copied',
        description: 'The password has been copied to your clipboard.'
      });
    }
  };

  /**
   * Toggles the visibility of the password field.
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const form = useForm<TutorFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData || {
      bio: '',
      levels: '',
      age: '36 years',
      spm: '',
      experience: '',
      name: '',
      state: '',
      address: '',
      city: '',
      bank: '',
      bankaccount: '',
      currentposition: '',
      education: '',
      certification: '',
      subjects: [],
      online: false,
      profilepic: '',
      nric: '',
      resume: '',
      country: 'Malaysia',
      degree: '',
      email: '',
      phone: '+60',
      password: ''
    }
  });

  /**
   * Handles the form submission for creating or updating a tutor profile.
   * The form data is validated and if valid, calls the respective function
   * to create or update the tutor profile. If there is an error, it displays
   * a toast message with the error message.
   *
   * @param {TutorFormValues} data - The form data
   */
  const onSubmit = async (data: TutorFormValues) => {
    try {
      setLoading(true);

      // Validate the form data
      const action = initialData?.id
        ? await updateTutor(initialData?.id, data)
        : await tutorRegistration(data);

      // Show a success toast message
      toast({
        title: toastMessage,
        description: initialData?.id
          ? 'Your profile has been successfully updated.'
          : 'Your profile has been successfully created.'
      });

      // Refresh the page or navigate accordingly
      //router.refresh();
    } catch (error: any) {
      // Show error toast with detailed feedback
      console.error(error);
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description:
            error.message ||
            'There was an issue while processing your request. Please try again later.'
        });
      } else {
        console.error('Unknown error occurred:', error);
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'An unknown error occurred. Please try again later.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader></CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="profilepic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <EnhancedUpload
                        title="Upload Profile pic"
                        initialUrl={field.value}
                        onUpload={(url) => field.onChange(url)}
                        //@ts-ignore
                        userId={session?.id}
                        acceptedFileTypes={['image/*', 'application/pdf']}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="info@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+60......" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="space-y-2">
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            type={'text'}
                            placeholder="Password"
                            className="pr-20" // Increased padding for the eye icon
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={togglePasswordVisibility}
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generatePassword}
                          className="flex-1"
                        >
                          <RefreshCcw
                            className={clsx(
                              `mr-2 h-4 w-4`,
                              passgenLoad ? 'animate-spin' : 'animate-none'
                            )}
                          />
                          Generate
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={copyPassword}
                          className="flex-1"
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Javed Kareem" {...field} />
                    </FormControl>
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
                      <Input placeholder="E.g 36 years" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentposition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Position</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Math Teacher at XYZ School"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Highest Education</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your Degree" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EDUCATION.map((state) => (
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
                name="certification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Highest Education Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g Bachelors in Computer Science"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="levels"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Level I can Teach</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your Degree" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LEVELS.map((state) => (
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
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COUNTRY.map((state) => (
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
                        {MALAYSIAN_STATES.map((state) => (
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
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Your city" {...field} />
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
                      <Input placeholder="Your address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your bank name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bankaccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Account Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your bank account number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subjects I teach</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        if (!field.value.includes(value)) {
                          field.onChange([...field.value, value]);
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subjects" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="h-48 overflow-y-auto">
                        <ScrollArea>
                          {subject?.map((item) => (
                            <SelectItem key={item.name} value={item.name}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <ScrollArea className="mt-2 h-[100px] w-full rounded-md border p-2">
                    <div className="mt-2 flex flex-wrap gap-2">
                      {field.value.map((subject, index) => (
                        <Button
                          key={index}
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            const newSubjects = [...field.value];
                            newSubjects.splice(index, 1);
                            field.onChange(newSubjects);
                          }}
                        >
                          {subject}
                          <X className="ml-2 h-4 w-4" />
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="online"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Available for Online Teaching</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Check this if you&apos;re available for online tutoring
                      sessions.
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself, your teaching philosophy, and what makes you unique as a tutor."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teaching Experience</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your teaching experience, including any notable achievements or specialized areas of expertise."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nric"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NRIC</FormLabel>
                    <FormControl>
                      <EnhancedUpload
                        title="Upload NRIC"
                        initialUrl={field.value}
                        onUpload={(url) => field.onChange(url)}
                        //@ts-ignore
                        userId={session?.id}
                        acceptedFileTypes={['image/*', 'application/pdf']}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="degree"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Highest Education Degree / Certifcate</FormLabel>
                    <FormControl>
                      <EnhancedUpload
                        title="Upload Degree / Certificate"
                        initialUrl={field.value}
                        onUpload={(url) => field.onChange(url)}
                        //@ts-ignore
                        userId={session?.id}
                        acceptedFileTypes={['image/*', 'application/pdf']}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="spm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SPM/IGCSE Certificate Result</FormLabel>
                    <FormControl>
                      <EnhancedUpload
                        title="Upload SPM certificate"
                        initialUrl={field.value}
                        onUpload={(url) => field.onChange(url)}
                        //@ts-ignore
                        userId={session?.id}
                        acceptedFileTypes={['image/*', 'application/pdf']}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume</FormLabel>
                    <FormControl>
                      <EnhancedUpload
                        title="Upload Resume"
                        initialUrl={field.value}
                        onUpload={(url) => field.onChange(url)}
                        //@ts-ignore
                        userId={session?.id}
                        acceptedFileTypes={['image/*', 'application/pdf']}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                action
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
