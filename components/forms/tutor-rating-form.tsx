'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Star, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { updateTutorRating } from '@/action/tutorRating';

const formSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().min(10, {
    message: 'Feedback must be at least 10 characters.'
  })
});

export default function TutorRatingForm({
  tutorId,
  tutorName
}: {
  tutorId: string;
  tutorName: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      feedback: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    // Simulate API call

    const res = await updateTutorRating(
      tutorId,
      values.rating.toString(),
      values.feedback
    );

    setIsSubmitting(false);
    toast({
      title: 'Rating submitted',
      description: `You rated ${tutorName} ${values.rating} stars.`
    });
    form.reset();
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-center text-2xl font-bold">Rate Your Tutor</h2>
      <p className="mb-6 text-center text-gray-600">
        How was your experience with {tutorName}?
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Rating</FormLabel>
                <FormControl>
                  <div className="flex justify-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`rounded-full p-1 text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          star <= field.value
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        onClick={() => field.onChange(star)}
                      >
                        <Star className="h-8 w-8 fill-current" />
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormDescription className="text-center">
                  Click on a star to rate
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="feedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feedback</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your experience with the tutor..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Your feedback helps us improve our services.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Rating'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
