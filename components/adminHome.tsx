'use client';

import { CalendarDateRangePicker } from '@/components/date-range-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { DollarSign, GraduationCap, Clock, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';

/**
 * AdminPanelHome
 *
 * This component renders the admin dashboard page.
 *
 * @param {Object} props - The component props
 * @param {Object} props.tutor - List of all tutors
 * @param {Object} props.students - List of all students
 * @param {Object} props.Allhours - The total hours logged by all tutors
 * @param {Object} props.recentInvoices - List of recent invoices
 * @param {Object} props.sixMonthrevenue - The total revenue for the last 6 months
 *
 * @returns {React.ReactElement} - The component
 */
export default function AdminPanelHome({
  tutor,
  students,
  Allhours,
  recentInvoices,
  sixMonthrevenue
}: any) {
  const { data: session } = useSession();

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-6 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back,{' '}
            {
              //@ts-ignore
              session?.user.name
            }{' '}
            👋
          </h2>
          <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
            <CalendarDateRangePicker />
            <Button className="w-full sm:w-auto">Download Report</Button>
          </div>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Month Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold sm:text-2xl">
                  {sixMonthrevenue[sixMonthrevenue.length - 1].revenue.toFixed(
                    2
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold sm:text-2xl">
                  {students?.length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Hours Logged
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold sm:text-2xl">
                  {Allhours?.hours || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Tutors
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold sm:text-2xl">
                  {tutor?.length || 0}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-7">
            <Card className="col-span-full lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sixMonthrevenue.map((item: any) => (
                    <div key={item.month} className="flex items-center">
                      <div className="w-12 text-xs sm:w-16 sm:text-sm">
                        {item.month}
                      </div>
                      <Progress
                        value={(item.revenue / 28000) * 100}
                        className="mr-2 flex-1 sm:mr-4"
                      />
                      <div className="w-16 text-right text-xs sm:w-20 sm:text-sm">
                        RM{item.revenue.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-full lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  {recentInvoices.map(
                    (invoice: {
                      email: string;
                      total: GLfloat;
                      name: string;
                      parent: { name: string; email: string };
                    }) => (
                      <div key={invoice.email} className="flex items-center">
                        <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                          <AvatarImage
                            src={`/placeholder.svg?height=36&width=36`}
                            alt={invoice.name}
                          />
                          <AvatarFallback>
                            {invoice?.name
                              ? invoice.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('') // Get initials
                              : 'AS'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-2 flex-grow space-y-0.5 sm:ml-4 sm:space-y-1">
                          <p className="text-sm font-medium">
                            {invoice?.parent.name}
                          </p>
                          <p className="text-xs text-muted-foreground sm:text-sm">
                            {invoice.parent.email}
                          </p>
                        </div>
                        <div className="text-xs font-medium sm:text-sm">
                          {invoice.total}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
