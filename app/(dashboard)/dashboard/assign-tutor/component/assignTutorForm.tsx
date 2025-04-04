'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ChevronLeft, ChevronsRight, Search, UserPlus, X } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { AlertModal } from '@/components/modal/alert-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { assignTutor, deleteTutorWithStudent } from '@/action/AssignTutor';

const FormSchema = z.object({
  name: z.string().min(3, { message: 'Student Name must be at least 3 characters' }),
  tutor: z.string().min(1, { message: 'Tutor is required' }),
  hourlyRate: z.coerce.number().min(0.5, { message: 'Hourly Rate must be at least 0.5' }),
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
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
  const [assignedTutors, setAssignedTutors] = useState<Tutor[]>(initialData?.assigned || []);
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const [currentHourlyRate, setCurrentHourlyRate] = useState<number>(0);

  const router = useRouter();
  const { toast } = useToast();

  const title = initialData ? 'Edit Tutor Assignment' : 'Assign New Tutor';
  const description = initialData ? 'Modify tutor assignments.' : 'Assign a new tutor to the student.';
  const toastMessage = initialData ? 'Tutor assignments updated.' : 'New tutor assigned.';
  const action = initialData ? 'Save changes' : 'Assign Tutor';

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: initialData?.name || '',
      tutor: '',
      hourlyRate: undefined,
    },
  });

  useEffect(() => {
    if (initialData?.tutors) {
      const availableTutors = initialData.tutors.filter(
        (tutor) => !assignedTutors.some((assigned) => assigned.id === tutor.id)
      );
      setFilteredTutors(availableTutors);
    }
  }, [initialData?.tutors, assignedTutors]);

  const onDelete = async () => {
    if (!initialData?.studentId || !selectedTutorId) return;
    try {
      setLoading(true);
      await deleteTutorWithStudent(initialData.studentId, selectedTutorId);
      
      const removedTutor = assignedTutors.find((tutor) => tutor.id === selectedTutorId);
      setAssignedTutors(assignedTutors.filter((tutor) => tutor.id !== selectedTutorId));
      
      if (removedTutor) {
        setFilteredTutors((prev) => [...prev, removedTutor]);
      }

      toast({
        title: 'Success',
        description: 'Tutor has been successfully removed.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove the tutor. Please try again.',
      });
    } finally {
      setLoading(false);
      setOpen(false);
      setSelectedTutorId(null);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!initialData?.studentId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Student ID is required.',
      });
      return;
    }

    try {
      setLoading(true);
      const tutorToAssign = filteredTutors.find((tutor) => tutor.id === data.tutor);
      
      if (!tutorToAssign) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Please select a tutor to assign.',
        });
        return;
      }

      await assignTutor(initialData.studentId, data.tutor, data.hourlyRate);
      
      setAssignedTutors((prev) => [...prev, { ...tutorToAssign, hourlyRate: data.hourlyRate }]);
      setFilteredTutors((prev) => prev.filter((tutor) => tutor.id !== data.tutor));
      
      form.reset({ 
        name: initialData?.name || '', 
        tutor: '',
        hourlyRate: undefined,
      });
      
      toast({
        title: 'Success',
        description: toastMessage,
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to assign the tutor. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTutor = async (tutorId: string) => {
    if (!initialData?.studentId) return;

    const hourlyRate = form.getValues('hourlyRate');
    
    if (!hourlyRate || hourlyRate < 0.5) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please set a valid hourly rate (minimum 0.5).',
      });
      return;
    }

    try {
      setLoading(true);
      const tutorToAssign = filteredTutors.find((tutor) => tutor.id === tutorId);
      
      if (!tutorToAssign) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Selected tutor not found.',
        });
        return;
      }

      await assignTutor(initialData.studentId, tutorId, hourlyRate);
      
      setAssignedTutors((prev) => [...prev, { ...tutorToAssign, hourlyRate }]);
      setFilteredTutors((prev) => prev.filter((tutor) => tutor.id !== tutorId));
      
      form.setValue('tutor', tutorId);
      
      toast({
        title: 'Success',
        description: 'Tutor successfully assigned.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to assign the tutor. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowercasedQuery = query.toLowerCase();
    const filtered = initialData?.tutors.filter(
      (tutor) =>
        !assignedTutors.some((assigned) => assigned.id === tutor.id) &&
        (tutor.name.toLowerCase().includes(lowercasedQuery) || 
         tutor.email.toLowerCase().includes(lowercasedQuery))
    ) || [];
    setFilteredTutors(filtered);
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <AlertModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onConfirm={onDelete}
          loading={loading}
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name</FormLabel>
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

            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tutor Hourly Rate</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.5"
                      min="0.5"
                      placeholder="Enter hourly rate for this tutor"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tutor"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input {...field} type="hidden" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Assigned Tutors</FormLabel>
              <ScrollArea className="h-[100px] w-full rounded-md border p-4">
                <div className="flex flex-wrap gap-2">
                  {assignedTutors.flat().map((tutor) => (
                    <Badge
                      key={tutor.id}
                      variant="secondary"
                      className="flex items-center gap-2 px-3 py-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={tutor.avatar} alt={tutor.name} />
                          <AvatarFallback>
                            {tutor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{tutor.name}</span>
                        {tutor.hourlyRate && (
                          <span className="text-muted-foreground">
                            ({`RM ${tutor.hourlyRate}/hr`})
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0.5 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          setSelectedTutorId(tutor.id);
                          setOpen(true);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  {assignedTutors.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No tutors assigned yet
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-4">
              <FormLabel>Available Tutors</FormLabel>
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tutors by name or email"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1"
                />
              </div>
              <ScrollArea className="h-[200px] w-full rounded-md border">
                <div className="space-y-2 p-4">
                  {filteredTutors.map((tutor) => (
                    <div
                      key={tutor.id}
                      className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={tutor.avatar} alt={tutor.name} />
                          <AvatarFallback>
                            {tutor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link
                            href={`/dashboard/tutor/${tutor.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <p className="font-medium">{tutor.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {tutor.email}
                            </p>
                          </Link>
                        </div>
                      </div>
                      <div></div>

                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleAssignTutor(tutor.id)}
                        disabled={loading || !form.getValues('hourlyRate')}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Assign
                      </Button>
                    </div>
                  ))}
                  {filteredTutors.length === 0 && (
                    <p className="p-4 text-center text-sm text-muted-foreground">
                      No available tutors found
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </form>
        </Form>
        <Button
          onClick={() => router.replace('/dashboard/student')}
          className="mt-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Done go back
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssignTutor;