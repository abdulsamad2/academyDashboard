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
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useToast } from '../ui/use-toast';
import { AlertModal } from '../modal/alert-modal';
import InputformField from '../formField';
import SelectFormField from '../selectFromField';
import { addSubject } from '@/action/subjectAction';



const FormSchema = z.object({
  name: z.string().min(1),
  subjectcode: z.string().min(1),
  
});

type subjectFormValue = z.infer<typeof FormSchema>;

interface SubjectFormProps {
  initialData: subjectFormValue | null;
}
export const SubjectForm: React.FC<SubjectFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit subject' : 'Add subject';
  const description = initialData ? 'Edit a Subject.' : 'Add a new subject';
  const toastMessage = initialData ? 'Subject updated.' : 'Subject Added.';
  const action = initialData ? 'Save changes' : 'Add';

  const defaultValues = initialData
    ? initialData
    : {
       name:'',
       subjectcode:''

      };

  const form = useForm<subjectFormValue>({
    resolver: zodResolver(FormSchema),
    defaultValues
  });

  const onSubmit = async (data: subjectFormValue) => {
    try {
      setLoading(true);
      const res = await addSubject(data);
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
      if (res.status =='success') {
        toast({
          variant: 'default',
          title: toastMessage,
          description: 'Subject details updated successfully'
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

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <Separator />

          <div className="gap-8 md:grid md:grid-cols-3">
            <InputformField
              control={form.control}
              loading={loading}
              label={'Name'}
              placeholder={'Maths'}
              type={'text'}
              name={'name'}
            />
            <InputformField
              control={form.control}
              loading={loading}
              label={'subject code'}
              placeholder={'add subject code'}
              type={'text'}
              name={'subjectcode'}
            />


          </div>

          <Separator />
          <Button disabled={loading} className="ml-auto" type="submit">
            <Check className="mr-2 h-4 w-4" /> {action}
          </Button>
        </form>
      </Form>
      
    </>
  );
};
