'use client'

import { useState } from 'react'
import { Bell, CreditCard, Book, User, LogOut, Menu, X, Home, Calendar, MessageSquare } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export default function Component() {
  const [paymentAmount, setPaymentAmount] = useState('')
  const [tutorSubject, setTutorSubject] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handlePayment = () => {
    console.log('Processing payment:', paymentAmount)
  }

  const handleTutorRequest = () => {
    console.log('Requesting tutor for:', tutorSubject)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0 md:static"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" alt="Parent" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">John Doe</h2>
                <p className="text-sm text-gray-500">Parent</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Book className="mr-2 h-4 w-4" />
              Courses
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </nav>
          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              <h1 className="text-2xl font-bold">Parent Dashboard</h1>
            </div>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Children Enrolled: 2</p>
                <p>Active Courses: 3</p>
                <p>Next Payment Due: 15th May</p>
              </CardContent>
            </Card>

            {/* Bill Payment */}
            <Card>
              <CardHeader>
                <CardTitle>Pay Bill</CardTitle>
                <CardDescription>Process your tuition payment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      placeholder="Enter amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handlePayment}>Process Payment</Button>
              </CardFooter>
            </Card>

            {/* Tutor Request */}
            <Card>
              <CardHeader>
                <CardTitle>Request Tutor</CardTitle>
                <CardDescription>Request a tutor for your child</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="subject">Subject</Label>
                    <Select onValueChange={setTutorSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleTutorRequest}>Submit Request</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Enrolled Courses */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                <div className="py-2 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Advanced Mathematics</h3>
                    <p className="text-sm text-gray-500">Tutor: Dr. Smith</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Physics 101</h3>
                    <p className="text-sm text-gray-500">Tutor: Prof. Johnson</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">English Literature</h3>
                    <p className="text-sm text-gray-500">Tutor: Ms. Davis</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}