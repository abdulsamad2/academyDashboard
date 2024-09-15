'use client';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useToast } from '../ui/use-toast';
import { AlertModal } from '../modal/alert-modal';
import InputformField from '../formField';
import SelectFormField from '../selectFromField';
import { userRegistration } from '@/action/userRegistration';

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

const FormSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  name: z
    .string()
    .min(3, { message: 'Parent Name must be at least 3 characters' }),
  state: z.string().min(1, { message: 'Please select a state' }),
  password: z.string().optional(),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' }),
  address: z
    .string()
    .min(1, { message: 'Address must be at least 1 character' }),
  city: z.string().min(1, { message: 'City must be at least 1 character' })
});

type ParentFormValues = z.infer<typeof FormSchema>;

interface ParentFormProps {
  initialData: ParentFormValues | null;
}

export const ParentForm: React.FC<ParentFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Parent' : 'Create Parent';
  const description = initialData ? 'Edit a Parent.' : 'Add a new Parent';
  const toastMessage = initialData ? 'Parent updated.' : 'Parent created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData
    ? initialData
    : {
        name: '',
        email: '',
        password: '',
        phone: '',
        state: '',
        address: '',
        city: ''
      };

  const form = useForm<ParentFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues
  });

  const onSubmit = async (data: ParentFormValues) => {
    try {
      setLoading(true);
      //@ts-ignore
      const res = await userRegistration(data);
     if(res){
      toast({
        variant: 'default',
        title: 'Success',
        description: 'Parent created successfully'
      });
      router.push(`/dashboard/parents`);
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

  const onDelete = async () => {
    try {
      setLoading(true);
      // Example delete logic
      // await axios.delete(`/api/parents/${initialData?._id}`);
      router.refresh();
      router.push(`/dashboard/parents`);
    } catch (error) {
      console.error('Failed to delete parent', error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

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
              placeholder={'Shahil'}
              type={'text'}
              name={'name'}
            />
            <InputformField
              control={form.control}
              loading={loading}
              label={'Email'}
              placeholder={'info@me.com'}
              type={'email'}
              name={'email'}
            />
            <InputformField
              control={form.control}
              loading={loading}
              label={'Password'}
              placeholder={`${
                initialData
                  ? 'Leave blank to keep current password'
                  : 'password must be at least 8 characters'
              }`}
              type={'password'}
              name={'password'}
            />
            <InputformField
              control={form.control}
              loading={loading}
              label={'Phone'}
              placeholder={'034235253453'}
              type={'text'}
              name={'phone'}
            />
            <InputformField
              control={form.control}
              loading={loading}
              label={'Address'}
              placeholder={'Jalan Tuanku Abdul Rahman, Kompleks Pertama'}
              type={'text'}
              name={'address'}
            />
            <InputformField
              control={form.control}
              loading={loading}
              label={'City'}
              placeholder={'Kuala Lumpur'}
              type={'text'}
              name={'city'}
            />
            <SelectFormField
              control={form.control}
              loading={loading}
              label={'State'}
              name={'state'}
              //@ts-ignore
              options={MStates}
              placeholder={'Select State'}
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
