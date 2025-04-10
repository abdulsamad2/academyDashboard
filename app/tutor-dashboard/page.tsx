import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Edit,
  Mail,
  MapPin,
  Phone,
  Users,
  Clock,
  BookOpen,
  ChevronRight,
  Coins,
  Trophy,
  Star,
  BellRing,
  CalendarCheck
} from 'lucide-react';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';
import { getAssignedStudent } from '@/action/AssignTutor';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const prisma = new PrismaClient();

export default async function TutorDashboardHome() {
  const session = await auth();
  //@ts-ignore
  const id = session?.id;
  const data = await prisma.user.findUnique({
    where: {
      id: id
    },
    include: {
      tutor: true
    }
  });
  const students = await getAssignedStudent(id);
  // slice first 3 students
  const firstThreeStudents = students.slice(0, 3);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Welcome section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome back, {data?.name?.split(' ')[0]}</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your tutoring today.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Link href={'/tutor-dashboard/profile'}>
            <Button variant="outline" size="sm" className="h-9">
              <Edit className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
          </Link>
          <Link href="/tutor-dashboard/students">
            <Button size="sm" className="h-9">
              <Users className="mr-2 h-4 w-4" />
              My Students
            </Button>
          </Link>
        </div>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {students.length > 0 ? `${students.length} active students` : "No students yet"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground mt-1">
              Coming soon
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground mt-1">
              Coming soon
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <Coins className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground mt-1">
              Coming soon
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My Profile</CardTitle>
              <Link href={'/tutor-dashboard/profile'}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit profile</span>
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <Avatar className="h-20 w-20 border-2 border-background">
                <AvatarImage
                  src={data?.tutor?.profilepic || ""}
                  alt="Tutor"
                />
                <AvatarFallback className="text-lg">{data?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{data?.name}</h2>
                <p className="text-muted-foreground">
                  {`${data?.tutor?.subjects?.[0] || 'General'} Tutor`}
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{data?.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{data?.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{data?.city || 'Not provided'}</span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {data?.tutor?.subjects?.map((item: string) => (
                  <Badge key={item} variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary">
                    {item}
                  </Badge>
                ))}
                {(!data?.tutor?.subjects || data.tutor.subjects.length === 0) && (
                  <span className="text-sm text-muted-foreground">No subjects added yet</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main content area - Right column */}
        <div className="md:col-span-2 space-y-6">
          {/* Upcoming Sessions */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Upcoming Sessions</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Schedule</span>
                </Button>
              </div>
              <CardDescription>Your upcoming tutoring sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CalendarCheck className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">Coming Soon</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Session scheduling functionality will be available soon.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Students */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Assigned Students</CardTitle>
                <Link href="/tutor-dashboard/students">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">All Students</span>
                  </Button>
                </Link>
              </div>
              <CardDescription>Students you are currently tutoring</CardDescription>
            </CardHeader>
            <CardContent>
              {firstThreeStudents.length > 0 ? (
                <div className="space-y-4">
                  {firstThreeStudents.map((_item, index) => (
                    <div key={_item.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src="/placeholder.svg?height=32&width=32"
                            alt={`Student ${index + 1}`}
                          />
                          <AvatarFallback>{_item.name?.[0] || `S${index + 1}`}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{_item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Grade {_item.class || 'N/A'}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{_item.studymode}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Users className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No students assigned yet</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    You currently don&apos;t have any students assigned to you.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Link href="/tutor-dashboard/students" className="w-full">
                <Button className="w-full gap-1">
                  View All Students
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="w-full h-auto flex-col py-4 px-3 justify-start items-start space-y-2" variant="outline" disabled>
                  <Calendar className="h-5 w-5 mb-1" />
                  <div className="text-sm font-medium text-left">Schedule Session</div>
                  <p className="text-xs text-muted-foreground text-left">Coming soon</p>
                </Button>
                <Link href="/tutor-dashboard/resources" className="w-full">
                  <Button className="w-full h-auto flex-col py-4 px-3 justify-start items-start space-y-2" variant="outline">
                    <BookOpen className="h-5 w-5 mb-1" />
                    <div className="text-sm font-medium text-left">Resources</div>
                    <p className="text-xs text-muted-foreground text-left">Access teaching materials</p>
                  </Button>
                </Link>
                <Button className="w-full h-auto flex-col py-4 px-3 justify-start items-start space-y-2" variant="outline" disabled>
                  <Trophy className="h-5 w-5 mb-1" />
                  <div className="text-sm font-medium text-left">Performance</div>
                  <p className="text-xs text-muted-foreground text-left">Coming soon</p>
                </Button>
                <Button className="w-full h-auto flex-col py-4 px-3 justify-start items-start space-y-2" variant="outline" disabled>
                  <BellRing className="h-5 w-5 mb-1" />
                  <div className="text-sm font-medium text-left">Notifications</div>
                  <p className="text-xs text-muted-foreground text-left">Coming soon</p>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
