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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import * as z from 'zod';

import { useForm } from 'react-hook-form';
import { useToast } from '../ui/use-toast';
import { Textarea } from '../ui/textarea';
import { tutorRegistration } from '@/action/tutorRegistration';
// const ImgSchema = z.object({
//   fileName: z.string(),
//   name: z.string(),
//   fileSize: z.number(),
//   size: z.number(),
//   fileKey: z.string(),
//   key: z.string(),
//   fileUrl: z.string(),
//   url: z.string()
// });
export const IMG_MAX_LIMIT = 3;
const FormSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  name: z
    .string()
    .min(3, { message: 'Tutor Name must be at least 3 characters' }),
  // imgUrl: z
  //   .array(ImgSchema)
  //   .max(IMG_MAX_LIMIT, { message: 'You can only add up to 3 images' })
  //   .min(1, { message: 'At least one image must be added.' }),
  description: z
    .string()
    .min(3, { message: 'Tutor description must be at least 3 characters' }),
  price: z.coerce.number(),
  profile: z
    .string()
    .min(1, { message: 'Please add a profile description' })
    .max(300, {
      message: 'Profile description must be less than 300 characters'
    }),
  dob: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: 'Date of birth must be in the format YYYY-MM-DD'
  }),
  address: z.string().min(1, { message: 'Please add an address' }),
  hourly: z.string().min(1, { message: 'Please add an hourly rate' }),
  availability: z.string().min(1, { message: 'Please add an availiblity' }),
  language: z.string().min(1, { message: 'Please add a language' }),
  teaches: z.string().min(1, { message: 'Please add a subject' })
});

// type tutorFormValues = z.infer<typeof FormSchema>;

interface tutorFormProps {
  initialData: any | null;
  categories: any;
}

export const TutorForm: React.FC<tutorFormProps> = ({
  initialData,
  categories
}) => {
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
        name: '',
        email: '',
        price: 0,
        profile: '',
        dob: '',
        address: '',
        hourly: '',
        teaches: '',
        availability: '',
        language: ''
      };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    alert(JSON.stringify(data, null, 2));
    // console.log(data);
    // tutorRegistration(data);
    // setLoading(true);
    // const res = await tutorRegistration(data);
    // if (res) {
    //   toast({
    //     variant: 'default',
    //     title: 'Tutor created.',
    //     description: 'Tutor created successfully'
    //   });
    //   router.refresh();
    //   router.push(`/dashboard/tutors/${res._id}`);
    // } else {
    //   toast({
    //     variant: 'destructive',
    //     title: 'Uh oh! Something went wrong.',
    //     description: 'There was a problem with your request.'
    //   });
    // }
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      //   await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  // const triggerImgUrlValidation = () => form.trigger('imgUrl');

  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      /> */}
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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          {/* <FormField
            control={form.control}
            name="imgUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <FileUpload
                    onChange={field.onChange}
                    value={field.value}
                    onRemove={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            className="w-full"
            control={form.control}
            name="profile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={loading}
                    placeholder="Tutor profile"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Tutor name"
                      {...field}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Tutor email"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="date of birth"
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Tutor address"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="add languages seperated with comma"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teaches"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teaches</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="add subject speciality"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hourly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly Rate</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Hourly rate"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="mondy to friday from 9am to 5pm"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="ml-auto " type="submit">
            {loading ? 'Please wait...' : 'Register'}
          </Button>
        </form>
      </Form>
    </>
  );
};
