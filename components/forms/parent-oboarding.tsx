'use client';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useToast } from '../ui/use-toast';
import { AlertModal } from '../modal/alert-modal';
import InputformField from '../formField';
import SelectFormField from '../selectFromField';
import { parentRegistration } from '@/action/onBoarding';
import { useSession, signIn } from 'next-auth/react';

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
  name: z.string().min(3, { message: 'Parent Name must be at least 3 characters' }),
  state: z.string().min(1, { message: 'Please select a state' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  address: z.string().min(1, { message: 'Address must be at least 1 character' }),
  city: z.string().min(1, { message: 'City must be at least 1 character' }),
});

type ParentFormValues = z.infer<typeof FormSchema>;

interface ParentFormProps {
  initialData: ParentFormValues | null;
}

export const ParentOnBoarding: React.FC<ParentFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session, update: updateSession } = useSession();
  const title = initialData ? 'Edit Parent' : 'Create a Parent Profile';
  const action = initialData ? 'Save changes' : 'Submit';
  const defaultValues = initialData || {
    name: '',
    phone: '',
    state: '',
    address: '',
    city: '',
  };

  const form = useForm<ParentFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const onSubmit = async (data: ParentFormValues) => {
    setLoading(true);
    try {
      const updateData = { ...data, id: session?.id };

      // Call the parent registration action
      const res = await parentRegistration(updateData);

      if (res) {
        // Update session
        await updateSession({
          ...session,
           user: {onboarding:false,}
        })

        if (res) {
          toast({
            variant: 'default',
            title: 'Success',
            description: 'Thanks for completing your profile!',
          });
        }

        router.push(`/parent-dashboard`);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      // Perform delete logic here if needed
      router.push(`/dashboard/parents`);
    } catch (error) {
      console.error('Failed to delete parent', error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
console.log(session)
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <Heading title={title} />
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
              options={MStates}
              placeholder={'Select State'}
            />
          </div>

          <Button className="mt-8 w-1/4 justify-center" type="submit">
            {loading ? 'Please wait...' : action}
          </Button>
        </form>
      </Form>
    </>
  );
};
