'use client'
import { useState, useEffect } from 'react';
import { Search, Calendar, BookOpen, MapPin, Briefcase, GraduationCap, BadgeHelp, Clock, DollarSign, User, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applyForJob } from '@/action/applyForJob';

const applicationSchema = z.object({
  jobId: z.string(),
  coverLetter: z.string().min(150, "Cover letter must be at least 150 characters"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface TutorRequest {
  status: string;
  start: string | number | Date;
  studentLevel: any;
  hourly: string;
  location: string | undefined;
  id: number;
  user: {
    name: string;
    email: string;
    image: string;
    phone?: string;
  };
  subject: string;
  requriments: string;
  updatedAt: string;
  mode?: string;
}

interface JobsProps {
  tutorRequests: TutorRequest[];
}

const DetailRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-center space-x-3 text-sm">
    <Icon className="h-4 w-4 text-gray-400" />
    <span className="font-medium">{label}:</span>
    <span>{value}</span>
  </div>
);

export default function Jobs({ tutorRequests }: JobsProps) {
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
    request.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.subject.toLowerCase().includes(searchTerm.toLowerCase())
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
        <Button variant="ghost" size="icon" className="absolute flex gap-2 top-4 right-4">
          <Info className="h-4 w-4" />
          <p>view</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={request.user.image} alt={request.user.name} />
              <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl">{request.subject} Tutoring Request</p>
              <p className="text-sm text-gray-500">{request.user.name}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={request.status === 'in review' ? 'default' : 'secondary'}>
              {request.status}
            </Badge>
            <Badge variant="outline">
              {request.studentLevel.toUpperCase()}
            </Badge>
            <Badge variant="secondary">
              {request.mode}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <DetailRow icon={Calendar} label="Start Date" value={new Date(request.start).toLocaleDateString()} />
            <DetailRow icon={MapPin} label="Location" value={request.location || 'Remote'} />
            <DetailRow icon={DollarSign} label="Hourly Rate" value={`${request.hourly}/hr`} />
            <DetailRow icon={Clock} label="Posted" value={new Date(request.updatedAt).toLocaleDateString()} />
            {request.user.email && (
              <DetailRow icon={User} label="Contact" value={request.user.email} />
            )}
          </div>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Requirements & Details</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{request.requriments}</p>
          </div>
        </div>
        <DialogFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Briefcase className="h-4 w-4 mr-2" />
                Apply Now
              </Button>
            </DialogTrigger>
            <DialogContent>
              {/* Application form dialog content - reusing existing application dialog */}
              {submissionStatus === "success" ? (
                <div className="py-6 text-center">
                  <p className="text-lg font-semibold text-green-600">Application Submitted!</p>
                  <p className="mt-2 text-gray-700">Your application has been successfully sent. We&apos;ll get back to you soon!</p>
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
        </DialogFooter>
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
        {filteredRequests.map(request => (
          <Card key={request.id} className="flex flex-col relative transition-all duration-200 hover:shadow-lg">
            <FullDetailsDialog request={request} />
            <CardHeader className="pb-4 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant={request.status === 'in review' ? 'default' : 'secondary'} className="text-xs px-2 py-1">
                  <BookOpen className="h-3 w-3 mr-2" />
                  {request.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={request.user.image} alt={request.user.name} />
                  <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{request.user.name}</CardTitle>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-2" />
                    {new Date(request.updatedAt).toLocaleDateString()}
                  </p>
                </div>
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
              <Button variant="outline" size="sm" onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}>
                {expandedId === request.id ? "View Less" : "View More"}
              </Button>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
               
                
        
      }
