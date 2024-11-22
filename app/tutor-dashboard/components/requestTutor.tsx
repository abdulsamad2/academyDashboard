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
import InputformField from '@/components/formField';
import { useToast } from '@/components/ui/use-toast';
import SelectFormField from '@/components/selectFromField';
import { userRegistration } from '@/action/userRegistration';

const LocationOptions = [
  { label: 'Online Tuition', value: 'online' },
  { label: 'Home Tuition', value: 'home' },
  { label: 'Center Tuition', value: 'center' }
] as const;

const EducationLevels = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Higher Secondary', value: 'higher_secondary' },
  { label: 'University', value: 'university' }
] as const;

const FormSchema = z.object({
  subject: z.string().min(1, { message: 'Please select a subject' }),
  educationLevel: z
    .string()
    .min(1, { message: 'Please select an education level' }),
  location: z.string().min(1, { message: 'Please select a location' }),
  address: z
    .string()
    .min(1, { message: 'Address must be at least 1 character' }),
  studentName: z
    .string()
    .min(3, { message: 'Student Name must be at least 3 characters' })
});

type TutorRequestFormValues = z.infer<typeof FormSchema>;

interface TutorRequestFormProps {
  initialData: TutorRequestFormValues | null;
}

export const RequestTutorForm: React.FC<TutorRequestFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Tutor Request' : 'Request a Tutor';
  const description = initialData
    ? 'Edit your tutor request.'
    : 'Request a new tutor';
  const toastMessage = initialData
    ? 'Tutor request updated.'
    : 'Tutor request created.';
  const action = initialData ? 'Save changes' : 'Submit request';

  const defaultValues = initialData
    ? initialData
    : {
        studentName: '',
        subject: '',
        educationLevel: '',
        location: '',
        address: ''
      };

  const form = useForm<TutorRequestFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues
  });

  const onSubmit = async (data: TutorRequestFormValues) => {
    try {
      setLoading(true);
      //@ts-ignore
      const res = await userRegistration(data); // You can replace this with your actual API logic
      if (res) {
        toast({
          variant: 'default',
          title: 'Success',
          description: 'Tutor request created successfully.'
        });
      }
      //@ts-ignore
      if (!res.error) {
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

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <div className="flex items-center justify-between"></div>

          <div className="">
            <InputformField
              type="text"
              control={form.control}
              loading={loading}
              label={'Subject'}
              name={'subject'}
              placeholder={'E.g. Maths'}
            />
            <SelectFormField
              control={form.control}
              loading={loading}
              label={'Student Level'}
              name={'level'}
              //@ts-ignore
              options={EducationLevels}
              placeholder={'Please Select Student Level'}
            />

            <SelectFormField
              control={form.control}
              loading={loading}
              label={'Mode'}
              name={'mode'}
              //@ts-ignore
              options={LocationOptions}
              placeholder={'Select mode of tution'}
            />
          </div>

          <Button className="mt-6 w-full justify-center" type="submit">
            {loading ? 'Please wait...' : action}
          </Button>
        </form>
      </Form>
    </>
  );
};
