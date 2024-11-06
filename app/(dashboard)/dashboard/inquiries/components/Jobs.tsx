'use client'

import { useState, useEffect } from 'react'
import { Search, Calendar, BookOpen, MapPin, User, Phone, Mail, Eye, Edit } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateJobStatus } from '@/action/jobActions'
import { toast } from '@/components/ui/use-toast'

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
    mode?: string;
    status: string;
    Application: Application[];
  }[];
}

export default function Jobs({ tutorRequests }: JobsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [mounted, setMounted] = useState(false)
  const [selectedTutor, setSelectedTutor] = useState<Application | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredRequests = tutorRequests.filter(request =>
    request.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleStatusUpdate = async (jobId: string, newStatus: string) => {
    const jobIndex = tutorRequests.findIndex(job => job.id === jobId)
    if (jobIndex !== -1) {
      const updatedJobs = [...tutorRequests]
      updatedJobs[jobIndex].status = newStatus
      try {
        await updateJobStatus(jobId, newStatus)
        toast({
          title: "Job status updated successfully",
          description: `Job status has been updated to ${newStatus}`,
        })
      } catch (error) {
        toast({
          title: "Failed to update job status",
          description: "There was an error updating the job status. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const TutorDetailsDialog = ({ tutor }: { tutor: Application }) => (
<DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-auto">
<DialogHeader>
        <DialogTitle>Tutor Details</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={tutor.tutor.image} alt={tutor.tutor.name} />
            <AvatarFallback>{tutor.tutor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{tutor.tutor.name}</h3>
            <p className="text-sm text-gray-500">{tutor.tutor.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4" />
            <span>{tutor.tutor.phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{tutor.tutor.address}</span>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">Cover Letter:</h4>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <p className="text-sm">{tutor.coverLetter}</p>
          </ScrollArea>
        </div>
      </div>
    </DialogContent>
  )

  if (!mounted) return null
  if (!tutorRequests.length) return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="text-center">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No tutor requests</h3>
        <p className="mt-1 text-sm text-gray-500">Create a new request to get started.</p>
      </div>
    </div>
  )

  return (
    <div className="container overflow-auto mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Tutor Requests</h1>

      <div className="mb-8 max-w-md mx-auto relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="search"
          placeholder="Search by name or subject"
          className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredRequests.map(request => (
          <Card key={request.id} className="flex flex-col transition-all duration-200 hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center">
                <Badge variant={request.status === 'open' ? 'default' : 'destructive'} className="text-xs">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {request.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={request.user.image} alt={request.user.name} />
                    <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{request.user.name}</CardTitle>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(request.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleStatusUpdate(request.id, 'open')}>Open</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(request.id, 'in-progress')}>In Progress</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusUpdate(request.id, 'closed')}>Closed</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col pt-4">
              <Badge variant="secondary" className="self-start mb-2">
                <BookOpen className="h-3 w-3 mr-1" />
                {request.subject}
              </Badge>
              
              <p className="text-sm mb-4 flex-grow">
                {request.requriments?.length > 100
                  ? `${request.requriments.slice(0, 100)}...`
                  : request.requriments}
              </p>
              <div className="flex justify-between items-center mt-auto pt-4 border-t">
                <Badge variant="outline" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {request.mode || 'Not specified'}
                </Badge>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      ({request.Application.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-auto">
  <DialogHeader>
    <DialogTitle className="flex items-center space-x-2">
      <User className="h-5 w-5" />
      <span>Applicants for {request.subject} Tutor Position</span>
    </DialogTitle>
  </DialogHeader>
  <div className="mt-4 overflow-auto max-h-[60vh]">
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
          {request.Application.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="font-medium">{application.tutor.name}</TableCell>
              <TableCell>{application.tutor.phone}</TableCell>
              <TableCell>{application.tutor.address}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}