'use client'
import { useState, useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { deleteJob, updateJobStatus } from '@/action/jobActions';
import { TutorRequest } from './types';
import { SearchBar } from './SearchBar';
import { FilterSection } from './FilterSection';
import { RequestCard } from './RequestCard';
import RequestTutorForm from './requestTutor'

interface TutorRequestsProps {
  tutorRequests: TutorRequest[];
}

export default function TutorRequests({ tutorRequests }: TutorRequestsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRequestTutorOpen, setIsRequestTutorOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TutorRequest | null>(
    null
  );
  const [filters, setFilters] = useState({
    studentLevel: '',
    mode: '',
    subject: ''
  });



  const uniqueSubjects = [...new Set(tutorRequests.map((r) => r.subject))];
  const uniqueModes = [...new Set(tutorRequests.map((r) => r.mode))];
  const uniqueLevels = [...new Set(tutorRequests.map((r) => r.studentLevel))];

  const filteredRequests = useMemo(() => {
    return tutorRequests.filter((request) => {
      const matchesSearch =
        request.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        (!filters.studentLevel ||
          request.studentLevel === filters.studentLevel) &&
        (!filters.mode || request.mode === filters.mode) &&
        (!filters.subject || request.subject === filters.subject);

      return matchesSearch && matchesFilters;
    });
  }, [tutorRequests, searchTerm, filters]);

  const handleStatusUpdate = async (jobId: string, newStatus: string) => {
    try {
      await updateJobStatus(jobId, newStatus);
      toast({
        title: 'Status updated',
        description: 'The tutor request status has been updated successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleEditJob = (request: TutorRequest) => {
    setSelectedRequest(request);
    setIsRequestTutorOpen(true);
  };

  const handleDeleteJob = async (id: string) => {
    try {
      await deleteJob(id);
      toast({
        title: 'Job deleted successfully',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: 'Failed to delete job',
        description: 'Please try again later',
        variant: 'destructive'
      });
    }
  };

  if (!tutorRequests.length) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No tutor requests
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Create a new request to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl overflow-auto px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">Tutor Requests</h1>

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <FilterSection
        filters={filters}
        setFilters={setFilters}
        uniqueLevels={uniqueLevels}
        uniqueModes={uniqueModes}
        uniqueSubjects={uniqueSubjects}
      />

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
        {filteredRequests.map((request) => (
          <RequestCard
           key={request.id}
            request={request}
            onStatusUpdate={updateJobStatus}
            onEdit={handleEditJob}
            onDelete={handleDeleteJob}
          />
        ))}
      </div>

      <Dialog open={isRequestTutorOpen} onOpenChange={setIsRequestTutorOpen}>
        <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[60vw]">
          <DialogHeader>
            <DialogTitle>Edit Tutor Request</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <RequestTutorForm
              //@ts-ignore
              initialData={{
                ...selectedRequest,
                level: selectedRequest.studentLevel
              }}
              onSuccess={() => {
                setIsRequestTutorOpen(false);
                toast({
                  title: 'Tutor request updated',
                  description:
                    'The tutor request has been successfully updated.'
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
