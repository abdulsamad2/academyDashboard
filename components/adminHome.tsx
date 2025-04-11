'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { DollarSign, GraduationCap, Clock, Users, TrendingUp } from 'lucide-react';
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
}: any): React.ReactElement {
  const { data: session } = useSession();

  // Calculate percentage changes
  const lastMonthRevenue = sixMonthrevenue[sixMonthrevenue.length - 1].revenue;
  const prevMonthRevenue = sixMonthrevenue[sixMonthrevenue.length - 2].revenue;
  const revenueChange = ((lastMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-8 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back,{' '}
              {
                //@ts-ignore
                session?.user.name
              }{' '}
              👋
            </h2>
            <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your academy today</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-500">
                  This Month Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">RM{lastMonthRevenue.toFixed(2)}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {revenueChange >= 0 ? (
                    <span className="text-green-500">+{revenueChange.toFixed(1)}% from last month</span>
                  ) : (
                    <span className="text-red-500">{revenueChange.toFixed(1)}% from last month</span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-500">
                  Students
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{students?.length || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Active students</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-500">
                  Hours Logged
                </CardTitle>
                <Clock className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Allhours?.hours || 0}h {Allhours?.minutes || 0}m</div>
                <div className="text-xs text-muted-foreground mt-1">All Hours so far</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-500">
                  Active Tutors
                </CardTitle>
                <Users className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tutor?.length || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">Currently teaching</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sixMonthrevenue.map((item: any, index: number) => (
                    <div key={item.month} className="flex items-center">
                      <div className="w-16 text-sm font-medium">
                        {item.month}
                      </div>
                      <div className="flex-1 mx-4">
                        <Progress
                          value={(item.revenue / 28000) * 100}
                          className="h-2"
                        />
                      </div>
                      <div className="w-20 text-right text-sm font-medium">
                        RM{item.revenue.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentInvoices.map(
                    (invoice: {
                      email: string;
                      total: GLfloat;
                      name: string;
                      parent: { name: string; email: string };
                    }, index: number) => (
                      <div key={`${invoice.email}-${index}`} className="flex items-center p-2 hover:bg-muted/50 rounded-lg transition-colors">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={`/placeholder.svg?height=36&width=36`}
                            alt={invoice.name}
                          />
                          <AvatarFallback className="bg-primary/10">
                            {invoice?.name
                              ? invoice.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                              : 'AS'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3 flex-grow">
                          <p className="text-sm font-medium">
                            {invoice?.parent.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {invoice.parent.email}
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          RM{invoice.total.toFixed(2)}
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
