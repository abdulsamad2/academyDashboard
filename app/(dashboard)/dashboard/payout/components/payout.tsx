"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Eye, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
interface Teacher {
  totalEarning: any
  name: string;
  avatar: string | any;
  id: string;
  email: string;
  phoneNumber:string;
  address:string;
  bankName: string;
  accountNumber: string;
  payoutAmount: number;
  status: string;
  payoutDate: string;
  lastPayoutDate: string;
  taxId:string;
}


interface teacherPayouts{
  teacherPayouts:Teacher[]
}


export default function SimplifiedTeacherPayoutsPage({teacherPayouts}:teacherPayouts) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null)

  const filteredTeachers = teacherPayouts.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleExpand = (teacherId: string) => {
    setExpandedTeacher(expandedTeacher === teacherId ? null : teacherId)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Teacher Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
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
                <TableHead>Payout Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher:Teacher) => (
                <>
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={teacher.avatar} alt={teacher.name} />
                          <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-sm text-gray-500">{teacher.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p>{teacher.bankName}</p>
                      <p className="text-sm text-gray-500">Acc: {teacher.accountNumber}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">RM{teacher.totalEarning.toFixed(2)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">RM{teacher.payoutAmount.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{format(new Date(teacher.payoutDate), 'MMM d, yyyy')}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={teacher.status === "Completed" ? "default" : "secondary"}>
                        {teacher.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Teacher Details and Payout History</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 items-start gap-4">
                              <div>
                                <h3 className="font-semibold mb-2">Personal Information</h3>
                                <p><span className="font-medium">Name:</span> {teacher.name}</p>
                                <p><span className="font-medium">Email:</span> {teacher.email}</p>
                                <p><span className="font-medium">Phone:</span> {teacher.phoneNumber}</p>
                                <p><span className="font-medium">Address:</span> {teacher.address}</p>
                                <p><span className="font-medium">Tax ID:</span> {teacher.taxId}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-2">Bank Information</h3>
                                <p><span className="font-medium">Bank Name:</span> {teacher.bankName}</p>
                                <p><span className="font-medium">Account Number:</span> {teacher.accountNumber}</p>
                              </div>
                            </div>
                            <div>
                              {/* <h3 className="font-semibold mb-2">Payout History</h3>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody> */}
                                  {/* {teacher.payoutHistory.map((payout) => (
                                    <TableRow key={payout.id}>
                                      <TableCell>{format(new Date(payout.date), 'MMM d, yyyy')}</TableCell>
                                      <TableCell>RM{payout.amount.toFixed(2)}</TableCell>
                                      <TableCell>
                                        <Badge variant={payout.status === "Completed" ? "default" : "secondary"}>
                                          {payout.status}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))} */}
                                {/* </TableBody>
                              </Table> */}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}