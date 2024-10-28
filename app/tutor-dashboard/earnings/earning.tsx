"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowUpRight, CalendarDays, DollarSign, TrendingUp, Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Mock data for earnings
const lastMonthEarnings = 2800;
const thisMonthStudents = 15;
const lastMonthStudents = 12;

const earningsData = [
  { id: 1, date: "2023-06-15", amount: 250, subject: "Mathematics" },
  { id: 2, date: "2023-06-18", amount: 300, subject: "Physics" },
  { id: 3, date: "2023-06-20", amount: 200, subject: "Chemistry" },
  { id: 4, date: "2023-06-22", amount: 350, subject: "Biology" },
  { id: 5, date: "2023-06-25", amount: 275, subject: "Mathematics" },
];

export default function TutorEarningsDashboard({thisMonthEarnings}:any) {
  const [withdrawAmount, setWithdrawAmount] = useState("")

  const handleWithdrawRequest = () => {
    setWithdrawAmount("")
  }

  const earningsIncrease = ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100;
  const studentsIncrease = ((thisMonthStudents - lastMonthStudents) / lastMonthStudents) * 100;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Tutor Earnings Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${thisMonthEarnings.toFixed(2)}</div>
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
            <CardTitle className="text-sm font-medium">Last Month Earnings</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${lastMonthEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Previous month&apos;s total</p>
            <Progress 
              value={lastMonthEarnings} 
              max={Math.max(thisMonthEarnings, lastMonthEarnings)} 
              className="mt-2"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students This Month</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonthStudents}</div>
            <p className="text-xs text-muted-foreground">
              {studentsIncrease > 0 ? "+" : ""}{studentsIncrease.toFixed(1)}% from last month
            </p>
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

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Earnings</CardTitle>
          <CardDescription>Your latest earnings for this month</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earningsData.map((earning) => (
                <TableRow key={earning.id}>
                  <TableCell>{earning.date}</TableCell>
                  <TableCell>{earning.subject}</TableCell>
                  <TableCell className="text-right">${earning.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <CardDescription>Showing the last 5 entries</CardDescription>
          <Button variant="outline">View All</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Earnings Trend</CardTitle>
          <CardDescription>Your earnings over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            {/* Placeholder for a chart component */}
            <div className="flex items-end justify-between h-full w-full">
              {[2600, 2800, 2400, 3000, 2800, 3250].map((value, index) => (
                <div 
                  key={index} 
                  className="bg-primary w-1/6 transition-all duration-300 ease-in-out hover:opacity-80"
                  style={{ height: `${(value / 3250) * 100}%` }}
                >
                  <div className="text-xs text-center mt-2 transform -rotate-90">${value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}