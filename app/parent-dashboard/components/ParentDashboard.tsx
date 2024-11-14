'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserPlus, FileText, CreditCard, Settings, BookOpen, PlusCircle, Clock, CheckCircle, XCircle, Eye, Edit, Trash2, Router } from "lucide-react"
import Link from 'next/link'
import { Invoice } from '@prisma/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RequestTutorForm } from './requestTutor'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { deleteJob } from '@/action/jobActions'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

interface Student {
  id: string
  name: string
  level: string
  subjects: string[]
}

interface TutorRequest {
  id: string
  subject: string
  status: 'open' | 'assigned' | 'closed'
  createdAt: Date
  requriments: string
}

interface ParentDashboardProps {
  parentName: string
  avatarUrl?: string
  students: Student[]
  recentInvoices: Invoice[]
  tutorRequests: TutorRequest[]
}

export default function ParentDashboard({ parentName, avatarUrl, students, recentInvoices, tutorRequests }: ParentDashboardProps) {
  const [isRequestTutorOpen, setIsRequestTutorOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<TutorRequest | null>(null)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [isModifyRequestOpen, setIsModifyRequestOpen] = useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const router = useRouter()
  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'unpaid':
        return 'bg-red-500'
    }
  }

  const getTutorRequestStatusIcon = (status: TutorRequest['status']) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'assigned':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'closed':
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const handleViewDetails = (request: TutorRequest) => {
    setSelectedRequest(request)
    setIsViewDetailsOpen(true)
  }

  const handleModifyRequest = (request: TutorRequest) => {
    setSelectedRequest(request)
    setIsModifyRequestOpen(true)
  }

  const handleDeleteRequest = (request: TutorRequest) => {
    setSelectedRequest(request)
    setIsDeleteAlertOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedRequest) {
      await deleteJob(selectedRequest.id)
      toast({
        title: 'Tutor request deleted',
        description: 'The tutor request has been successfully deleted.',
      })
      router.refresh()
      setIsDeleteAlertOpen(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {parentName}</h1>
            <p className="text-muted-foreground">Manage your children&apos;s education</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
  <Card className="col-span-1 md:col-span-1 lg:col-span-2">
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-between">
      <Dialog open={isRequestTutorOpen} onOpenChange={setIsRequestTutorOpen}>
        <DialogTrigger asChild>
          <Button className="flex-1 mr-2">
            <UserPlus className="mr-2 h-4 w-4" />
            Request Tutor
          </Button>
        </DialogTrigger>
        <DialogContent 
            className="md:w-[50vw] max-w-[1200px] h-[90vh]  overflow-y-auto p-8"
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >          <DialogHeader>
            <DialogTitle>Request a Tutor</DialogTitle>
            <DialogDescription>
              Fill in the details to request a tutor for your child.
            </DialogDescription>
          </DialogHeader>
          <RequestTutorForm onSuccess={() => setIsRequestTutorOpen(false)} initialData={null} />
        </DialogContent>
      </Dialog>
      <Button className="flex-1 ml-2" asChild>
        <Link href="/parent-dashboard/children/new">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Child
        </Link>
      </Button>
    </CardContent>
  </Card>

  {/* Students Card */}
  <Card className="col-span-1 md:col-span-2 lg:col-span-1">
    <CardHeader>
      <CardTitle>Students</CardTitle>
      <CardDescription>{students.length} registered</CardDescription>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[100px]">
        {students.map((student) => (
          <div key={student.id} className="flex items-center mb-2">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{student.name}</p>
              <p className="text-sm text-muted-foreground">{student.level}</p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </CardContent>
  </Card>

  {/* Recent Invoices Card */}
  <Card className="col-span-1 md:col-span-2 lg:col-span-1">
    <CardHeader>
      <CardTitle>Recent Invoices</CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[100px]">
        {recentInvoices.map((invoice) => (
          <div key={invoice.id} className="flex justify-between items-center mb-2">
            <div>
              <p className="font-medium">RM {invoice.total.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Due {invoice.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <Badge className={getStatusColor(invoice.status)}>
              {invoice.status}
            </Badge>
          </div>
        ))}
      </ScrollArea>
    </CardContent>
  </Card>
</div>


      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Tutor Request History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {tutorRequests.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No tutor requests found.</p>
                </div>
              )}
              {tutorRequests.map((request) => (
                <div key={request.id} className="flex justify-between items-center mb-4 p-2 bg-secondary rounded-lg">
                  <div className="flex items-center">
                    {getTutorRequestStatusIcon(request.status)}
                    <div className="ml-3">
                      <p className="font-medium">{request.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Badge className="mr-2">{request.status}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <span className="sr-only">Open menu</span>
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleModifyRequest(request)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modify Request
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteRequest(request)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Request
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/invoices">
                <FileText className="mr-2 h-4 w-4" />
                View All Invoices
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/payment">
                <CreditCard className="mr-2 h-4 w-4" />
                Make a Payment
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/courses">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Courses
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
        </CardContent>
      </Card>

      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tutor Request Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Subject</h4>
              <p>{selectedRequest?.subject}</p>
            </div>
            <div>
              <h4 className="font-semibold">Status</h4>
              <p>{selectedRequest?.status}</p>
            </div>
            <div>
              <h4 className="font-semibold">Date Requested</h4>
              <p>{selectedRequest?.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div>
              <h4 className="font-semibold">Description</h4>
              <p>{selectedRequest?.requriments}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isModifyRequestOpen} onOpenChange={setIsModifyRequestOpen}>
      <DialogContent 
            className="md:w-[50vw] max-w-[1200px] h-[90vh]  overflow-y-auto p-8"
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >             <DialogHeader>
            <DialogTitle>Modify Tutor Request</DialogTitle>
          </DialogHeader>
          <RequestTutorForm
            onSuccess={() => setIsModifyRequestOpen(false)}
            //@ts-ignore
            initialData={{ ...selectedRequest, level: selectedRequest?.studentLevel }}
          />

        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this request?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tutor request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}