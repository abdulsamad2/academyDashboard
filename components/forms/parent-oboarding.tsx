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
import { useToast } from '@/components/ui/use-toast';
import { AlertModal } from '@/components/modal/alert-modal';
import InputFormField from '@/components/formField';
import SelectFormField from '@/components/selectFromField';
import { parentRegistration } from '@/action/onBoarding';
import { useSession } from 'next-auth/react';

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
  { label: 'Sarawak', value: 'srw' },
] as const;

const FormSchema = z.object({
  country: z.string().min(1, { message: 'Please select a country' }),
  state: z.string().min(1, { message: 'Please select a state' }),
  phone: z.string().regex(/^\+60\d{9,10}$/, { message: 'Please enter a valid Malaysian phone number' }),
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
  const [sessionId, setSessionId] = useState('');
  const { data: session, status, update: updateSession } = useSession();

  const title = initialData ? 'Edit Parent Profile' : 'Create Parent Profile';
  const action = initialData ? 'Save changes' : 'Submit';
  const defaultValues = initialData || {
    phone: '+60',
    country: 'Malaysia',
    state: '',
    address: '',
    city: '',
  };

  const form = useForm<ParentFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  useEffect(() => {
    //@ts-ignore
    if (status === 'authenticated' && session?.id) {
      //@ts-ignore
      setSessionId(session?.id);
    }
  }, [session, status]);

  const onSubmit = async (data: ParentFormValues) => {
    setLoading(true);
    try {
      const updateData = { ...data, id: sessionId };
      const res = await parentRegistration(updateData);

      if (res) {
        await updateSession({
          ...session,
          user: { ...session?.user, onboarding: false, role: 'parent' }
        });

        router.push(`/parent-dashboard`);
        toast({
          variant: 'default',
          title: 'Success',
          description: 'Thanks for completing your profile!',
        });
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

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
              <Heading title={title} description="Please fill in your details below" />
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

            <div className="space-y-4">
            <InputFormField
                control={form.control}
                loading={loading}
                label="Phone"
                placeholder="12345678"
                type="tel"
                name="phone"
              />
              <SelectFormField
                control={form.control}
                loading={loading}
                label="Country"
                name="country"
                options={[{ label: 'Malaysia', value: 'Malaysia' }]}
                placeholder="Select Country"
              />
                 <SelectFormField
                control={form.control}
                loading={loading}
                label="State"
                name="state"
                //@ts-ignore
                options={MStates}
                placeholder="Select State"
              />
            </div>
            
              <InputFormField
                control={form.control}
                loading={loading}
                label="Address"
                placeholder="Jalan Tuanku Abdul Rahman, Kompleks Pertama"
                type="text"
                name="address"
              />
              <InputFormField
                control={form.control}
                loading={loading}
                label="City"
                placeholder="Kuala Lumpur"
                type="text"
                name="city"
              />
           

            <Button 
              className="w-full sm:w-auto" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Please wait...' : action}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
