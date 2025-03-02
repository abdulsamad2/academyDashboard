'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Users, UserX, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { AssignedStudentsDialog } from '@/components/assignedStudentDialog';
import { getAssignedStudent } from '@/action/AssignTutor';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface AssignedStudentsButtonProps {
  tutorId: string;
  tutorName: string;
}

const AssignedStudentsButton = ({
  tutorId,
  tutorName
}: AssignedStudentsButtonProps) => {
  const [open, setOpen] = useState(false);
  const [hasStudents, setHasStudents] = useState<boolean | null>(null);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // Check if the tutor has any assigned students
  useEffect(() => {
    const checkAssignedStudents = async () => {
      if (!tutorId) {
        setHasStudents(false);
        return;
      }

      try {
        setLoading(true);
        const students = await getAssignedStudent(tutorId);

        // Ensure students is treated as an array
        const studentsArray = Array.isArray(students) ? students : [];

        setHasStudents(studentsArray.length > 0);
        setStudentCount(studentsArray.length);
      } catch (error) {
        console.error('Error checking assigned students:', error);
        setHasStudents(false);
      } finally {
        setLoading(false);
      }
    };

    checkAssignedStudents();
  }, [tutorId]);

  // Determine the appropriate icon based on student assignment status
  const renderStatusIcon = () => {
    if (loading) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }

    if (hasStudents === null) {
      return null;
    }

    if (hasStudents) {
      return (
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="ml-1.5 text-xs font-medium text-green-600">
            {studentCount}
          </span>
        </div>
      );
    } else {
      return <XCircle className="h-5 w-5 text-red-400" />;
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Status indicator */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/30">
              {renderStatusIcon()}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {loading
              ? 'Checking student assignments...'
              : hasStudents
              ? `${studentCount} student${
                  studentCount !== 1 ? 's' : ''
                } assigned`
              : 'No students assigned'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* View button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1"
      >
        {hasStudents ? (
          <Users className="h-4 w-4 text-blue-500" />
        ) : (
          <UserX className="h-4 w-4 text-gray-500" />
        )}
        <span>View</span>
      </Button>

      <AssignedStudentsDialog
        open={open}
        onOpenChange={setOpen}
        tutorId={tutorId}
        tutorName={tutorName}
      />
    </div>
  );
};

export default AssignedStudentsButton;
