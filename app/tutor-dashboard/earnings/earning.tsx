'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { DollarSign, Users, TrendingUp, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import TutorPayout from "./components/TutorPayout"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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

 interface TutorEarningsDashboard {
  thisMonthEarnings: number;
  assignedStudents: number;
  payouts: any[];
  tutordetails: any;
 }

export default function TutorEarningsDashboard({thisMonthEarnings,payouts,assignedStudents,tutordetails}:TutorEarningsDashboard) {
  const [withdrawAmount, setWithdrawAmount] = useState("")

  const handleWithdrawRequest = () => {
    // Implement withdrawal logic here
    setWithdrawAmount("")
  }
  const earningsIncrease = ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100;
  const studentsIncrease = ((assignedStudents - lastMonthStudents) / lastMonthStudents) * 100;
  
  // Format date for next payout
  const nextPayoutDate = new Date().getDate() <= 8 ? '8th' : '8th of next month';
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earnings & Payouts</h1>
          <p className="text-muted-foreground mt-1">Track your income and payment history</p>
        </div>
        <Badge variant="outline" className="mt-2 sm:mt-0 bg-primary/5 border-primary/20 text-primary px-3 py-1.5 flex items-center">
          <Calendar className="mr-1.5 h-3.5 w-3.5" />
          Next payout: {nextPayoutDate}
        </Badge>
      </div>

      {/* Main metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Earnings Card */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RM {thisMonthEarnings.toFixed(2)}</div>
            <div className="flex items-center mt-1.5 text-sm">
              {earningsIncrease > 0 ? (
                <TrendingUp className="mr-1 h-3.5 w-3.5 text-green-600" />
              ) : (
                <TrendingUp className="mr-1 h-3.5 w-3.5 text-red-500 transform rotate-180" />
              )}
              <span className={earningsIncrease >= 0 ? "text-green-600" : "text-red-500"}>
                {earningsIncrease > 0 ? "+" : ""}{earningsIncrease.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1.5">from last month</span>
            </div>
            <Progress 
              value={thisMonthEarnings} 
              max={Math.max(thisMonthEarnings, lastMonthEarnings)} 
              className="mt-3 h-1.5 bg-green-200 dark:bg-green-950"
            />
          </CardContent>
        </Card>
        
        {/* Students Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedStudents}</div>
            <div className="flex items-center mt-1.5 text-sm">
              {studentsIncrease > 0 ? (
                <TrendingUp className="mr-1 h-3.5 w-3.5 text-blue-600" />
              ) : (
                <TrendingUp className="mr-1 h-3.5 w-3.5 text-red-500 transform rotate-180" />
              )}
              <span className={studentsIncrease >= 0 ? "text-blue-600" : "text-red-500"}>
                {studentsIncrease > 0 ? "+" : ""}{studentsIncrease.toFixed(1)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1.5">from last month</span>
            </div>
            <Progress 
              value={assignedStudents} 
              max={Math.max(assignedStudents, lastMonthStudents)} 
              className="mt-3 h-1.5 bg-blue-200 dark:bg-blue-950"
            />
          </CardContent>
        </Card>
        
        {/* Payment Info Card - Replaces the Withdraw Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Payment Schedule</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center">
              <div className="rounded-full bg-primary/10 p-1.5 mr-3">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium text-sm">Next Payment</div>
                <div className="text-xs text-muted-foreground">
                  {nextPayoutDate}
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              <p>Payouts are automatically processed on the 8th of each month to your registered bank account.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Separator className="my-8" />

      {/* Payout history */}
      <div>
        <TutorPayout tutordetails={tutordetails} payouts={payouts}/>
      </div>
      
      {/* Earnings chart */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Earnings Trend</CardTitle>
            <CardDescription>Your earnings over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyEarningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#88888820" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    borderColor: 'var(--border)',
                    borderRadius: '6px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                  }} 
                  formatter={(value) => [`RM ${value}`, 'Earnings']}
                />
                <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Note: Data is updated at the end of each month
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}