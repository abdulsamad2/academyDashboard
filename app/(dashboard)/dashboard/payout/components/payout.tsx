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
  AlertCircle
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
} from '@/action/payout'; // Add `applyPenalty` action
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
  penaltyPercentage?: number; // Optional penalty percentage
  penaltyReason?: string; // Optional penalty reason
}

interface TeacherPayouts {
  teacherPayouts: Teacher[];
}

export default function SimplifiedTeacherPayoutsPage({
  teacherPayouts
}: TeacherPayouts) {
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
    <div className="container mx-auto space-y-8 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Teacher Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Bank Details</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Teacher Payout</TableHead>
                <TableHead>Penalty</TableHead>
                <TableHead>Payout After Penalty</TableHead>
                <TableHead>Payout Month</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher: Teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={teacher.avatar} alt={teacher.name} />
                        <AvatarFallback>
                          {teacher.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-sm text-gray-500">{teacher.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p>{teacher.bankName}</p>
                    <p className="text-sm text-gray-500">
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
                     RM {(
                        teacher.payoutAmount *
                        (1 + (teacher.penaltyPercentage || 0) / 100)
                      ).toFixed(2)}
                    </p>
                  </TableCell>
                  <TableCell>
                    {teacher.penaltyPercentage ? (
                      <div>
                        <p className="text-red-500">
                          -{teacher.penaltyPercentage}%
                        </p>
                        <p className="text-sm text-gray-500">
                          {teacher.penaltyReason}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No Penalty</p>
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
                    <p className="text-sm text-gray-500">
                      {format(new Date(teacher.updatedAt), 'MMM d, yyyy')}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        teacher.status === 'Completed' ? 'default' : 'secondary'
                      }
                    >
                      {teacher.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() =>
                              handleStatusChange(teacher.id, 'Completed')
                            }
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            <span>Mark as Paid Out</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() =>
                              handleStatusChange(teacher.id, 'Pending')
                            }
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            <span>Mark as Pending</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() =>
                              handleStatusChange(teacher.id, 'In Process')
                            }
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            <span>Mark as In Process</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setSelectedTeacherId(teacher.id);
                              setPenaltyDialogOpen(true);
                            }}
                          >
                            <AlertCircle className="mr-2 h-4 w-4" />
                            <span>Apply Penalty</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => handleDelete(teacher.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                          <DialogTrigger asChild>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                          </DialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>
                            Teacher Details and Payout History
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 items-start gap-4">
                            <div>
                              <h3 className="mb-2 font-semibold">
                                Personal Information
                              </h3>
                              <p>
                                <span className="font-medium">Name:</span>{' '}
                                {teacher.name}
                              </p>
                              <p>
                                <span className="font-medium">Email:</span>{' '}
                                {teacher.email}
                              </p>
                              <p>
                                <span className="font-medium">Phone:</span>{' '}
                                {teacher.phoneNumber}
                              </p>
                              <p>
                                <span className="font-medium">Address:</span>{' '}
                                {teacher.address}
                              </p>
                              <p>
                                <span className="font-medium">Tax ID:</span>{' '}
                                {teacher.taxId}
                              </p>
                            </div>
                            <div>
                              <h3 className="mb-2 font-semibold">
                                Bank Information
                              </h3>
                              <p>
                                <span className="font-medium">Bank Name:</span>{' '}
                                {teacher.bankName}
                              </p>
                              <p>
                                <span className="font-medium">
                                  Account Number:
                                </span>{' '}
                                {teacher.accountNumber}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h3 className="mb-2 font-semibold">
                              Payout Information
                            </h3>
                            <p>
                              <span className="font-medium">
                                Total Earning:
                              </span>{' '}
                              RM{teacher.totalEarning.toFixed(2)}
                            </p>
                            <p>
                              <span className="font-medium">
                                Teacher Payout:
                              </span>{' '}
                              RM{teacher.payoutAmount.toFixed(2)}
                            </p>
                            {teacher.penaltyPercentage && (
                              <p>
                                <span className="font-medium">Penalty:</span>{' '}
                                {teacher.penaltyPercentage}% -{' '}
                                {teacher.penaltyReason}
                              </p>
                            )}
                            <p>
                              <span className="font-medium">
                                Payout After Penalty:
                              </span>{' '}
                              RM
                              {(
                                teacher.payoutAmount *
                                (1 - (teacher.penaltyPercentage || 0) / 100)
                              ).toFixed(2)}
                            </p>
                            <p>
                              <span className="font-medium">Payout Date:</span>{' '}
                              {format(
                                new Date(teacher.payoutDate),
                                'MMM d, yyyy'
                              )}
                            </p>
                            <p>
                              <span className="font-medium">Status:</span>{' '}
                              {teacher.status}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Penalty Dialog */}
      <Dialog open={penaltyDialogOpen} onOpenChange={setPenaltyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply Penalty</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Penalty Percentage</Label>
              <Input
                type="number"
                value={penaltyPercentage}
                onChange={(e) => setPenaltyPercentage(Number(e.target.value))}
                placeholder="Enter penalty percentage"
              />
            </div>
            <div>
              <Label>Penalty Reason</Label>
              <Input
                value={penaltyReason}
                onChange={(e) => setPenaltyReason(e.target.value)}
                placeholder="Enter penalty reason"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleApplyPenalty}>Apply Penalty</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
