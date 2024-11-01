'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { AlertModal } from '@/components/modal/alert-modal';
import { updateUser, userRegistration } from '@/action/userRegistration';
import InputformField from '../formField';
import SelectFormField from '../selectFromField';

// Define Malaysian states
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

// Form schema for validation
const FormSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  name: z.string().min(3, { message: 'Parent Name must be at least 3 characters' }),
  state: z.string().min(1, { message: 'Please select a state' }),
  password: z.string().optional(),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  address: z.string().min(1, { message: 'Address must be at least 1 character' }),
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

  const isEditMode = !!initialData;
  const title = isEditMode ? 'Edit Profile' : 'Create a Parent Profile';
  const description = isEditMode ? 'Edit Profile.' : 'Add a new Parent';
  const toastMessage = isEditMode ? 'Profile updated.' : 'Profile created.';
  const action = isEditMode ? 'Save changes' : 'Submit';

  const defaultValues: ParentFormValues = {
    name: initialData?.name ?? '',
    email: initialData?.email ?? '',
    password: '',
    phone: initialData?.phone ?? '',
    state: initialData?.state ?? '',
    address: initialData?.address ?? '',
    city: initialData?.city ?? ''
  };

  const form = useForm<ParentFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues
  });

  const onSubmit = async (data: ParentFormValues) => {
    try {
      setLoading(true);
      const res = isEditMode
      //@ts-ignore
        ? await updateUser(initialData.id, data)
              //@ts-ignore
        : await userRegistration(data);

      if (res) {
        toast({
          title: 'Success',
          description: toastMessage,
        });
        router.refresh();
        if (!isEditMode) {
          router.push('/dashboard/parents');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was a problem processing your request. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      // Implement delete logic here
      // await deleteUser(initialData.id);
      toast({
        title: 'Success',
        description: 'Parent deleted successfully',
      });
      router.refresh();
      router.push('/dashboard/parents');
    } catch (error) {
      console.error('Failed to delete parent', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete parent. Please try again.',
      });
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

      <div className="flex items-center justify-between">
        <Heading title={title} description={''} />
      </div>
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <InputformField
              control={form.control}
              name="name"
              label="Name"
              placeholder="Enter full name" 
              loading={loading} type={'text'}              
            />
            <InputformField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter email address"
              loading={isEditMode || loading}
              type="email"
            />
            <InputformField
              control={form.control}
              name="password"
              label="Password"
              placeholder={isEditMode ? "Leave blank to keep current password" : "Enter password"}
              loading={loading}
              type="password"
            />
            <InputformField
              control={form.control}
              name="phone"
              label="Phone"
              placeholder="Enter phone number"
              loading={loading} type={'text'}            />
            <InputformField
              control={form.control}
              name="address"
              label="Address"
              placeholder="Enter street address"
              loading={loading} type={'address'}            />
            <InputformField
              control={form.control}
              name="city"
              label="City"
              placeholder="Enter city"
              loading={loading} type={'text'}            />
            <SelectFormField
              control={form.control}
              name="state"
              label="State"
              //@ts-ignore
              options={MStates}
              placeholder="Select state"
              loading={loading}
            />
          </div>

          <Button type="submit" className="ml-auto" disabled={loading}>
            {loading ? 'Processing...' : action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ParentForm;