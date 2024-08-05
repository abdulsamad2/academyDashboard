'use client';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useToast } from '../../components/ui/use-toast';
import ImageUploader from '@/components/file-upload';
import InputformField from '@/components/formField';

const FormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  image: z
    .instanceof(File)
    .refine((file) => file.size !== 0, 'Please upload an image')
});

type TutorFormValues = z.infer<typeof FormSchema>;

interface TutorFormProps {
  initialData: TutorFormValues | null;
}

export const TutorForm: React.FC<TutorFormProps> = ({ initialData }) => {
  // Accepting initialData as a prop
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit tutor' : 'Create tutor';
  const description = initialData ? 'Edit a tutor.' : 'Add a new tutor';
  const toastMessage = initialData ? 'Tutor updated.' : 'Tutor created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData
    ? initialData
    : {
        image: new File([''], 'filename'),
        name: 'Some name'
      };

  const form = useForm<TutorFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues
  });

  const onSubmit = (fData) => {
    const data = new FormData();
    for (const key in fData) {
      if (key === 'field') {
        data.append(key, fData[key][1]);
      } else {
        data.append(key, fData[key]);
      }
    }
    console.log(data);
    try {
      setLoading(true);

      if (res) {
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
    } catch (error) {}
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
          encType="multipart/form-data"
        >
          <InputformField
            loading={loading}
            label={'Name'}
            name={'name'}
            placeholder={'Abdul Kader'}
            type={'text'}
            control={form.control}
          />
          <ImageUploader
            form={form}
            control={form.control}
            name={'image'}
            label={'Upload image'}
          />
          <Button className="ml-auto" type="submit">
            {loading ? 'Please wait...' : action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default TutorForm;
