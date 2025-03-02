'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  UserCog,
  UserX,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { getTutor } from '@/action/AssignTutor';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AssignedTutorsButtonProps {
  studentId: string;
  studentName: string;
}

interface Tutor {
  id: string;
  tutorId: string;
  tutorhourly: number;
  tutor?: {
    name: string;
    email?: string;
    phone?: string;
    profilepic?: string;
  };
}

const AssignedTutorsButton = ({
  studentId,
  studentName
}: AssignedTutorsButtonProps) => {
  const [open, setOpen] = useState(false);
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch assigned tutors
  useEffect(() => {
    const fetchAssignedTutors = async () => {
      if (!studentId) return;

      try {
        setLoading(true);
        const result = await getTutor(studentId);
        setTutors(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error('Error fetching assigned tutors:', error);
        setTutors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedTutors();
  }, [studentId]);

  // Determine the appropriate icon based on tutor assignment status
  const renderStatusIcon = () => {
    if (loading) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }

    if (tutors.length > 0) {
      return (
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="ml-1.5 text-xs font-medium text-green-600">
            {tutors.length}
          </span>
        </div>
      );
    } else {
      return <XCircle className="h-5 w-5 text-red-400" />;
    }
  };

  return (
    <div className="flex flex-col space-y-1">
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
                ? 'Checking assigned tutors...'
                : tutors.length > 0
                ? `${tutors.length} tutor${
                    tutors.length !== 1 ? 's' : ''
                  } assigned`
                : 'No tutors assigned'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Collapsible trigger */}
        <Collapsible
          open={isCollapsibleOpen}
          onOpenChange={setIsCollapsibleOpen}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex w-[120px] items-center justify-between gap-1"
              disabled={tutors.length === 0}
            >
              <div className="flex items-center gap-1">
                {tutors.length > 0 ? (
                  <UserCog className="h-4 w-4 text-blue-500" />
                ) : (
                  <UserX className="h-4 w-4 text-gray-500" />
                )}
                <span>Tutors</span>
              </div>
              {isCollapsibleOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>

          {/* Collapsible content */}
          <CollapsibleContent className="mt-2 space-y-2">
            {tutors.map((tutor) => (
              <div
                key={tutor.id}
                className="flex items-center gap-2 rounded-md bg-muted/50 p-2"
              >
                <Avatar className="h-8 w-8">
                  {tutor.tutor?.profilepic ? (
                    <AvatarImage
                      src={tutor.tutor.profilepic}
                      alt={tutor.tutor?.name || 'Tutor'}
                    />
                  ) : (
                    <AvatarFallback>
                      {tutor.tutor?.name?.charAt(0) || 'T'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {tutor.tutor?.name || 'Unknown Tutor'}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    RM{tutor.tutorhourly}/hr
                  </Badge>
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default AssignedTutorsButton;
