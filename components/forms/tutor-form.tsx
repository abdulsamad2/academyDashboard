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
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useToast } from '../ui/use-toast';
import { Textarea } from '../ui/textarea';
import { tutorRegistration } from '@/action/tutorRegistration';
import { AlertModal } from '../modal/alert-modal';
import InputformField from '../formField';
import SelectFormField from '../selectFromField';
import FileUpload from '@/components/file-upload';
import CloudinaryUpload from '../cloudinaryUpload';
import MultiSelectFormField from '../ui/multi-select';

const checkItem = [
  {
    id: 'recents',
    label: 'Recents'
  },
  {
    id: 'home',
    label: 'Home'
  },
  {
    id: 'applications',
    label: 'Applications'
  },
  {
    id: 'desktop',
    label: 'Desktop'
  },
  {
    id: 'downloads',
    label: 'Downloads'
  },
  {
    id: 'documents',
    label: 'Documents'
  }
] as const;

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
] as const;
const teachOnline = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' }
] as const;

const FormSchema = z.object({
  bio: z.string().min(1, { message: 'Bio must be at least 50 character' }),
  email: z.string().email({ message: 'Enter a valid email address' }),
  name: z
    .string()
    .min(3, { message: 'Tutor Name must be at least 3 characters' }),
  state: z.string().min(1, { message: 'Please select a state' }),
  password: z.string(),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' }),
  address: z
    .string()
    .min(1, { message: 'Address must be at least 1 character' }),
  city: z.string().min(1, { message: 'City must be at least 1 character' }),
  bank: z
    .string()
    .min(1, { message: 'add bank name and should be more than one' }),
  bankaccount: z
    .string()
    .min(1, { message: 'Bank must be at least 8 character' }),
  currentposition: z.string().min(1, {
    message: 'Current workin position must be at least 1 character'
  }),
  education: z
    .string()
    .min(1, { message: 'Education must be at least 1 character' }),
  certification: z
    .string()
    .min(1, { message: 'Certification must be at least 1 character' }),
  subjects: z.array(z.string()).min(1, { message: 'Please select a subject' }),
  online: z.string(),
  experience: z
    .string()
    .min(1, { message: 'Experince must be at least 50 character' }),
  profilepic: z.string().min(1, { message: 'Profile image must be uploaded' }),
  nric: z.string().min(1, { message: 'nric must be uploaded' }),
  stt: z.string().min(1, { message: 'stt must be uploaded' }),
  resume: z.string().min(1, { message: 'resume must be uploaded' })
});

type TutorFormValues = z.infer<typeof FormSchema>;

interface TutorFormProps {
  initialData: TutorFormValues | null;
  subject: { name: string }[];
}

