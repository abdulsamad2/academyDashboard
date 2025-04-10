'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Eye,
  ChevronDown,
  MoreVertical,
  CheckCircle,
  Clock,
  Trash2,
  AlertCircle,
  Search,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import {
  deletePayout,
  updatePayoutStatus,
  updatePayoutWithPenalty
} from '@/action/payout';
import { Label } from '@/components/ui/label';

interface Teacher {
  totalEarning: number;
  name: string;
  avatar: string;
  id: string;
  email: string;
  phoneNumber: string;
  address: string;
  bankName: string;
  accountNumber: string;
  payoutAmount: number;
  status: string;
  payoutDate: string;
  lastPayoutDate: string;
  taxId: string;
  updatedAt: Date;
  adminId: string;
  penaltyPercentage?: number;
  penaltyReason?: string;
}

interface PayoutTableProps {
  teacherPayouts: Teacher[];
}

export default function PayoutTable({ teacherPayouts }: PayoutTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState<Teacher[]>(teacherPayouts);
  const [penaltyDialogOpen, setPenaltyDialogOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    null
  );
  const [penaltyPercentage, setPenaltyPercentage] = useState<number>(0);
  const [penaltyReason, setPenaltyReason] = useState<string>('');

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (teacherId: string, newStatus: string) => {
    const res = await updatePayoutStatus(teacherId, newStatus);
    setTeachers((prevTeachers) =>
      prevTeachers.map((teacher) =>
        teacher.id === teacherId ? { ...teacher, status: newStatus } : teacher
      )
    );
    toast({
      title: 'Status Updated',
      description: `Teacher payout status changed to ${newStatus}`
    });
  };

  const handleDelete = async (teacherId: string) => {
    const res = await deletePayout(teacherId);
    //@ts-ignore
    if (res.error) {
      toast({
        title: 'Error',
        // @ts-ignore
        description: res.error,
        variant: 'destructive'
      });
      return;
    }
    setTeachers((prevTeachers) =>
      prevTeachers.filter((teacher) => teacher.id !== teacherId)
    );
    toast({
      title: 'Teacher Removed',
      description: 'The teacher has been removed from the payout list',
      variant: 'destructive'
    });
  };

  const handleApplyPenalty = async () => {
    if (
      !selectedTeacherId ||
      penaltyPercentage <= 0 ||
      penaltyReason.trim() === ''
    ) {
      toast({
        title: 'Invalid Input',
        description: 'Please provide a valid penalty percentage and reason.',
        variant: 'destructive'
      });
      return;
    }

    const res = await updatePayoutWithPenalty(
      selectedTeacherId,
      penaltyPercentage,
      penaltyReason
    );
    //@ts-ignore
    if (res.error) {
      toast({
        title: 'Error',
        //@ts-ignore
        description: res.error,
        variant: 'destructive'
      });
      return;
    }

    setTeachers((prevTeachers) =>
      prevTeachers.map((teacher) =>
        teacher.id === selectedTeacherId
          ? {
              ...teacher,
              penaltyPercentage,
              penaltyReason,
              payoutAmount: teacher.payoutAmount * (1 - penaltyPercentage / 100)
            }
          : teacher
      )
    );

    toast({
      title: 'Penalty Applied',
      description: `A penalty of ${penaltyPercentage}% has been applied.`
    });

    setPenaltyDialogOpen(false);
    setPenaltyPercentage(0);
    setPenaltyReason('');
  };

  return (
    <div className="w-full space-y-6">
      
      
      <div className="flex items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 rounded-md w-full"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3 py-2"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-medium">AdminId</TableHead>
                <TableHead className="font-medium">Teacher</TableHead>
                <TableHead className="font-medium">Bank Details</TableHead>
                <TableHead className="font-medium">Total Amount</TableHead>
                <TableHead className="font-medium">Teacher Payout</TableHead>
                <TableHead className="font-medium">Penalty</TableHead>
                <TableHead className="font-medium">Payout After Penalty</TableHead>
                <TableHead className="font-medium">Payout Month</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    No payouts found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTeachers.map((teacher: Teacher, index) => (
                  <TableRow 
                    key={teacher.id}
                    className={index % 2 === 0 ? "bg-background" : "bg-muted/50 hover:bg-muted"}
                  >
                    <TableCell>
                      <p>{teacher.adminId || 'NA'}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="flex-shrink-0 h-8 w-8">
                          <AvatarImage src={teacher.avatar} alt={teacher.name} />
                          <AvatarFallback className="text-xs">
                            {teacher.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-xs text-muted-foreground">{teacher.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm">{teacher.bankName}</p>
                      <p className="text-xs text-muted-foreground">
                        Acc: {teacher.accountNumber}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        RM{teacher.totalEarning.toFixed(2)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        RM{' '}
                        {(
                          teacher.payoutAmount *
                          (1 + (teacher.penaltyPercentage || 0) / 100)
                        ).toFixed(2)}
                      </p>
                    </TableCell>
                    <TableCell>
                      {teacher.penaltyPercentage ? (
                        <div>
                          <p className="text-destructive font-medium">
                            -{teacher.penaltyPercentage}%
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {teacher.penaltyReason}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No Penalty</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        RM
                        {(
                          teacher.payoutAmount *
                          (1 - (teacher.penaltyPercentage || 0) / 100)
                        ).toFixed(2)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(teacher.updatedAt), 'MMM d, yyyy')}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          teacher.status === 'Completed'
                            ? 'default'
                            : teacher.status === 'In Process'
                            ? 'outline'
                            : 'secondary'
                        }
                        className="rounded-full px-2.5 py-0.5 text-xs"
                      >
                        {teacher.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[180px] rounded-md">
                            <DropdownMenuItem
                              onSelect={() =>
                                handleStatusChange(teacher.id, 'Completed')
                              }
                              className="cursor-pointer"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              <span>Mark as Paid Out</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() =>
                                handleStatusChange(teacher.id, 'Pending')
                              }
                              className="cursor-pointer"
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              <span>Mark as Pending</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() =>
                                handleStatusChange(teacher.id, 'In Process')
                              }
                              className="cursor-pointer"
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              <span>Mark as In Process</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => {
                                setSelectedTeacherId(teacher.id);
                                setPenaltyDialogOpen(true);
                              }}
                              className="cursor-pointer"
                            >
                              <AlertCircle className="mr-2 h-4 w-4" />
                              <span>Apply Penalty</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => handleDelete(teacher.id)}
                              className="cursor-pointer text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                            <DialogTrigger asChild>
                              <DropdownMenuItem className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View Details</span>
                              </DropdownMenuItem>
                            </DialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
                          <DialogHeader>
                            <DialogTitle>
                              Teacher Details and Payout History
                            </DialogTitle>
                          </DialogHeader>
                          <div className="flex-grow overflow-auto py-4 pr-2">
                            <div className="grid gap-6">
                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <h3 className="text-lg font-semibold">
                                    Personal Information
                                  </h3>
                                  <div className="space-y-2">
                                    <div className="flex">
                                      <span className="w-1/3 font-medium text-muted-foreground">Name:</span>
                                      <span>{teacher.name}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="w-1/3 font-medium text-muted-foreground">Email:</span>
                                      <span>{teacher.email}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="w-1/3 font-medium text-muted-foreground">Phone:</span>
                                      <span>{teacher.phoneNumber}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="w-1/3 font-medium text-muted-foreground">Address:</span>
                                      <span>{teacher.address}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="w-1/3 font-medium text-muted-foreground">Tax ID:</span>
                                      <span>{teacher.taxId}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <h3 className="text-lg font-semibold">
                                    Bank Information
                                  </h3>
                                  <div className="space-y-2">
                                    <div className="flex">
                                      <span className="w-1/2 font-medium text-muted-foreground">Bank Name:</span>
                                      <span>{teacher.bankName}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="w-1/2 font-medium text-muted-foreground">Account Number:</span>
                                      <span>{teacher.accountNumber}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                  Payout Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-2">
                                  <div className="flex">
                                    <span className="w-1/2 font-medium text-muted-foreground">Total Earning:</span>
                                    <span>RM{teacher.totalEarning.toFixed(2)}</span>
                                  </div>
                                  <div className="flex">
                                    <span className="w-1/2 font-medium text-muted-foreground">Teacher Payout:</span>
                                    <span>RM{teacher.payoutAmount.toFixed(2)}</span>
                                  </div>
                                  {teacher.penaltyPercentage && (
                                    <div className="flex">
                                      <span className="w-1/2 font-medium text-muted-foreground">Penalty:</span>
                                      <span className="text-destructive">
                                        {teacher.penaltyPercentage}% - {teacher.penaltyReason}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex">
                                    <span className="w-1/2 font-medium text-muted-foreground">Payout After Penalty:</span>
                                    <span>RM{(
                                      teacher.payoutAmount *
                                      (1 - (teacher.penaltyPercentage || 0) / 100)
                                    ).toFixed(2)}</span>
                                  </div>
                                  <div className="flex">
                                    <span className="w-1/2 font-medium text-muted-foreground">Payout Date:</span>
                                    <span>{format(
                                      new Date(teacher.payoutDate),
                                      'MMM d, yyyy'
                                    )}</span>
                                  </div>
                                  <div className="flex">
                                    <span className="w-1/2 font-medium text-muted-foreground">Status:</span>
                                    <Badge
                                      variant={
                                        teacher.status === 'Completed'
                                          ? 'default'
                                          : teacher.status === 'In Process'
                                          ? 'outline'
                                          : 'secondary'
                                      }
                                      className="rounded-full px-2.5 py-0.5 text-xs"
                                    >
                                      {teacher.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Penalty Dialog */}
      <Dialog open={penaltyDialogOpen} onOpenChange={setPenaltyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply Penalty</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="penalty-percentage">Penalty Percentage</Label>
              <Input
                id="penalty-percentage"
                type="number"
                value={penaltyPercentage}
                onChange={(e) => setPenaltyPercentage(Number(e.target.value))}
                placeholder="Enter penalty percentage"
                className="rounded-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="penalty-reason">Penalty Reason</Label>
              <Input
                id="penalty-reason"
                value={penaltyReason}
                onChange={(e) => setPenaltyReason(e.target.value)}
                placeholder="Enter penalty reason"
                className="rounded-md"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPenaltyDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApplyPenalty}>Apply Penalty</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 