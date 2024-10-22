"use client"

import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { DollarSign, GraduationCap, Clock, Users } from "lucide-react"
import { getAllStudents } from "@/action/studentRegistration"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { getAllTutors } from "@/action/tutorRegistration"

export default function AdminPanelHome() {
  const [students, setStudents] = useState<Record<string, any> | null>(null);
  const [tutor, setTutor] = useState<Record<string, any> | null>(null);
  const {data:session} = useSession()

  
  useEffect(() => {
    const fetchStudents = async () => {
      const data = await getAllStudents();
      const tutor = await getAllTutors();
      setStudents(data);
      setTutor(tutor);
    };
    fetchStudents();
  }, []);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {
            //@ts-ignore
          session?.user.name
          } 👋</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button>Download Report</Button>
          </div>
        </div>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">000000</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{students?.length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,234</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tutors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tutor?.length || 0}</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: "Jan", revenue: 12000 },
                    { month: "Feb", revenue: 15000 },
                    { month: "Mar", revenue: 18000 },
                    { month: "Apr", revenue: 22000 },
                    { month: "May", revenue: 25000 },
                    { month: "Jun", revenue: 28000 },
                  ].map((item) => (
                    <div key={item.month} className="flex items-center">
                      <div className="w-16 text-sm">{item.month}</div>
                      <Progress value={(item.revenue / 28000) * 100} className="flex-1 mr-4" />
                      <div className="w-20 text-right text-sm">${item.revenue.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "$1,999.00" },
                    { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "$1,499.00" },
                    { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "$1,299.00" },
                  ].map((invoice) => (
                    <div key={invoice.email} className="flex items-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={invoice.name} />
                        <AvatarFallback>{invoice.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium">{invoice.name}</p>
                        <p className="text-sm text-muted-foreground">{invoice.email}</p>
                      </div>
                      <div className="ml-auto font-medium">{invoice.amount}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