export const TutorForm: React.FC<TutorFormProps> = ({ initialData,subject }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit tutor' : 'Create tutor';
  const description = initialData ? 'Edit a tutor.' : 'Add a new tutor';
  const toastMessage = initialData ? 'Tutor updated.' : 'Tutor created.';
  const action = initialData ? 'Save changes' : 'Create';
const formattedSubject = subject.map((item) => ({
    label: item.name,
    value: item.name
  }));
  const defaultValues = initialData
    ? initialData
    : {
        bio: '',
        experience: '',
        name: '',
        email: '',
        password: '',
        Phone: '',
        state: '',
        addess: '',
        city: '',
        bank: '',
        bankaccount: '',
        currentposition: '',
        education: '',
        certification: '',
        subjects: [''],
        online: false,
        profilepic: '',
        nric: '',
        stt: '',
        resume: ''
      };


  const form = useForm<TutorFormValues>({
    resolver: zodResolver(FormSchema),
    //@ts-ignore
    defaultValues
  });

  console.log('default values on tutor form',initialData)
  const onSubmit = async (data: TutorFormValues) => {

    try {
      setLoading(true);
      //@ts-ignore
      const res = await tutorRegistration(data);
      //@ts-ignore
      if (res.error) {
        toast({
          variant: 'destructive',
          //@ts-ignore
          title: res.error,
          description: 'There was a problem with your request.'
        });
      }
      //@ts-ignore
      if (res.success) {
        toast({
          variant: 'default',
          title: toastMessage,
          description: 'Tutor details updated successfully'
        });
        // router.refresh();
        // router.push(`/dashboard/tutors/${res._id}`);
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

  const onDelete = async () => {
    try {
      setLoading(true);
      // await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  // const triggerImgUrlValidation = () => form.trigger('imgUrl');

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <div className="flex items-center justify-between">
            <Heading title={title} description={description} />
            {initialData && (
              <Button
                disabled={loading}
                variant="destructive"
                size="sm"
                onClick={() => setOpen(true)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Separator />
          <FormField
          //@ts-ignore
            className="w-full"
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add your Bio</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    placeholder="Tell us about yourself journy education intestest."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
          //@ts-ignore
            className="w-full"
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Teaching Experince</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    placeholder="Tell us about your teaching experience what makes you a good teacher."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="gap-8 md:grid md:grid-cols-3">
            <InputformField
              control={form.control}
              loading={loading}
              label={'Name'}
              placeholder={'add your Name'}
              type={'text'}
              name={'name'}
            />
            <InputformField
              control={form.control}
              loading={loading || initialData ? true : false}
              label={'Email'}
              placeholder={'add your Email'}
              type={'email'}
              name={'email'}
            />
            <InputformField
              control={form.control}
              loading={loading || initialData ? true : false}
              label={'Password'}
              placeholder={`${
                initialData ? '*******' : 'Password must be 8 character long'
              }`}
              type={'password'}
              name={'password'}
            />
            <InputformField
              control={form.control}
              loading={loading}
              label={'Phone'}
              placeholder={'Phone must be 8 character long'}
              type={'text'}
              name={'phone'}
            />
            <InputformField
              control={form.control}
              loading={loading}
              label={'Address'}
              placeholder={'Address must be 8 character long'}
              type={'text'}
              name={'address'}
            />
            <SelectFormField
              control={form.control}
              loading={loading}
              label={'State you can teach'}
              placeholder={'Select state a state'}
              name={'state'}
              form={form}
              //@ts-ignore
              options={MStates}
            />

            <InputformField
              control={form.control}
              loading={loading}
              label={'City'}
              placeholder={'Add city name'}
              type={'text'}
              name={'city'}
            />
            <InputformField
              control={form.control}
              loading={loading}
              label={'Bank'}
              placeholder={'Bank Name'}
              type={'text'}
              name={'bank'}
            />
            <InputformField
              control={form.control}
              loading={loading}
              label={'Bank Account #'}
              placeholder={'add your bank account #'}
              type={'text'}
              name={'bankaccount'}
            />
            <InputformField
              control={form.control}
              loading={loading}
              label={'Current working Position'}
              placeholder={'Marketing Manager at UHIL'}
              type={'text'}
              name={'currentposition'}
            />
            <InputformField
              control={form.control}
              loading={loading}
              label={'Your Education Level'}
              placeholder={'Masters in Information Technology from MIT'}
              type={'text'}
              name={'education'}
            />
            <InputformField
              control={form.control}
              loading={loading}
              label={'Name of highest certificate'}
              placeholder={'Eg: Effective online teaching from coursera'}
              type={'text'}
              name={'certification'}
            />
           
             <MultiSelectFormField
            control={form.control}
            loading={loading}
            label="Subjects I can Teach"
            placeholder="Select Subjects"
            name="subjects"
            options={formattedSubject}
            
          />
            
            <SelectFormField
              control={form.control}
              loading={loading}
              label={'Can Teach Online'}
              placeholder={'I want to teach online'}
              name={'online'}
              form={form}
              
              //@ts-ignore

              options={teachOnline}
            />
          </div>
          <Separator />
          <h2 className="py-4 text-center text-xl">Upload your Documents</h2>
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="profilepic"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CloudinaryUpload
                      title={'Upload Profile Picture'}
                      initialUrl={initialData?.profilepic}
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
                  <FormControl>
                    <CloudinaryUpload
                      title={'Upload nric'}
                      initialUrl={initialData?.nric}
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
                  <FormControl>
                    <CloudinaryUpload
                      title={'Upload stt'}
                      onUpload={(url) => field.onChange(url)}
                      initialUrl={initialData?.stt}
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
                  <FormControl>
                    <CloudinaryUpload
                      title={'Upload resume'}
                      onUpload={(url) => field.onChange(url)}
                      initialUrl={initialData?.resume}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="mt-6 w-1/4 justify-center" type="submit">
            {loading ? 'Please wait...' : action}
          </Button>
        </form>
      </Form>
    </>
  );
};
