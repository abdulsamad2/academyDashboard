'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  ArrowLeft,
  Check,
  Info,
  Loader2,
  Search,
  UserPlus,
  Users,
  X
} from 'lucide-react';
import Link from 'next/link';

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
import { Badge } from '@/components/ui/badge';
import { AlertModal } from '@/components/modal/alert-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmptyState } from '@/components/ui/empty-state';
import {
  FormFieldFull,
  FormSection,
  FormShell
} from '@/components/ui/form-shell';
import { cn } from '@/lib/utils';
import { assignTutor, deleteTutorWithStudent } from '@/action/AssignTutor';

const FormSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'Student name must be at least 3 characters' }),
    tutor: z.string().min(1, { message: 'Tutor is required' }),
    tuitionFee: z.coerce
      .number()
      .min(0.5, { message: 'Tuition fee must be at least 0.5' }),
    tutorAllowance: z.coerce
      .number()
      .min(0.5, { message: 'Tutor allowance must be at least 0.5' })
  })
  .refine((data) => data.tutorAllowance <= data.tuitionFee, {
    path: ['tutorAllowance'],
    message: 'Tutor allowance cannot exceed tuition fee'
  });

type FormValues = z.infer<typeof FormSchema>;

interface Tutor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  hourlyRate?: number;
}

interface AssignTutorProps {
  initialData: {
    studentId: string;
    name: string;
    assigned: Tutor[];
    tutors: Tutor[];
  } | null;
}

