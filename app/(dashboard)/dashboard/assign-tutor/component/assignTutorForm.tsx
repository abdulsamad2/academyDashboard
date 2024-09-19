'use client';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import InputformField from '@/components/formField';
import SelectFormField from '@/components/selectFromField';
import { assignTutor, deleteTutorWithStudent } from '@/action/AssignTutor';
import { Badge } from '@/components/ui/badge';
import { Trash2Icon } from 'lucide-react';
import { AlertModal } from '@/components/modal/alert-modal';


const FormSchema = z.object({

  name: z
    .string()
    .min(3, { message: 'Parent Name must be at least 3 characters' }),
  tutor: z.string().min(1, { message: 'Tutor is required' }),


});

type AssignTutor = z.infer<typeof FormSchema>;

interface AssignTutorProps {
  initialData: AssignTutor | null;
}

export const Assigntutor: React.FC<AssignTutorProps> = ({ initialData }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const title = initialData ? 'Edit ' : 'Create ';
  const description = initialData ? 'add tutor.' : 'Add a new Tutor';
  const toastMessage = initialData ? 'Student updated with new .' : 'Tutor created.';
  const action = initialData ? 'Save changes' : 'Create';
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);

    //@ts-ignore
    const onDelete = async (e) => {
      try {
        setLoading(true);
        const res = await deleteTutorWithStudent(initialData.studentId, selectedTutorId);
        router.refresh();
      
      } catch (error: any) {
      } finally {
        setLoading(false);
        setOpen(false);
      }
    };
    //@ts-ignore
    const tutorList = initialData?.assigned?.flat();
    const list = tutorList.map(item => (
      <div key={item.id} className='py-2 flex'>
        <Badge variant='outline' className='flex flex-shrink gap-2'>
          {item.name}
        </Badge>
        <Button
          disabled={loading}
          variant='destructive'
          size='sm'
          onClick={() => {
            setSelectedTutorId(item.id); // Set tutor ID when delete button is clicked
            setOpen(true);
          }}
        >
          <Trash2Icon className='h-4 w-4' />
        </Button>
      </div>
    ));
  //@ts-ignore
  const tutorOptions = initialData?.tutors?.map(item => {
    return {
      value: item.id,
      label: item.name
    }
  })
 
  const defaultValues = initialData
    ? initialData
    : {
      name: '',
      tutor: []
    };

  const form = useForm<AssignTutor>({
    resolver: zodResolver(FormSchema),
    //@ts-ignore
    defaultValues
  });

  const onSubmit = async (data: AssignTutor) => {
    try {
      setLoading(true);
      //@ts-ignore
      const res = await assignTutor(initialData?.studentId, data.tutor);
      if (res) {
        toast({
          variant: 'default',
          title: 'Success',
          description: toastMessage
        });
      }
      //@ts-ignore
      router.refresh();


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
          </div>


          <div className="gap-8 py-4 md:grid md:grid-cols-3">
            <InputformField
              control={form.control}
              loading={true}
              label={'Student Name'}
              placeholder={'Shahil'}
              type={'text'}
              name={'name'}
            />
            <div>
              <SelectFormField name={'tutor'} label={'Assign a tutor'} options={tutorOptions} control={form.control} />
            </div>
            <div className="">
              <p className="font-bold">Assigned Tutor:</p>
              {list}
            </div>
          </div>

          <Button className="mt-6 w-1/4 justify-center" type="submit">
            {loading ? 'Please wait...' : action}
          </Button>
        </form>
      </Form>
    </>
  );
};
