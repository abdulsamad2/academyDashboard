
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
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { formatIsoDate } from '@/lib/utils';
import Billpayment from './components/Billpayment';
import { RequestTutorForm } from './components/requestTutor';
import { getJobsByParentId } from '@/action/jobActions';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default async function Component() {
  const session = await auth()

const  postedJobs= await prisma.job.findMany({
  where: {
    userId: session?.user?.id,
  },

});

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="z-10 bg-white dark:bg-gray-900 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-black dark:text-white">
                Parent Dashboard
              </h1>
            </div>
            <Button variant="outline" size="icon" className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
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
          <Billpayment />

          {/* Tutor Request */}
          <Card>
            <CardHeader>
              <CardTitle>Request Tutor</CardTitle>
            </CardHeader>
            <CardContent>
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
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-semibold">Physics 101</h3>
                    <p className="text-sm text-gray-500">Tutor: Prof. Johnson</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-semibold">English Literature</h3>
                    <p className="text-sm text-gray-500">Tutor: Ms. Davis</p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Tutor Request */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>My Tutor Request</CardTitle>
            </CardHeader>
            <CardContent>
              {postedJobs.length > 0 ? (
                postedJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between py-2">
                    <div>
                      <h3 className="font-semibold">Subject: {job.subject.toUpperCase()}</h3>
                      <p className="text-sm text-gray-500">
                        {/* Details: {job?.requriments.length > 20 ? `${job.requirements.substring(0, 20)}...` : job.requirements} */}
                      </p>
                      <Separator />
                      <p className="text-sm text-gray-500">{formatIsoDate(job.createdAt)}</p>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                ))
              ) : (
                <h4>You havent requested a tutor yet</h4>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
