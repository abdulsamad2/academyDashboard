'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowUpRight, CalendarDays, DollarSign, TrendingUp, Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data for earnings
const lastMonthEarnings = 2800;

const lastMonthStudents = 12;

const monthlyEarningsData = [
  { month: 'Jan', earnings: 0 },
  { month: 'Feb', earnings: 0 },
  { month: 'Mar', earnings: 0 },
  { month: 'Apr', earnings: 0 },
  { month: 'May', earnings: 0 },
  { month: 'Jun', earnings: 0 },
];

const studentEarningsData: any[] = [
  // { id: 1, name: "Alice Johnson", earnings: 750 },
  // { id: 2, name: "Bob Smith", earnings: 600 },
  // { id: 3, name: "Charlie Brown", earnings: 550 },
  // { id: 4, name: "Diana Ross", earnings: 500 },
  // { id: 5, name: "Ethan Hunt", earnings: 450 },
];
 interface TutorEarningsDashboard {
  thisMonthEarnings: number;
  assignedStudents: number;
 }

export default function TutorEarningsDashboard({thisMonthEarnings,assignedStudents}:TutorEarningsDashboard) {
  const [withdrawAmount, setWithdrawAmount] = useState("")

  const handleWithdrawRequest = () => {
    // Implement withdrawal logic here
    setWithdrawAmount("")
  }

  const earningsIncrease = ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100;
  const studentsIncrease = ((assignedStudents - lastMonthStudents) / lastMonthStudents) * 100;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM{thisMonthEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {earningsIncrease > 0 ? "+" : ""}{earningsIncrease.toFixed(1)}% from last month
            </p>
            <Progress 
              value={thisMonthEarnings} 
              max={Math.max(thisMonthEarnings, lastMonthEarnings)} 
              className="mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedStudents}</div>
            <p className="text-xs text-muted-foreground">
              {studentsIncrease > 0 ? "+" : ""}{studentsIncrease.toFixed(1)}% from last month
            </p>
            <Progress 
              value={assignedStudents} 
              max={Math.max(assignedStudents, lastMonthStudents)} 
              className="mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Withdraw</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Request Withdrawal</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Withdraw Earnings</DialogTitle>
                  <DialogDescription>
                    Enter the amount you&apos;d like to withdraw. This will be processed within 3-5 business days.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="col-span-3"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleWithdrawRequest}>Confirm Withdrawal</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Earnings</CardTitle>
            <CardDescription>Your earnings over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyEarningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earnings" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Earning Students</CardTitle>
            <CardDescription>Students contributing most to your earnings this month</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-right">Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentEarningsData.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell className="text-right">RM{student.earnings.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}