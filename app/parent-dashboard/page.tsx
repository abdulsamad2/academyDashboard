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
import { RequestTutorForm } from './components/requestTutor';

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
              <CardTitle>Tution Fee</CardTitle>
              <CardDescription>This Month tution Fee</CardDescription>
              <CardContent>
                <div className="pt-4 text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
                <p className="mt-3 text-muted-foreground">
                  Due Date : 5 Sep 24
                </p>
              </CardContent>
            </CardHeader>
            <CardFooter>
              <div>
                <Button onClick={handlePayment}>Pay it Now</Button>
              </div>
            </CardFooter>
          </Card>

          {/* Tutor Request */}
          <Card>
            <CardContent>
              <CardHeader>
                <CardTitle>Request Tutor</CardTitle>
              </CardHeader>
              <RequestTutorForm initialData={null} />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Enrolled Courses */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Enrolled Tutions</CardTitle>
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
                    <p className="text-sm text-gray-500">
                      Tutor: Prof. Johnson
                    </p>
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

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Tutor Request</CardTitle>
            </CardHeader>

            <CardContent>
              <h4>You haven't Requested a tutor yet</h4>

              {/* <div className="divide-y">
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
                    <p className="text-sm text-gray-500">
                      Tutor: Prof. Johnson
                    </p>
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
              </div> */}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
