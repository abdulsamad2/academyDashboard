'use client';

import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import {
  FormShell,
  FormSection,
  FormFieldFull
} from '@/components/ui/form-shell';
import {
  Loader2,
  X,
  FileText,
  Trash2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { tutorOnboarding } from '@/action/onBoarding';
import ReactSignatureCanvas from 'react-signature-canvas';
import EnhancedUpload from '../cloudinaryUpload';

const MALAYSIAN_STATES = [
  { label: 'Kuala Lumpur', value: 'kl' },
  { label: 'Selangor', value: 'sg' },
  { label: 'Pulau Pinang', value: 'pp' },
  { label: 'Johor', value: 'joh' },
  { label: 'Perak', value: 'prk' },
  { label: 'Melaka', value: 'mlk' },
  { label: 'Negeri Sembilan', value: 'ns' },
  { label: 'Terengganu', value: 'trg' },
  { label: 'Kelantan', value: 'kltn' },
  { label: 'Kedah', value: 'kd' },
  { label: 'Perlis', value: 'pls' },
  { label: 'Pahang', value: 'pah' },
  { label: 'Sabah', value: 'sb' },
  { label: 'Sarawak', value: 'srw' }
];

const COUNTRY = [{ label: 'Malaysia', value: 'Malaysia' }];
const EDUCATION = [
  { label: 'SPM', value: 'spm' },
  { label: 'Diploma', value: 'diploma' },
  { label: 'Masters', value: 'masters' },
  { label: 'Bachelors', value: 'bachelors' },
  { label: 'PhD', value: 'phd' }
];
const LEVELS = [
  { label: 'Kindergarten', value: 'kindergarten' },
  { label: 'Primary School', value: 'primary_school' },
  { label: 'Secondary School', value: 'secondary_school' },
  { label: 'Diploma', value: 'diploma' },
  { label: 'Degree', value: 'degree' },
  { label: 'Adult', value: 'adult' }
];

export const FormSchema = z.object({
  bio: z.string().min(50, { message: 'Bio must be at least 50 characters' }),
  state: z.string().min(1, { message: 'Please select a state' }),
  name: z.string().min(3, { message: 'Name is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  bank: z.string().min(1, { message: 'Bank name is required' }),
  bankaccount: z
    .string()
    .min(8, { message: 'Bank account must be at least 8 characters' }),
  currentposition: z
    .string()
    .min(1, { message: 'Current working position is required' }),
  education: z.string().min(1, { message: 'Education is required' }),
  spm: z.string().min(1, { message: 'SPM is required' }),
  certification: z.string().min(1, { message: 'Certification is required' }),
  age: z.string().min(1, { message: 'Age is required' }),
  subjects: z
    .array(z.string())
    .min(1, { message: 'Please select at least one subject' }),
  online: z.boolean(),
  experience: z
    .string()
    .min(50, { message: 'Experience must be at least 50 characters' }),
  profilepic: z.string().min(1, { message: 'Profile image must be uploaded' }),
  nric: z.string().min(1, { message: 'NRIC must be uploaded' }),
  resume: z.string().min(1, { message: 'Resume must be uploaded' }),
  country: z.string().min(1, { message: 'Country is required' }),
  levels: z.string().min(1, { message: 'Levels is required' }),
  degree: z.string().min(1, { message: 'Degree is required' }),
  agreementRead: z.boolean().refine((val) => val === true, {
    message: 'You must read and agree to the terms.'
  }),
  signature: z.boolean().optional()
});

type TutorFormValues = z.infer<typeof FormSchema>;

interface TutorFormProps {
  initialData: TutorFormValues | null;
  subject: { name: string }[];
}

const COMPLETENESS_GROUPS: {
  label: string;
  fields: (keyof TutorFormValues)[];
}[] = [
  { label: 'Identity', fields: ['name', 'age', 'profilepic'] },
  { label: 'Location', fields: ['country', 'state', 'city', 'address'] },
  { label: 'Banking', fields: ['bank', 'bankaccount'] },
  {
    label: 'Qualifications',
    fields: ['currentposition', 'education', 'certification', 'levels']
  },
  { label: 'Subjects', fields: ['subjects'] },
  { label: 'About', fields: ['bio', 'experience'] },
  { label: 'Documents', fields: ['nric', 'degree', 'spm', 'resume'] }
];

function isFieldFilled(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'boolean') return value;
  return true;
}

export const TutorOnboarding: React.FC<TutorFormProps> = ({
  initialData,
  subject
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session, update: updateSession } = useSession();
  const signatureRef = useRef<any>(null);
  const [isSigned, setIsSigned] = useState(false);

  const isEdit = !!initialData;
  const toastMessage = isEdit
    ? 'Tutor profile updated.'
    : 'Tutor profile created.';
  const action = isEdit ? 'Save changes' : 'Submit profile';

  const form = useForm<TutorFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData || {
      bio: '',
      levels: '',
      age: '',
      spm: '',
      experience: '',
      name: '',
      state: '',
      address: '',
      city: '',
      bank: '',
      bankaccount: '',
      currentposition: '',
      education: '',
      certification: '',
      subjects: [],
      online: false,
      profilepic: '',
      nric: '',
      resume: '',
      country: 'Malaysia',
      degree: '',
      agreementRead: false,
      signature: false
    }
  });

  const watched = form.watch();

  const completeness = useMemo(() => {
    const groups = COMPLETENESS_GROUPS.map((g) => {
      const filled = g.fields.filter((f) =>
        isFieldFilled((watched as any)[f])
      ).length;
      return {
        label: g.label,
        filled,
        total: g.fields.length,
        done: filled === g.fields.length
      };
    });
    const totalFields = groups.reduce((a, g) => a + g.total, 0);
    const filledFields = groups.reduce((a, g) => a + g.filled, 0);
    const pct = Math.round((filledFields / totalFields) * 100);
    return { groups, pct, filledFields, totalFields };
  }, [watched]);

  const onSubmit = async (data: TutorFormValues) => {
    //@ts-ignore
    if (!initialData && signatureRef?.current?.isEmpty?.()) {
      form.setError('signature', { message: 'Signature is required' });
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const updatedData = {
        ...data,
        //@ts-ignore
        id: session?.id
      };
      //@ts-ignore
      const res = await tutorOnboarding(updatedData);

      if (res.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: res.error
        });
      } else {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name: data.name,
            onboarding: false,
            role: 'tutor'
          }
        });
        toast({
          title: toastMessage,
          description: 'Your profile has been successfully updated.'
        });
        router.push('/tutor-dashboard');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was a problem updating your profile.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignatureEnd = () => {
    //@ts-ignore
    setIsSigned(!signatureRef.current?.isEmpty());
    //@ts-ignore
    form.setValue('signature', !signatureRef.current?.isEmpty());
  };

  const clearSignature = () => {
    //@ts-ignore
    signatureRef.current?.clear();
    setIsSigned(false);
    form.setValue('signature', false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile completeness summary */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-elevated-sm">
          <div className="flex flex-col gap-3 border-b border-border/80 bg-muted/30 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                Profile completeness
              </p>
              <p className="text-xs text-muted-foreground">
                {completeness.filledFields} of {completeness.totalFields}{' '}
                required fields filled
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="h-2 w-40 overflow-hidden rounded-full bg-muted"
                aria-hidden
              >
                <div
                  className={`h-full transition-all ${
                    completeness.pct === 100
                      ? 'bg-success'
                      : completeness.pct >= 60
                      ? 'bg-primary'
                      : 'bg-warning'
                  }`}
                  style={{ width: `${completeness.pct}%` }}
                />
              </div>
              <span className="text-sm font-semibold tabular-nums text-foreground">
                {completeness.pct}%
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 px-6 py-3">
            {completeness.groups.map((g) => (
              <Badge
                key={g.label}
                variant={g.done ? 'secondary' : 'outline'}
                className={
                  g.done
                    ? 'gap-1 border-success/40 bg-success-muted text-success'
                    : 'gap-1 border-warning/40 bg-warning-muted text-warning'
                }
              >
                {g.done ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
                <span>
                  {g.label} {g.filled}/{g.total}
                </span>
              </Badge>
            ))}
          </div>
        </div>

        <FormShell
          title="Your tutor profile"
          description="Parents see this when browsing tutors — keep it accurate and up to date."
          footer={
            <Button type="submit" disabled={loading} className="min-w-[160px]">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                action
              )}
            </Button>
          }
        >
          {/* Identity */}
          <FormSection
            title="Identity"
            description="Your photo and basic info — visible to parents."
          >
            <FormFieldFull>
              <FormField
                control={form.control}
                name="profilepic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile picture</FormLabel>
                    <FormControl>
                      <EnhancedUpload
                        title="Upload profile picture"
                        initialUrl={field.value}
                        onUpload={(url) => field.onChange(url)}
                        //@ts-ignore
                        userId={session?.id}
                        acceptedFileTypes={['image/*']}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormFieldFull>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Aisha Rahman" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 32 years" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          {/* Contact & location */}
          <FormSection
            title="Contact & location"
            description="Used to match you with nearby students for in-person sessions."
          >
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COUNTRY.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MALAYSIAN_STATES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Your city" {...field} />
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
                    <Input placeholder="Your address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          {/* Banking */}
          <FormSection
            title="Banking"
            description="Where we send your payouts. Required before you can be paid."
          >
            <FormFieldFull>
              <div className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning-muted px-3 py-2 text-xs text-warning">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  Make sure these match your bank records exactly — mismatches
                  will delay your payout.
                </span>
              </div>
            </FormFieldFull>
            <FormField
              control={form.control}
              name="bank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Maybank" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankaccount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your bank account number"
                      inputMode="numeric"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          {/* Qualifications */}
          <FormSection
            title="Qualifications"
            description="Helps parents trust you and match you to the right level."
          >
            <FormField
              control={form.control}
              name="currentposition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current position</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Math teacher at XYZ school"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highest education</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EDUCATION.map((e) => (
                        <SelectItem key={e.value} value={e.value}>
                          {e.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="certification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualification title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Bachelors in Computer Science"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="levels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level I can teach</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LEVELS.map((l) => (
                        <SelectItem key={l.value} value={l.value}>
                          {l.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormFieldFull>
              <FormField
                control={form.control}
                name="online"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-0.5 leading-none">
                      <FormLabel className="cursor-pointer">
                        Available for online teaching
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Check this if you can run sessions over video.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </FormFieldFull>
          </FormSection>

          {/* Subjects */}
          <FormSection
            title="Subjects"
            description="Pick everything you're confident teaching."
            columns={1}
          >
            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add a subject</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      if (!field.value.includes(value)) {
                        field.onChange([...field.value, value]);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subjects to add" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60">
                      {subject?.map((item) => (
                        <SelectItem key={item.name} value={item.name}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {field.value.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5 rounded-lg border border-border bg-muted/30 p-3">
                      {field.value.map((s, index) => (
                        <Badge
                          key={`${s}-${index}`}
                          variant="secondary"
                          className="gap-1 pr-1"
                        >
                          <span>{s}</span>
                          <button
                            type="button"
                            aria-label={`Remove ${s}`}
                            onClick={() => {
                              const next = [...field.value];
                              next.splice(index, 1);
                              field.onChange(next);
                            }}
                            className="rounded-full p-0.5 hover:bg-foreground/10"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-muted-foreground">
                      No subjects added yet.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          {/* About you */}
          <FormSection
            title="About you"
            description="Two short paragraphs parents will read on your profile."
            columns={1}
          >
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your teaching philosophy and what makes you a great tutor."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    {field.value?.length ?? 0} / 50 characters minimum
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teaching experience</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Years of experience, schools/centres you've taught at, notable results."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    {field.value?.length ?? 0} / 50 characters minimum
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          {/* Documents */}
          <FormSection
            title="Documents"
            description="Verifies your identity and qualifications. Files stay private."
          >
            <FormField
              control={form.control}
              name="nric"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NRIC</FormLabel>
                  <FormControl>
                    <EnhancedUpload
                      title="Upload NRIC"
                      initialUrl={field.value}
                      onUpload={(url) => field.onChange(url)}
                      //@ts-ignore
                      userId={session?.id}
                      acceptedFileTypes={['image/*', 'application/pdf']}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highest degree / certificate</FormLabel>
                  <FormControl>
                    <EnhancedUpload
                      title="Upload degree / certificate"
                      initialUrl={field.value}
                      onUpload={(url) => field.onChange(url)}
                      //@ts-ignore
                      userId={session?.id}
                      acceptedFileTypes={['image/*', 'application/pdf']}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="spm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SPM / IGCSE result</FormLabel>
                  <FormControl>
                    <EnhancedUpload
                      title="Upload SPM certificate"
                      initialUrl={field.value}
                      onUpload={(url) => field.onChange(url)}
                      //@ts-ignore
                      userId={session?.id}
                      acceptedFileTypes={['image/*', 'application/pdf']}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume / CV</FormLabel>
                  <FormControl>
                    <EnhancedUpload
                      title="Upload resume"
                      initialUrl={field.value}
                      onUpload={(url) => field.onChange(url)}
                      //@ts-ignore
                      userId={session?.id}
                      acceptedFileTypes={['image/*', 'application/pdf']}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormSection>

          {/* Agreement (only on first submission) */}
          {!isEdit ? (
            <FormSection
              title="Tutor agreement"
              description="Please read and sign before submitting your profile."
              columns={1}
            >
              <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open('/agreement.pdf', '_blank')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Agreement (English)
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open('/agreement_malay.pdf', '_blank')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Perjanjian (Bahasa Melayu)
                </Button>
              </div>
              <FormField
                control={form.control}
                name="agreementRead"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isEdit}
                      />
                    </FormControl>
                    <div className="space-y-0.5 leading-none">
                      <FormLabel className="cursor-pointer">
                        I have read and agree to the tutor agreement
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        You can&apos;t change this once submitted.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="signature"
                render={() => (
                  <FormItem>
                    <FormLabel>Digital signature</FormLabel>
                    <FormControl>
                      <div className="overflow-hidden rounded-lg border border-border bg-white">
                        <ReactSignatureCanvas
                          //@ts-ignore
                          ref={signatureRef}
                          onEnd={handleSignatureEnd}
                          canvasProps={{
                            width: 500,
                            height: 180,
                            className: 'signature-canvas w-full'
                          }}
                        />
                      </div>
                    </FormControl>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {isSigned ? 'Signature captured.' : 'Sign above.'}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearSignature}
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Clear
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>
          ) : null}
        </FormShell>
      </form>
    </Form>
  );
};
