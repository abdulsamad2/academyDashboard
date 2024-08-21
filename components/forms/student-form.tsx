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
import { StudentRegistration } from '@/action/StudentRegistration';
import { AlertModal } from '../modal/alert-modal';
import InputformField from '../formField';
import SelectFormField from '../selectFromField';
import FileUpload from '@/components/file-upload';
import CloudinaryUpload from '../cloudinaryUpload';
import { cookies } from 'next/headers';
import { profile } from 'console';
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
const Gender = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'other', value: 'other' }
  
] as const;
const teachOnline = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' }
] as const;


const FormSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  name: z
    .string()
    .min(3, { message: 'Student Name must be at least 3 characters' }),
  state: z.string().min(1, { message: 'Please select a state' }),
  password: z.string(),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' }),
  address: z
    .string()
    .min(1, { message: 'Address must be at least 1 character' }),
  city: z.string().min(1, { message: 'City must be at least 1 character' }),
  online: z.string(),
  gender:z.string(),

  profilepic: z.string().min(1, { message: 'Profile image must be uploaded' })

});

type studentFormValue = z.infer<typeof FormSchema>;

interface StudentFormProps {
  initialData: studentFormValue | null;
}

export const StudentForm: React.FC<StudentFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Student' : 'Create Student';
  const description = initialData ? 'Edit a Student.' : 'Add a new Student';
  const toastMessage = initialData ? 'Student updated.' : 'Student created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData
    ? initialData
    : {
      name: '',
      email: '',
      password: '',
      Phone: '',
      state: '',
      addess: '',
      city: '',
      online: false,
      profilepic: '',

    };

    console.log('inital data =>',initialData?.profilepic)
  const form = useForm<studentFormValue>({
    resolver: zodResolver(FormSchema),
    defaultValues
  });

  const onSubmit = async (data: studentFormValue) => {

    // console.log(fData)
    // // const data = new FormData();

    // // for (const key in fData) {
    // //   if (key === 'field') {
    // //     data.append(key, fData[key][1]);
    // //   } else {
    // //     data.append(key, fData[key]);
    // //   }
    // // }
    // // data.append(
    // //   'imgUrl',
    // //   JSON.stringify(fData.imgUrl.map((item) => item.fileUrl)).trim()
    // // );

    try {
      setLoading(true);
      // const res = await StudentRegistration(data);
      if (res.error) {
        toast({
          variant: 'destructive',
          title: res.error,
          description: 'There was a problem with your request.'
        });
      }
      if (res.success) {
        toast({
          variant: 'default',
          title: toastMessage,
          description: 'Student details updated successfully'
        });
        // router.refresh();
        // router.push(`/dashboard/Students/${res._id}`);
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
        
          <div className="gap-8 md:grid md:grid-cols-3">
            <InputformField
              control={form.control}
              loading={loading}
              label={'Name'}
              placeholder={'Jameel'}
              type={'text'}
              name={'name'}
            />
            <InputformField
              control={form.control}
              loading={loading}
              label={'Email'}
              placeholder={'exmaple@gmail.com'}
              type={'email'}
              name={'email'}
            />
            <InputformField
              control={form.control}
              loading={loading || initialData ? true : false}
              label={'Password'}
              placeholder={'password must be 8 character long'}
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
              placeholder={'kaulalampur 2nd street'}
              type={'text'}
              name={'address'}
            />
              <InputformField
              control={form.control}
              loading={loading}
              label={'City'}
              placeholder={'Add city name'}
              type={'text'}
              name={'city'}
            />
            <SelectFormField
              control={form.control}
              loading={loading}
              label={'State'}
              placeholder={'Select gender'}
              name={'state'}
              form={form}
              options={MStates}
            />
            <SelectFormField
              control={form.control}
              loading={loading}
              label={'Gender'}
              placeholder={'Select gender'}
              name={'gender'}
              form={form}
              options={Gender}
            />

          </div>
  


          <Button className="justify-center w-1/4 mt-6" type="submit">
            {loading ? 'Please wait...' : action}
          </Button>
        </form>
      </Form>
    </>
  );
};
