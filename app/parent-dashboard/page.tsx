"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DollarSign, GraduationCap, FileText, AlertCircle } from "lucide-react"
import { RequestTutorForm } from "./components/requestTutor"
// Mock data - replace with actual data fetching in a real application
const studentData = {
  name: "Alex Johnson",
  grade: "10th Grade",
  subjects: ["Mathematics", "Physics", "English Literature"],
}

const recentTutorRequests = [
  { id: 1, subject: "Chemistry", date: "2023-05-10", status: "Pending" },
  { id: 2, subject: "Spanish", date: "2023-05-08", status: "Approved" },
]

const recentInvoices = [
  { id: 1, description: "May Tuition", amount: 500, dueDate: "2023-05-15", status: "Unpaid" },
  { id: 2, description: "April Tuition", amount: 500, dueDate: "2023-04-15", status: "Paid" },
  { id: 3, description: "March Tuition", amount: 500, dueDate: "2023-03-15", status: "Paid" },
]

export default function SimplifiedParentDashboard() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome, {session?.user?.name}!</h1>
        </div>
      
      </header>

      <Tabs defaultValue={activeTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>Overview</TabsTrigger>
          <TabsTrigger value="request-tutor" onClick={() => setActiveTab("request-tutor")}>Request Tutor</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p><strong>Name:</strong> {studentData.name}</p>
                <p><strong>Grade:</strong> {studentData.grade}</p>
                <p><strong>Subjects:</strong> {studentData.subjects.join(", ")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Tutor Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recentTutorRequests.map((request) => (
                    <li key={request.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{request.subject}</p>
                        <p className="text-sm text-gray-500">{request.date}</p>
                      </div>
                      <Badge variant={request.status === "Approved" ? "default" : "secondary"}>{request.status}</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Your recent tuition invoices and payment status</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {recentInvoices.map((invoice) => (
                    <li key={invoice.id} className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-medium">{invoice.description}</p>
                        <p className="text-sm text-gray-500">Due: {invoice.dueDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${invoice.amount}</p>
                        <Badge variant={invoice.status === "Paid" ? "default" : "destructive"}>{invoice.status}</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="mr-2 h-4 w-4" /> Pay Tuition
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <GraduationCap className="mr-2 h-4 w-4" /> View Academic Reports
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" /> Download Invoices
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400">
                  <AlertCircle className="h-5 w-5" />
                  <p>Your next payment of $500 is due on May 15, 2023</p>
                </div>
                <Button className="mt-4 w-full">Pay Now</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="request-tutor">
          <Card>
            <CardHeader>
              <CardTitle>Request a Tutor</CardTitle>
              <CardDescription>Fill out the form to request a new tutor</CardDescription>
            </CardHeader>
            <CardContent>
              <RequestTutorForm initialData={null} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}