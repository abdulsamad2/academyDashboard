'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Loader2, Check, Clock } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  FormFieldFull,
  FormSection,
  FormShell
} from '@/components/ui/form-shell';
import { useToast } from '@/components/ui/use-toast';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePickerField } from '@/components/ui/time-picker';

import InputformField from '@/components/formField';
import SelectFormField from '@/components/selectFromField';

import { addLesson, updateLesson } from '@/action/addLesson';
import { getTutorHourlyForThisStudent } from '@/action/tutorHourly';

const FormSchema = z
  .object({
    name: z.string().min(1, 'Student name is required'),
    subject: z.string().min(1, 'Pick a subject'),
    date: z.date({ required_error: 'Pick a date' }),
    startTime: z.string().min(1, 'Pick a start time'),
    endTime: z.string().min(1, 'Pick an end time'),
    description: z.string().min(1, 'Add a short description of the lesson')
  })
  .refine(
    (data) => {
      const [sh, sm] = data.startTime.split(':').map(Number);
      const [eh, em] = data.endTime.split(':').map(Number);
      return eh * 60 + em > sh * 60 + sm;
    },
    {
      path: ['endTime'],
      message: 'End time must be after start time'
    }
  );

type LessonFormValue = z.infer<typeof FormSchema>;

interface LessonFormProps {
  initialData: {
    studentId?: string;
    tutorId?: string;
    lessonId?: string;
    [key: string]: any;
  } | null;
  subjects: any[];
}

// Lesson times are wall-clock values stored as UTC components (e.g. an
// 08:00 lesson is stored as ...T08:00:00Z). Always read/write in UTC so the
// time never shifts between the tutor's browser and the (UTC) server.
function formatTimeFromDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  });
}

// Convert a stored UTC date back to a local Date carrying the same Y/M/D,
// so the calendar shows the day the tutor actually picked.
function utcDateToLocal(value: string | Date) {
  const d = new Date(value);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function diffMinutes(start: string, end: string) {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

function formatDuration(mins: number) {
  if (mins <= 0) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export const LessonForm: React.FC<LessonFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [tutorhourly, setTutorHourly] = useState<number | undefined>(undefined);

  const isAdmin = session?.role === 'admin';
  const studentId = (initialData?.studentId ??
    (params?.studentId as string | undefined)) as string | undefined;
  const tutorId = (initialData?.tutorId ?? session?.id) as string | undefined;
  const isEditing = Boolean(initialData?.lessonId);

  useEffect(() => {
    let cancelled = false;
    if (!studentId || !tutorId) return;
    (async () => {
      const rate = await getTutorHourlyForThisStudent(studentId, tutorId);
      if (!cancelled) setTutorHourly(rate);
    })();
    return () => {
      cancelled = true;
    };
  }, [studentId, tutorId]);

  const subjectOptions = useMemo(
    () =>
      (initialData?.subject ?? []).map((item: any) => ({
        value: item,
        label: item
      })),
    [initialData]
  );

  const form = useForm<LessonFormValue>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: initialData?.name || initialData?.student?.name || '',
      date: initialData?.date ? utcDateToLocal(initialData.date) : new Date(),
      description: initialData?.description ?? '',
      subject: initialData?.subj ?? '',
      startTime: initialData?.startTime
        ? formatTimeFromDate(initialData.startTime)
        : '',
      endTime: initialData?.endTime
        ? formatTimeFromDate(initialData.endTime)
        : ''
    }
  });

  const startTime = form.watch('startTime');
  const endTime = form.watch('endTime');
  const durationMinutes = diffMinutes(startTime, endTime);

  // Date constraints: admin = ±3/+6 months; tutor = current month only
  const today = new Date();
  const fromDate = isAdmin
    ? new Date(today.getFullYear(), today.getMonth() - 3, 1)
    : new Date(today.getFullYear(), today.getMonth(), 1);
  const toDate = isAdmin
    ? new Date(today.getFullYear(), today.getMonth() + 6, 0)
    : new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const onSubmit = async (data: LessonFormValue) => {
    setLoading(true);
    try {
      const [startHours, startMinutes] = data.startTime.split(':').map(Number);
      const [endHours, endMinutes] = data.endTime.split(':').map(Number);

      // Build the date/times as UTC wall-clock: the picked day + picked time
      // become the UTC components, so "08:00" is stored as ...T08:00:00Z and
      // reads back as 08:00 on any browser or server (no timezone shift).
      const y = data.date.getFullYear();
      const m = data.date.getMonth();
      const d = data.date.getDate();

      const dateOnly = new Date(Date.UTC(y, m, d, 0, 0, 0, 0));
      const startDateTime = new Date(
        Date.UTC(y, m, d, startHours, startMinutes, 0, 0)
      );
      const endDateTime = new Date(
        Date.UTC(y, m, d, endHours, endMinutes, 0, 0)
      );

      const totalDuration = Math.floor(
        (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60)
      );

      const payload = {
        ...data,
        studentId,
        tutorId,
        date: dateOnly.toISOString(),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        totalDuration,
        tutorhourly
      };

      const res = await (isEditing
        ? updateLesson(initialData!.lessonId!, payload)
        : addLesson(payload));

      if (res?.error) {
        toast({
          variant: 'destructive',
          title: 'Could not save lesson',
          description: res.error
        });
        return;
      }

      toast({
        title: isEditing ? 'Lesson updated' : 'Lesson saved',
        description: 'Your changes have been recorded.'
      });
      router.refresh();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormShell
          title={isEditing ? 'Edit lesson' : 'New lesson'}
          description={
            isEditing
              ? 'Update the details of this lesson.'
              : 'Log a tutoring session you delivered.'
          }
          footer={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Check className="mr-1.5 h-4 w-4" />
                    {isEditing ? 'Save changes' : 'Save lesson'}
                  </>
                )}
              </Button>
            </>
          }
        >
          <FormSection
            title="Basics"
            description="Who the lesson is for and what was taught."
          >
            <InputformField
              control={form.control}
              loading={Boolean(initialData)}
              label="Student name"
              placeholder="e.g. Yaseen"
              type="text"
              name="name"
            />
            <SelectFormField
              name="subject"
              label="Subject"
              options={subjectOptions}
              control={form.control}
              placeholder="Pick subject"
            />
          </FormSection>

          <FormSection
            title="Schedule"
            description="The date and time the session took place."
          >
            <FormFieldFull>
              <DatePicker
                name="date"
                label="Date"
                control={form.control}
                fromDate={fromDate}
                toDate={toDate}
                description={
                  isAdmin
                    ? 'You can pick any date in the last 3 months or next 6.'
                    : 'You can only log lessons in the current month.'
                }
              />
            </FormFieldFull>
            <TimePickerField
              name="startTime"
              label="Start time"
              control={form.control}
            />
            <TimePickerField
              name="endTime"
              label="End time"
              control={form.control}
            />
            <FormFieldFull>
              <div className="inline-flex items-center gap-2 rounded-md border border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Duration:{' '}
                <span className="font-medium text-foreground">
                  {formatDuration(durationMinutes)}
                </span>
              </div>
            </FormFieldFull>
          </FormSection>

          <FormSection
            title="Notes"
            description="A short summary of what was covered."
          >
            <FormFieldFull>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Lesson description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Covered algebra chapter one — solving for x, simplifying expressions, two practice exercises."
                        className="min-h-[120px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormFieldFull>
          </FormSection>
        </FormShell>
      </form>
    </Form>
  );
};

export default LessonForm;
