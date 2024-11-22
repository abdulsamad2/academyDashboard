'use client';
import { useState, useEffect } from 'react';
import {
  Search,
  Calendar,
  BookOpen,
  MapPin,
  User,
  Phone,
  Mail,
  Eye,
  Edit,
  DollarSign,
  Clock,
  LocateIcon,
  BadgeHelp
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { updateJobStatus } from '@/action/jobActions';
import { toast } from '@/components/ui/use-toast';
import RequestTutorForm from './requestTutor';

interface Tutor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  image: string;
}

interface Application {
  id: string;
  coverLetter: string;
  tutor: Tutor;
}

interface JobsProps {
  tutorRequests: {
    id: string;
    user: {
      name: string;
      email: string;
      image: string;
      phone?: string;
    };
    subject: string;
    requriments: string;
    updatedAt: string;
    mode: string;
    status: string;
    start: string;
    hourly: string;
    location: string;
    studentLevel: string;
    Application: Application[];
  }[];
}

export default function TutorRequests({ tutorRequests }: JobsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isRequestTutorOpen, setIsRequestTutorOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredRequests = tutorRequests.filter(
    (request) =>
      request.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusUpdate = async (jobId: string, newStatus: string) => {
    // Code to update job status
    const response = await updateJobStatus(jobId, newStatus);
  };
  const handleEditJob = () => {
    setIsRequestTutorOpen(true);
  };

  const TutorDetailsDialog = ({ tutor }: { tutor: Application }) => (
    <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[60vw]">
      <DialogHeader>
        <DialogTitle>Tutor Details</DialogTitle>
      </DialogHeader>
      <div className="space-y-6 py-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={tutor.tutor.image} alt={tutor.tutor.name} />
            <AvatarFallback>{tutor.tutor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold">{tutor.tutor.name}</h3>
            <p className="text-sm text-gray-500">{tutor.tutor.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-gray-400" />
            <span>{tutor.tutor.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span className="text-sm">{tutor.tutor.address}</span>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-lg font-semibold">Cover Letter:</h4>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <p className="text-sm leading-relaxed">{tutor.coverLetter}</p>
          </ScrollArea>
        </div>
      </div>
    </DialogContent>
  );

  if (!mounted) return null;
  if (!tutorRequests.length)
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

  return (
    <div className="container mx-auto max-w-7xl overflow-auto px-4 py-8">
      <h1 className="mb-8 text-center text-4xl font-bold">Tutor Requests</h1>

      <div className="relative mx-auto mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
        <Input
          type="search"
          placeholder="Search by name or subject"
          className="w-full rounded-full border-gray-300 py-2 pl-10 pr-4 transition duration-150 ease-in-out focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-4">
        {filteredRequests.map((request) => (
          <>
            <Card
              key={request.id}
              className="flex flex-col transition-all duration-200 hover:shadow-lg"
            >
              <CardHeader className="space-y-4 pb-4">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      request.status === 'in review' ? 'default' : 'secondary'
                    }
                    className="px-2 py-1 text-xs"
                  >
                    <BookOpen className="mr-2 h-3 w-3" />
                    {request.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={request.user.image}
                      alt={request.user.name}
                    />
                    <AvatarFallback>
                      {request.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {request.user.name}
                    </CardTitle>
                    <p className="mt-1 flex items-center text-sm text-gray-500">
                      <Calendar className="mr-2 h-3 w-3" />
                      {new Date(request.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-grow flex-col space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <Badge variant="outline" className="px-2 py-1 text-xs">
                      <User className="mr-2 h-3 w-3" />
                      {request.studentLevel.toUpperCase()}
                    </Badge>
                    <Badge variant="secondary" className="self-start">
                      <BookOpen className="mr-2 h-4 w-4" />
                      {request.subject}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap justify-between">
                    <div className="flex items-center space-x-2 text-sm">
                      <BadgeHelp className="h-4 w-4 text-gray-400" />
                      <span>{request.mode}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>
                        {new Date(request.start).toISOString().split('T')[0]}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    <span className="" title={request.location}>
                      {request.location}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>{request.hourly}/hr</span>
                  </div>
                </div>
                <p className="line-clamp-3 flex-grow text-sm">
                  {request.requriments}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t pt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="mr-2 h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[80vh] overflow-auto sm:max-w-[80vw]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>
                          Applicants for {request.subject} Tutor Position
                        </span>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 max-h-[60vh] overflow-auto">
                      <ScrollArea className="h-full w-full rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Phone</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {request.Application?.map((application) => (
                              <TableRow key={application.id}>
                                <TableCell className="font-medium">
                                  {application.tutor.name}
                                </TableCell>
                                <TableCell>{application.tutor.phone}</TableCell>
                                <TableCell
                                  className="max-w-[200px] truncate"
                                  title={application.tutor.address}
                                >
                                  {application.tutor.address}
                                </TableCell>
                                <TableCell>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                      </Button>
                                    </DialogTrigger>
                                    <TutorDetailsDialog tutor={application} />
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </div>
                  </DialogContent>
                </Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleEditJob}>
                      Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleStatusUpdate(request.id, 'in review')
                      }
                    >
                      In Review
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusUpdate(request.id, 'open')}
                    >
                      Open
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusUpdate(request.id, 'closed')}
                    >
                      Closed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
            <Dialog
              open={isRequestTutorOpen}
              onOpenChange={setIsRequestTutorOpen}
            >
              <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[60vw]">
                <DialogHeader>
                  <DialogTitle>Edit Tutor Request</DialogTitle>
                </DialogHeader>
                <RequestTutorForm
                  //@ts-ignore
                  initialData={{
                    ...request,
                    //@ts-ignore
                    id: request.id,
                    level: request.studentLevel
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
              </DialogContent>
            </Dialog>
          </>
        ))}
      </div>
    </div>
  );
}
