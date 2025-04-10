'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
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
      
      const fetchAssignedStudents = async () => {
        try {
          const result = await getAssignedStudent(tutorId);
          setStudents(Array.isArray(result) ? result : []);
          setLoading(false);
        } catch (error) {
          // eslint-disable-next-line no-console
          setStudents([]);
          setLoading(false);
        }
      };
      
      fetchAssignedStudents();
    }
  }, [open, tutorId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Students Assigned to {tutorName}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex-grow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : students.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground">
              No students currently assigned to this tutor.
            </p>
          ) : (
            <div className="h-full max-h-[calc(90vh-130px)] overflow-auto pr-1">
              <div className="space-y-3 pb-2">
                {students.map((student) => (
                  <Card
                    key={student.id}
                    className="flex items-center gap-3 p-3 hover:bg-muted/20 transition-colors"
                  >
                    <Avatar className="h-10 w-10 flex-shrink-0">
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
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-100/50">
                            {student.level}
                          </span>
                        )}
                        {student.age && (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 border border-green-100/50">
                            Age: {student.age}
                          </span>
                        )}
                        {student.class && (
                          <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700 border border-purple-100/50">
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
                                className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700 border border-gray-100/50"
                              >
                                {sub}
                              </span>
                            ))}
                            {student.subject.length > 3 && (
                              <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700 border border-gray-100/50">
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
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
