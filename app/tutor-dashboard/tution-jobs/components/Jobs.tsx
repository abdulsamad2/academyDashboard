'use client'
import { useState, useEffect } from 'react';
import { Search, Calendar, BookOpen, MapPin, Briefcase, GraduationCap, BadgeHelp, Clock, DollarSign, Info, Check, User, Banknote } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applyForJob } from '@/action/applyForJob';
import { ScrollArea } from '@/components/ui/scroll-area';
import { checkIfApplied } from '@/action/jobActions';

const applicationSchema = z.object({
  jobId: z.string(),
  coverLetter: z.string().min(150, "Cover letter must be at least 150 characters"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface TutorRequest {
  application: any;
  sessionsPerMonth: string;
  sessionsPerWeek: string;
  timeRange: string;
  hoursPerSession: string;
  dayAvailable: string;
  createdAt: string | number | Date;
  studentAge: string;
  status: string;
  start: string | number | Date;
  studentLevel: any;
  hourly: string;
  location: string | undefined;
  id: number;
  subject: string;
  requriments: string;
  updatedAt: string;
  mode?: string;
  hasApplied?: boolean; // New field to track if the current tutor has applied
  applicationStatus?: string; // New field to track application status
}

interface JobsProps {
  tutorRequests: TutorRequest[];
  currentTutorId?: string; // Add current tutor ID prop
}

const DetailRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string, }) => (
  <div className="flex items-center space-x-3 text-sm">
    <Icon className="h-4 w-4 text-gray-400" />
    <span className="font-medium">{label}:</span>
    <span>{value}</span>
  </div>
);

const ApplicationStatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} px-2 py-1`}>
      {status === 'accepted' && <Check className="h-3 w-3 mr-1" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function Jobs({ tutorRequests, currentTutorId }: JobsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });
  const [submissionStatus, setSubmissionStatus] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    setMounted(true);

  }, []);

  const filteredRequests = tutorRequests.filter(request =>
    request.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      await applyForJob(data);
      setSubmissionStatus("success");
      reset();
    } catch (error) {
      setSubmissionStatus("error");
    }
  };

  if (!mounted) return null;
  if (!tutorRequests.length) return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="text-center">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No tutor requests</h3>
        <p className="mt-1 text-sm text-gray-500">Check back later for new opportunities.</p>
      </div>
    </div>
  );

  const FullDetailsDialog = ({ request }: { request: TutorRequest }) => (
    <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className="w-full">
        <Info className="h-4 w-4 mr-2" />
        View Details
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle className="text-xl">{request.subject} Tutoring Request</DialogTitle>
        <DialogDescription>Reference ID: #{request.id}</DialogDescription>
      </DialogHeader>
      <div className="py-4 space-y-6">
        <div className="flex flex-wrap gap-2">
          <Badge variant={request.status === 'in review' ? 'default' : 'secondary'}>
            {request.status}
          </Badge>
         
        </div>
  
        <div className="grid grid-cols-2 gap-4">
        <DetailRow icon={Clock} label="Posted" value={new Date(request.createdAt).toLocaleDateString()} />

          <DetailRow icon={BookOpen} label="Subject" value={request.subject} />
          <DetailRow icon={BadgeHelp} label="Student Level" value={request.studentLevel} />
          <DetailRow icon={Calendar} label="Start Date" value={new Date(request.start).toLocaleDateString()} />
          <div className='col-span-full'>          
            <DetailRow icon={MapPin} label="Location" value={request.location || 'online'} />
          </div>
          <DetailRow icon={Banknote} label="Hourly Rate" value={`${request.hourly}/hr`} />
          <DetailRow icon={User} label="Student Age" value={request.studentAge} />
          <DetailRow icon={Calendar} label="Days Available" value={request.dayAvailable} />
          <DetailRow icon={Clock} label="Time Range" value={request.timeRange} />
          <DetailRow icon={Clock} label="Hours Per Session" value={request.hoursPerSession} />
          <DetailRow icon={Calendar} label="Sessions Per Week" value={request.sessionsPerWeek} />
          <DetailRow icon={Calendar} label="Sessions Per Month" value={request.sessionsPerMonth} />
        </div>
  
        <div>
          <h4 className="font-semibold mb-2">Requirements & Details</h4>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{request.requriments}</p>
          </ScrollArea>
        </div>
      </div>    
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Tutor Opportunities</h1>

      <div className="mb-8 max-w-md mx-auto relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="search"
          placeholder="Search by subject or location"
          className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredRequests.map(request => {
          const hasApplied = request.application.some((app: any) => app.tutorId === currentTutorId);          
          return (
            <Card key={request.id} className="flex flex-col relative transition-all duration-200 hover:shadow-lg">
            <FullDetailsDialog request={request} />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Badge variant={request.status === 'in review' ? 'default' : 'secondary'} className="text-xs px-2 py-1">
                  <BookOpen className="h-3 w-3 mr-2" />
                  {request.status}
                </Badge>
              </div>
              <div className="mt-4">
                <CardTitle className="text-lg">{request.subject}</CardTitle>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <Calendar className="h-3 w-3 mr-2" />
                  {new Date(request.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col space-y-4">
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    <User className="h-3 w-3 mr-2" />
                    {request.studentLevel.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary" className="self-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    {request.subject}
                  </Badge>
                </div>
                <div className="flex justify-between flex-wrap">
                  <div className="flex items-center space-x-2 text-sm">
                    <BadgeHelp className="h-4 w-4 text-gray-400" />
                    <span>{request.mode}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>{request.hourly}/hr</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="truncate" title={request.location}>{request.location}</span>
                </div>
              </div>
              <p className="text-sm flex-grow line-clamp-3" title={request.requriments}>
                {expandedId === request.id ? request.requriments : `${request.requriments.slice(0, 100)}...`}
              </p>

              {!hasApplied ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Apply as Tutor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <GraduationCap className="h-5 w-5" />
                        <span>Apply for {request.subject} Tutor Position</span>
                      </DialogTitle>
                    </DialogHeader>
                    {submissionStatus === "success" ? (
                      <div className="py-6 text-center">
                        <p className="text-lg font-semibold text-green-600">Application Submitted!</p>
                        <p className="mt-2 text-gray-700">Your application has been successfully sent. We’ll get back to you soon!</p>
                        <DialogFooter>
                          <Button onClick={() => setSubmissionStatus(null)} className="w-full">Close</Button>
                        </DialogFooter>
                      </div>
                    ) : submissionStatus === "error" ? (
                      <div className="py-6 text-center">
                        <p className="text-lg font-semibold text-red-600">Submission Failed</p>
                        <p className="mt-2 text-gray-700">There was an error submitting your application. Please try again later.</p>
                        <DialogFooter>
                          <Button onClick={() => setSubmissionStatus(null)} className="w-full">Close</Button>
                        </DialogFooter>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="coverLetter">Why are you a good fit for this job?</Label>
                          <Textarea
                            id="coverLetter"
                            placeholder="Describe your qualifications, experience, and teaching approach relevant to this position..."
                            {...register("coverLetter")}
                            className="min-h-[200px]" />
                          {errors.coverLetter && (
                            <p className="text-red-500">{errors.coverLetter.message}</p>
                          )}
                        </div>
                        <input type="hidden" {...register("jobId")} value={request.id} />
                        <DialogFooter>
                          <Button type="submit" className="w-full">Submit Application</Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              ) : (
                <><Button disabled className='flex flex-col' variant="outline" size="sm">
                      <Check className="h-4 w-4 mr-2" />
                      Applied 
                      <p>Your application is in review</p>
                    </Button></>
              )}
            </CardContent>
          </Card>
          )})}
      </div>
    </div>
  );
}