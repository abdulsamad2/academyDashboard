'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Loader2, X, Upload } from 'lucide-react';
import CloudinaryUpload from '../cloudinaryUpload';
import { tutorOnboarding } from '@/action/onBoarding';
import { ScrollArea } from '../ui/scroll-area';

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

const COUNTRY = [
 
  { label: 'Malaysia', value: 'Malaysia' }
];

const FormSchema = z.object({
  bio: z.string().min(50, { message: 'Bio must be at least 50 characters' }),
  state: z.string().min(1, { message: 'Please select a state' }),
  name: z.string().min(3, { message: 'Name is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  bank: z.string().min(1, { message: 'Bank name is required' }),
  bankaccount: z.string().min(8, { message: 'Bank account must be at least 8 characters' }),
  currentposition: z.string().min(1, { message: 'Current working position is required' }),
  education: z.string().min(1, { message: 'Education is required' }),
  certification: z.string().min(1, { message: 'Certification is required' }),
  subjects: z.array(z.string()).min(1, { message: 'Please select at least one subject' }),
  online: z.boolean(),
  experience: z.string().min(50, { message: 'Experience must be at least 50 characters' }),
  profilepic: z.string().min(1, { message: 'Profile image must be uploaded' }),
  nric: z.string().min(1, { message: 'NRIC must be uploaded' }),
  stt: z.string().min(1, { message: 'STT must be uploaded' }),
  resume: z.string().min(1, { message: 'Resume must be uploaded' }),
  country:z.string().min(1,{message:'Country is required'})
});

type TutorFormValues = z.infer<typeof FormSchema>;

interface TutorFormProps {
  initialData: TutorFormValues | null;
  subject: { name: string }[];
}

export const TutorOnboarding: React.FC<TutorFormProps> = ({ initialData, subject }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session, update: updateSession } = useSession();

  const title = initialData ? 'Edit Tutor Profile' : 'Create Tutor Profile';
  const description = initialData ? 'Update your tutor information.' : 'Complete your tutor profile to get started.';
  const toastMessage = initialData ? 'Tutor profile updated.' : 'Tutor profile created.';
  const action = initialData ? 'Save changes' : 'Submit';

  const form = useForm<TutorFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData || {
      bio: '',
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
      stt: '',
      resume: '',
      country:'Malaysia'
    }
  });

  const onSubmit = async (data: TutorFormValues) => {
    try {
      setLoading(true);
      const updatedData = {
        ...data,
        //@ts-ignore
        id: session?.id
      };
      //@ts-ignore
      const res = await tutorOnboarding(updatedData);
      
      if (res.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: res.error,
        });
      } else {
        await updateSession({
          ...session,
          user: { ...session?.user,name:data.name, onboarding: false, role: 'tutor' }
        });
        toast({
          title: toastMessage,
          description: 'Your profile has been successfully updated.',
        });
        router.push('/tutor-dashboard');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was a problem updating your profile.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                name="currentposition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Position</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Math Teacher at XYZ School" {...field} />
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
                    <FormLabel>Education</FormLabel>
                    <FormControl>
                      <Input placeholder="Your highest education" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="certification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certification</FormLabel>
                    <FormControl>
                      <Input placeholder="Your relevant certifications" {...field} />
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
                      <Input placeholder="Your bank account number" {...field} />
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
                      <SelectContent className='h-48 overflow-y-auto'>
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

                  <ScrollArea className="h-[100px] w-full border rounded-md p-2 mt-2">
                  <div className="flex flex-wrap gap-2 mt-2">
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
                    <FormLabel>
                      Available for Online Teaching
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Check this if you&apos;re available for online tutoring sessions.
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="profilepic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <CloudinaryUpload
                        title="Upload Profile Picture"
                        initialUrl={field.value}
                        onUpload={(url) => field.onChange(url)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nric"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NRIC</FormLabel>
                    <FormControl>
                      <CloudinaryUpload
                        title="Upload NRIC"
                        
                        initialUrl={field.value}
                        onUpload={(url) => field.onChange(url)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>STT</FormLabel>
                    <FormControl>
                      <CloudinaryUpload
                        title="Upload STT"
                        initialUrl={field.value}
                        onUpload={(url) => field.onChange(url)}
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
                      <CloudinaryUpload
                        title="Upload Resume"
                        initialUrl={field.value}
                        onUpload={(url) => field.onChange(url)}
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