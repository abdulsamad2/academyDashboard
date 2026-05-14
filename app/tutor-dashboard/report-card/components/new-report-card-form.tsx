'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { upsertReportCard } from '@/action/reportCard';

interface AssignedStudent {
  id: string;
  name: string;
  subject?: string[] | null;
}

export function NewReportCardForm({
  students
}: {
  students: AssignedStudent[];
}) {
  const router = useRouter();
  const [studentId, setStudentId] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const selectedStudent = students.find((s) => s.id === studentId);
  const subjects = selectedStudent?.subject ?? [];

  const handleCreate = async () => {
    if (!studentId || !subject) {
      toast({
        variant: 'destructive',
        title: 'Pick a student and subject'
      });
      return;
    }
    setLoading(true);
    try {
      const res = await upsertReportCard({ studentId, subject });
      if (res.error || !res.card) {
        toast({
          variant: 'destructive',
          title: 'Could not create report card',
          description: res.error
        });
        return;
      }
      router.push(`/tutor-dashboard/report-card/${res.card.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-1.5">
        <Label>Student</Label>
        <Select
          value={studentId}
          onValueChange={(v) => {
            setStudentId(v);
            setSubject('');
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pick an assigned student" />
          </SelectTrigger>
          <SelectContent>
            {students.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                No assigned students
              </div>
            ) : (
              students.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-1.5">
        <Label>Subject</Label>
        <Select
          value={subject}
          onValueChange={setSubject}
          disabled={!studentId}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                !studentId
                  ? 'Pick a student first'
                  : subjects.length === 0
                  ? 'No subjects on this student'
                  : 'Pick a subject'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((sub) => (
              <SelectItem key={sub} value={sub}>
                {sub}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleCreate}
        disabled={loading || !studentId || !subject}
        className="sm:w-auto"
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Plus className="mr-2 h-4 w-4" />
        )}
        Create / open
      </Button>
    </div>
  );
}
