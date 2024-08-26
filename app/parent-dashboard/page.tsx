'use client';

import { useState } from 'react';
import {
  Bell,
  CreditCard,
  Book,
  User,
  LogOut,
  Menu,
  X,
  Home,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function Component() {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [tutorSubject, setTutorSubject] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handlePayment = () => {
    console.log('Processing payment:', paymentAmount);
  };

  const handleTutorRequest = () => {
    console.log('Requesting tutor for:', tutorSubject);
  };

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Parent Dashboard</h1>
            </div>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>
      </div>
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
                      <div className=""></div>{' '}
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
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-semibold">Advanced Mathematics</h3>
                  <p className="text-sm text-gray-500">Tutor: Dr. Smith</p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-semibold">Physics 101</h3>
                  <p className="text-sm text-gray-500">Tutor: Prof. Johnson</p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-semibold">English Literature</h3>
                  <p className="text-sm text-gray-500">Tutor: Ms. Davis</p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
