'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Check, Trash2, BookOpen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { AlertModal } from '@/components/modal/alert-modal';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { addSubject } from '@/action/subjectAction';

const FormSchema = z.object({
  name: z.string().min(1, 'Subject name is required').max(50, 'Subject name must be 50 characters or less'),
});

type SubjectFormValue = z.infer<typeof FormSchema>;

interface SubjectFormProps {
  initialData: SubjectFormValue | null;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({ initialData }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Subject' : 'Add Subject';
  const description = initialData ? 'Make changes to the existing subject.' : 'Create a new subject for your curriculum.';
  const toastMessage = initialData ? 'Subject updated successfully.' : 'New subject added successfully.';
  const action = initialData ? 'Save changes' : 'Add subject';

  const form = useForm<SubjectFormValue>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData || { name: '' },
  });

  const onSubmit = async (data: SubjectFormValue) => {
    try {
      setLoading(true);
      const res = await addSubject(data);
      if ('error' in res) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description:'An unexpected error occurred.',
        });
      } else if (res.status === 'success') {
        toast({
          title: 'Success',
          description: 'Subject added successfully.',
        });
        router.refresh();
        router.push('/dashboard/subject');
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
    // Implement delete functionality here
    setOpen(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={loading} 
                      placeholder="e.g., Mathematics" 
                      className="text-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {initialData && (
          <Button
            variant="outline"
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Subject
          </Button>
        )}
        <Button 
          onClick={form.handleSubmit(onSubmit)} 
          disabled={loading}
          className="ml-auto"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" /> {action}
            </>
          )}
        </Button>
      </CardFooter>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
    </Card>
  );
};