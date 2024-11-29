'use client';

import React, { useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Star, StarHalf, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { updateTutorRating } from '@/action/tutorRating';

const formSchema = z.object({
  rating: z.number().min(0.5).max(5),
  feedback: z.string().min(10, {
    message: 'Feedback must be at least 10 characters.'
  })
});

export default function TutorRatingForm({
  tutorId,
  tutorName,
  tutorRating,
  tutorFeedback
}: {
  tutorId: string;
  tutorName: string;
  tutorRating: number;
  tutorFeedback: string;
}) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: tutorRating ? tutorRating : 0,
      feedback: tutorFeedback ? tutorFeedback : ''
    }
  });

  const starRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleStarClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    starIndex: number
  ) => {
    const starElement = event.currentTarget;
    const rect = starElement.getBoundingClientRect();
    const clickPosition = event.clientX - rect.left;
    const starWidth = rect.width;

    // Determine if it's left or right half of the star
    const rating = clickPosition < starWidth / 2 ? starIndex - 0.5 : starIndex;

    form.setValue('rating', rating);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
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
    router.refresh();
    form.reset();
  };

  const renderStars = (currentRating: number) => {
    return [1, 2, 3, 4, 5].map((star) => {
      const isHalfFilled = currentRating === star - 0.5;
      const isFullFilled = currentRating >= star;

      return (
        <button
          key={star}
          ref={(el) => (starRefs.current[star] = el)}
          type="button"
          className="relative rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={(e) => handleStarClick(e, star)}
        >
          {isHalfFilled ? (
            <StarHalf
              className="absolute left-0 top-0 z-10 h-8 w-8 text-yellow-400"
              style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
            />
          ) : null}
          <Star
            className={`h-8 w-8 ${
              isFullFilled
                ? 'fill-yellow-400 text-yellow-400'
                : isHalfFilled
                ? 'text-yellow-400'
                : 'fill-none text-gray-300'
            }`}
          />
        </button>
      );
    });
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
                    {renderStars(field.value)}
                  </div>
                </FormControl>
                <FormDescription className="text-center">
                  Click left or right half of star to rate
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
