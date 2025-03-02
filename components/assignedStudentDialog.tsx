'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { getAssignedStudent } from '@/action/AssignTutor';
import { Loader2 } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  school?: string;
  level?: string | null;
  subject?: string[];
  class?: string;
  age?: string;
  sex?: string;
}

interface AssignedStudentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutorId: string; // This is actually the User.id, not Tutor.id based on the schema
  tutorName: string;
}

export function AssignedStudentsDialog({
  open,
  onOpenChange,
  tutorId,
  tutorName
}: AssignedStudentsDialogProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchAssignedStudents();
    }
  }, [open, tutorId]);

  const fetchAssignedStudents = async () => {
    try {
      const result = await getAssignedStudent(tutorId);
      setStudents(Array.isArray(result) ? result : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assigned students:', error);
      setStudents([]);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Students Assigned to {tutorName}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : students.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground">
              No students currently assigned to this tutor.
            </p>
          ) : (
            <ScrollArea className="max-h-[400px] pr-4">
              <div className="space-y-3">
                {students.map((student) => (
                  <Card
                    key={student.id}
                    className="flex items-center gap-3 p-3"
                  >
                    <Avatar className="h-10 w-10">
                      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        {student.name.charAt(0)}
                      </div>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate font-medium">{student.name}</h4>
                      <p className="truncate text-sm text-muted-foreground">
                        {student.school}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {student.level && (
                          <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                            {student.level}
                          </span>
                        )}
                        {student.age && (
                          <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                            Age: {student.age}
                          </span>
                        )}
                        {student.class && (
                          <span className="inline-flex items-center rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                            Class: {student.class}
                          </span>
                        )}
                      </div>
                      {student.subject && student.subject.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">
                            Subjects:
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {student.subject.slice(0, 3).map((sub, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800"
                              >
                                {sub}
                              </span>
                            ))}
                            {student.subject.length > 3 && (
                              <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                                +{student.subject.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