export const AssignTutor: React.FC<AssignTutorProps> = ({ initialData }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [assignedTutors, setAssignedTutors] = useState<Tutor[]>(
    initialData?.assigned || []
  );
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: initialData?.name || '',
      tutor: '',
      tuitionFee: undefined as unknown as number,
      tutorAllowance: undefined as unknown as number
    }
  });

  const tuitionFee = form.watch('tuitionFee');
  const tutorAllowance = form.watch('tutorAllowance');
  const platformCut = useMemo(() => {
    const f = Number(tuitionFee);
    const a = Number(tutorAllowance);
    if (!Number.isFinite(f) || !Number.isFinite(a)) return null;
    return Math.max(0, f - a);
  }, [tuitionFee, tutorAllowance]);
  const isPickerEnabled =
    Number(tuitionFee) > 0 &&
    Number(tutorAllowance) > 0 &&
    Number(tutorAllowance) <= Number(tuitionFee);

  const availableTutors = useMemo(() => {
    const base = (initialData?.tutors ?? []).filter(
      (t) => !assignedTutors.some((a) => a.id === t.id)
    );
    if (!searchQuery.trim()) return base;
    const q = searchQuery.toLowerCase();
    return base.filter(
      (t) =>
        t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)
    );
  }, [initialData?.tutors, assignedTutors, searchQuery]);

  const onDelete = async () => {
    if (!initialData?.studentId || !selectedTutorId) return;
    try {
      setLoading(true);
      await deleteTutorWithStudent(initialData.studentId, selectedTutorId);
      setAssignedTutors((prev) => prev.filter((t) => t.id !== selectedTutorId));
      toast({
        title: 'Tutor removed',
        description: 'They no longer appear on this student.'
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Could not remove',
        description: 'Please try again.'
      });
    } finally {
      setLoading(false);
      setOpen(false);
      setSelectedTutorId(null);
    }
  };

  const performAssign = async (tutorId: string) => {
    if (!initialData?.studentId) return;
    const fee = Number(form.getValues('tuitionFee'));
    const allow = Number(form.getValues('tutorAllowance'));

    const parsed = FormSchema.safeParse({
      name: initialData.name,
      tutor: tutorId,
      tuitionFee: fee,
      tutorAllowance: allow
    });
    if (!parsed.success) {
      toast({
        variant: 'destructive',
        title: 'Invalid rates',
        description:
          parsed.error.issues[0]?.message ?? 'Check the fee and allowance.'
      });
      return;
    }

    try {
      setLoading(true);
      const tutor = availableTutors.find((t) => t.id === tutorId);
      if (!tutor) return;
      await assignTutor(initialData.studentId, tutorId, fee, allow);
      setAssignedTutors((prev) => [...prev, { ...tutor, hourlyRate: fee }]);
      form.setValue('tutor', tutorId);
      toast({
        title: 'Tutor assigned',
        description: `${tutor.name} can now log lessons for this student.`
      });
      router.refresh();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Could not assign',
        description: 'Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((d) => performAssign(d.tutor))}
        className="space-y-4"
      >
        <AlertModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={onDelete}
          loading={loading}
        />

        <FormShell
          title={initialData ? 'Edit tutor assignment' : 'Assign a tutor'}
          description={
            initialData
              ? 'Update the rates or add another tutor to this student.'
              : 'Set the tuition fee (what the parent pays) and the tutor allowance (what the tutor earns). The difference is the platform fee.'
          }
          footer={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.replace('/dashboard/student')}
                disabled={loading}
              >
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Done
              </Button>
            </>
          }
        >
          {/* Student name (locked when editing) */}
          <FormSection
            title="Student"
            description="The student you're assigning a tutor to."
          >
            <FormFieldFull>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground">
                      Student name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!!initialData}
                        placeholder="Enter student name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormFieldFull>
          </FormSection>

          {/* Rates */}
          <FormSection
            title="Rates"
            description="Tuition fee is billed to the parent. Tutor allowance is paid out to the tutor. The platform keeps the difference."
          >
            <FormField
              control={form.control}
              name="tuitionFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Tuition fee
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      / hour
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                        RM
                      </span>
                      <Input
                        {...field}
                        type="number"
                        step="0.5"
                        min="0.5"
                        placeholder="30"
                        className="h-10 pl-10"
                      />
                    </div>
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    What the parent pays.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tutorAllowance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">
                    Tutor allowance
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      / hour
                    </span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                        RM
                      </span>
                      <Input
                        {...field}
                        type="number"
                        step="0.5"
                        min="0.5"
                        placeholder="25"
                        className="h-10 pl-10"
                      />
                    </div>
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    What the tutor earns.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormFieldFull>
              {platformCut !== null &&
              Number(tuitionFee) > 0 &&
              Number(tutorAllowance) > 0 ? (
                <div className="grid grid-cols-3 gap-2 rounded-lg border border-border/60 bg-muted/30 p-3 text-center">
                  <Stat
                    label="Parent pays"
                    value={`RM ${Number(tuitionFee).toFixed(2)}/hr`}
                  />
                  <Stat
                    label="Tutor earns"
                    value={`RM ${Number(tutorAllowance).toFixed(2)}/hr`}
                  />
                  <Stat
                    label="Platform keeps"
                    value={`RM ${platformCut.toFixed(2)}/hr`}
                    valueClass={
                      platformCut > 0 ? 'text-success' : 'text-warning'
                    }
                  />
                </div>
              ) : (
                <div className="flex items-start gap-2 rounded-lg border border-dashed border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  Enter both rates above to preview the platform cut.
                </div>
              )}
            </FormFieldFull>
          </FormSection>

          {/* Already assigned */}
          {assignedTutors.length > 0 && (
            <FormSection
              title="Already assigned"
              description="Tutors who can already log lessons for this student."
            >
              <FormFieldFull>
                <div className="flex flex-wrap gap-2">
                  {assignedTutors.map((tutor) => (
                    <Badge
                      key={tutor.id}
                      variant="secondary"
                      className="flex items-center gap-2 px-3 py-1.5"
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={tutor.avatar} alt={tutor.name} />
                        <AvatarFallback className="text-[10px]">
                          {tutor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{tutor.name}</span>
                      {tutor.hourlyRate ? (
                        <span className="text-muted-foreground">
                          · RM {tutor.hourlyRate}/hr
                        </span>
                      ) : null}
                      <button
                        type="button"
                        aria-label="Remove tutor"
                        className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          setSelectedTutorId(tutor.id);
                          setOpen(true);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </FormFieldFull>
            </FormSection>
          )}

          {/* Pick tutor */}
          <FormSection
            title="Pick a tutor"
            description="Search the roster and assign with one click. Rates above are applied to the chosen tutor."
          >
            <FormFieldFull>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email"
                  className="h-10 pl-9"
                />
              </div>
            </FormFieldFull>

            <FormFieldFull>
              <ScrollArea className="h-[280px] rounded-lg border border-border bg-card">
                <div className="p-2">
                  {availableTutors.length === 0 ? (
                    <EmptyState
                      icon={Users}
                      title="No tutors match"
                      description={
                        searchQuery
                          ? 'Try a different search.'
                          : 'All tutors are already assigned to this student.'
                      }
                      className="border-0 bg-transparent py-8"
                    />
                  ) : (
                    <ul className="space-y-1">
                      {availableTutors.map((tutor) => (
                        <li
                          key={tutor.id}
                          className="group flex items-center justify-between gap-3 rounded-md p-2 transition-colors hover:bg-muted/40"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar className="h-9 w-9 shrink-0">
                              <AvatarImage
                                src={tutor.avatar}
                                alt={tutor.name}
                              />
                              <AvatarFallback className="text-xs">
                                {tutor.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <Link
                                href={`/dashboard/tutor/${tutor.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block truncate text-sm font-medium text-foreground hover:underline"
                              >
                                {tutor.name}
                              </Link>
                              <p className="truncate text-xs text-muted-foreground">
                                {tutor.email}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            disabled={loading || !isPickerEnabled}
                            onClick={() => performAssign(tutor.id)}
                            className="shrink-0"
                          >
                            {loading ? (
                              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                            )}
                            Assign
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </ScrollArea>
              {!isPickerEnabled && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Set the tuition fee and tutor allowance above before
                  assigning.
                </p>
              )}
            </FormFieldFull>
          </FormSection>
        </FormShell>
      </form>
    </Form>
  );
};

function Stat({
  label,
  value,
  valueClass
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div>
      <p className="text-2xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          'mt-0.5 text-sm font-semibold text-foreground',
          valueClass
        )}
      >
        {value}
      </p>
    </div>
  );
}

export default AssignTutor;
