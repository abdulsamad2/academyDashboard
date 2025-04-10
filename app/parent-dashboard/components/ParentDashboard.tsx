'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Invoice } from '@prisma/client';
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Settings,
  Plus,
  Users,
  School,
  Receipt,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';
import RequestTutorForm from './requestTutor';
import { deleteJob } from '@/action/jobActions';
import ParentSteps from './FirstBox';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

interface Student {
  id: string;
  name: string;
  level: string;
  subjects: string[];
}

interface TutorRequest {
  id: string;
  subject: string;
  status: 'open' | 'assigned' | 'closed';
  createdAt: Date;
  requriments: string;
  studentLevel?: string;
}

interface ParentDashboardProps {
  parentName: string;
  avatarUrl?: string;
  students: Student[];
  recentInvoices: Invoice[];
  tutorRequests: TutorRequest[];
  deposits: any;
}

export default function ParentDashboard({
  parentName,
  avatarUrl,
  students,
  recentInvoices,
  tutorRequests,
  deposits
}: ParentDashboardProps) {
  const [selectedRequest, setSelectedRequest] = useState<TutorRequest | null>(
    null
  );
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isModifyRequestOpen, setIsModifyRequestOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isRequestTutorOpen, setIsRequestTutorOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  useEffect(() => {
    if (students.length > 0) {
      setActiveStep(1);
    }
    if (tutorRequests.length > 0) {
      setActiveStep(2);
    }
  }, [students.length, tutorRequests.length]);

  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, [router]);
  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'unpaid':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTutorRequestStatusIcon = (status: TutorRequest['status']) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'assigned':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const handleViewDetails = (request: TutorRequest) => {
    setSelectedRequest(request);
    setIsViewDetailsOpen(true);
    setOpenDropdownId(null);
  };

  const handleModifyRequest = (request: TutorRequest) => {
    setSelectedRequest(request);
    setIsModifyRequestOpen(true);
    setOpenDropdownId(null);
  };

  const handleDeleteRequest = (request: TutorRequest) => {
    setSelectedRequest(request);
    setIsDeleteAlertOpen(true);
    setOpenDropdownId(null);
  };

  const confirmDelete = async () => {
    if (selectedRequest) {
      await deleteJob(selectedRequest.id);
      toast({
        title: 'Tutor request deleted',
        description: 'The tutor request has been successfully deleted.'
      });
      router.refresh();
      setIsDeleteAlertOpen(false);
    }
  };

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-primary/10 to-transparent rounded-lg p-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{parentName}&apos;s Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage your children&apos;s education and tutoring needs
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link href="/parent-dashboard/profile">
                  <Settings className="mr-2 h-4 w-4" />
                  Profile Settings
                </Link>
              </Button>
              <Button asChild>
                <Link href="/parent-dashboard/children/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Child
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Students</p>
                  <h2 className="text-3xl font-bold">{students.length}</h2>
                </div>
                <div className="rounded-full p-3 bg-blue-100 dark:bg-blue-900/50">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4">
                <Button variant="ghost" size="sm" className="text-xs" asChild>
                  <Link href="/parent-dashboard/children">View all students</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Tutor Requests</p>
                  <h2 className="text-3xl font-bold">{tutorRequests.length}</h2>
                </div>
                <div className="rounded-full p-3 bg-purple-100 dark:bg-purple-900/50">
                  <School className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4">
                <Button variant="ghost" size="sm" className="text-xs">
                  {tutorRequests.length > 0 ? 
                    tutorRequests.filter(r => r.status === 'assigned').length + ' assigned' : 
                    'No requests yet'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Invoices</p>
                  <h2 className="text-3xl font-bold">{recentInvoices.length}</h2>
                </div>
                <div className="rounded-full p-3 bg-green-100 dark:bg-green-900/50">
                  <Receipt className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4">
                <Button variant="ghost" size="sm" className="text-xs" asChild>
                  <Link href="/parent-dashboard/billing">View billing history</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
          <Card className="col-span-full md:col-span-2 md:row-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl">Getting Started</CardTitle>
                <CardDescription>Complete these steps to get the most out of the platform</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">
                {tutorRequests.length > 0 ? 'Completed' : students.length > 0 ? '2 of 3' : '1 of 3'}
              </Button>
            </CardHeader>
            <CardContent>
              <ParentSteps
                parentName={parentName}
                studentCount={students.length}
                tutorRequests={tutorRequests.length}
              />
            </CardContent>
          </Card>

          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Students</CardTitle>
                  <Badge variant="outline">{students.length}</Badge>
                </div>
                <CardDescription>Your registered children</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[240px] pr-4">
                  {students.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <Users className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                      <p className="text-sm text-muted-foreground">No students registered yet</p>
                      <Button size="sm" className="mt-4" asChild>
                        <Link href="/parent-dashboard/children/new">Add your first child</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {students.map((student) => (
                        <div key={student.id} className="flex items-center p-2 hover:bg-secondary rounded-md transition-colors">
                          <Avatar className="mr-3 h-10 w-10 border border-primary/10">
                            <AvatarFallback className="bg-primary/10">
                              {student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.level}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="ml-2">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Invoices</CardTitle>
                  <Badge variant="outline">{recentInvoices.length}</Badge>
                </div>
                <CardDescription>Latest payment activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[240px] pr-4">
                  {recentInvoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <Receipt className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                      <p className="text-sm text-muted-foreground">No invoices yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentInvoices.map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-3 ${getStatusColor(invoice.status)}`}></div>
                            <div>
                              <p className="font-medium">RM {invoice.total?.toFixed(2) ?? '0.00'}</p>
                              <p className="text-xs text-muted-foreground">
                                Due {invoice.date instanceof Date ? invoice.date.toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                          <Badge variant={
                            invoice.status === 'paid' ? 'default' : 
                            invoice.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {invoice.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-full md:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Tutor Request History</CardTitle>
                <Dialog
                  open={isRequestTutorOpen}
                  onOpenChange={setIsRequestTutorOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      New Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
                    <DialogHeader className="mb-4">
                      <DialogTitle className="text-xl">Request a Tutor</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Fill out the form below to request a tutor for your child.
                      </DialogDescription>
                    </DialogHeader>
                    <RequestTutorForm
                      onSuccess={() => {
                        setIsRequestTutorOpen(false);
                        setOpenDropdownId(null);
                        router.refresh();
                      }}
                      initialData={null}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>Track your tutor requests</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                {tutorRequests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <School className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">No tutor requests found</p>
                    <DialogTrigger asChild>
                      <Button size="sm" className="mt-4">
                        Request your first tutor
                      </Button>
                    </DialogTrigger>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tutorRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between rounded-lg bg-secondary/50 p-4 hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center">
                          {getTutorRequestStatusIcon(request.status)}
                          <div className="ml-3">
                            <p className="font-medium">{request.subject}</p>
                            <p className="text-xs text-muted-foreground">
                              Requested on {request.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            request.status === 'assigned' ? 'default' : 
                            request.status === 'open' ? 'secondary' : 'outline'
                          }>
                            {request.status}
                          </Badge>
                          <DropdownMenu 
                            open={openDropdownId === request.id}
                            onOpenChange={(open) => {
                              setOpenDropdownId(open ? request.id : null);
                            }}
                          >
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewDetails(request)}
                              >
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleModifyRequest(request)}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Modify Request
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteRequest(request)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Request
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Existing dialogs */}
      <Dialog 
        open={isViewDetailsOpen} 
        onOpenChange={(open) => {
          setIsViewDetailsOpen(open);
          if (!open) setOpenDropdownId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tutor Request Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">Subject</h4>
                <p className="font-medium">{selectedRequest?.subject}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">Status</h4>
                <Badge variant={
                  selectedRequest?.status === 'assigned' ? 'default' : 
                  selectedRequest?.status === 'open' ? 'secondary' : 'outline'
                }>
                  {selectedRequest?.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">Date Requested</h4>
                <p>{selectedRequest?.createdAt.toLocaleDateString()}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground">Level</h4>
                <p>{selectedRequest?.studentLevel || 'Not specified'}</p>
              </div>
            </div>
            <Separator className="my-3" />
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">Requirements</h4>
              <p className="text-sm whitespace-pre-wrap bg-secondary/50 p-3 rounded-md">{selectedRequest?.requriments}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rest of the dialogs remain the same */}
      <Dialog
        open={isModifyRequestOpen}
        onOpenChange={(open) => {
          setIsModifyRequestOpen(open);
          if (!open) setOpenDropdownId(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle>Modify Tutor Request</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update the details of your tutor request
            </DialogDescription>
          </DialogHeader>
          <RequestTutorForm
            onSuccess={() => {
              setIsModifyRequestOpen(false);
              setOpenDropdownId(null);
              router.refresh();
            }}
            initialData={{
              ...selectedRequest,
              //@ts-ignore
              id: selectedRequest?.id ?? '',
              level: selectedRequest?.studentLevel ?? ''
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteAlertOpen}
        onOpenChange={(open) => {
          setIsDeleteAlertOpen(open);
          if (!open) setOpenDropdownId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this request?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              tutor request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
