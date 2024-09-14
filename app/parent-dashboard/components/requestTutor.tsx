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
import { jobCreation } from '@/action/jobActions';
import { useSession } from 'next-auth/react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const LocationOptions = [
  { label: 'Online', value: 'online' },
  { label: 'At Home', value: 'home' },
  { label: 'At Nearest Tuition Center', value: 'center' }
] as const;

const EducationLevels = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Higher Secondary', value: 'higher_secondary' },
  { label: 'University', value: 'university' }
] as const;

const FormSchema = z.object({
  subject: z.string().min(1, { message: 'Please select a subject' }),
  level: z.string().min(1, { message: 'Please select an education level' }),
  mode: z.string().min(1, { message: 'Please select a mode' }),
  requriments: z.string().min(3, { message: 'Add more details' })
});

type TutorRequestFormValues = z.infer<typeof FormSchema>;

interface TutorRequestFormProps {
  initialData: TutorRequestFormValues | null;
}

export const RequestTutorForm: React.FC<TutorRequestFormProps> = ({
  initialData
}) => {
  const { toast } = useToast();
  const router = useRouter(); // Fix the missing router instance
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const action = initialData ? 'Save changes' : 'Submit request';

  const defaultValues = initialData
    ? initialData
    : {
        subject: '',
        level: '',
        mode: '',
        requriments: ''
      };

  const form = useForm<TutorRequestFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues
  });

  const onSubmit = async (data: TutorRequestFormValues) => {
    try {
      setLoading(true);
      const res = await jobCreation({
        ...data,
        userId: session?.id // Fix parentId from session
      });
      toast({
        variant: 'default',
        title: res.error ? 'Uh oh! Something went wrong.' : 'Success',
        description: res.error
          ? 'There was a problem with your request.'
          : 'Tutor request submitted successfully.'
      });
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
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
            options={EducationLevels}
            placeholder={'Please Select Student Level'}
          />

          <SelectFormField
            control={form.control}
            loading={loading}
            label={'Mode'}
            name={'mode'}
            options={LocationOptions}
            placeholder={'Select mode of tuition'}
          />

          <Label htmlFor="requriments">
            Additional Details or Requirements
          </Label>
          <Textarea
            id="requriments"
            {...form.register('requriments')} // Use form.register for Textarea
            className="min-h-[100px]"
            placeholder="E.g. Need a math teacher willing to take online classes and must know Mandarin"
          />
          {form.formState.errors.requriments && (
            <p className="text-red-500">
              {form.formState.errors.requriments.message}
            </p>
          )}
        </div>

        <Button
          className="mt-6 w-full justify-center"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Please wait...' : action}
        </Button>
      </form>
    </Form>
  );
};
