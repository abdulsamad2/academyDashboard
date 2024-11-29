import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Banknote,
  Book,
  Calendar,
  Edit,
  Facebook,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Share2,
  Twitter,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';
import { getAssignedStudent } from '@/action/AssignTutor';
import Link from 'next/link';
import { redirect } from 'next/dist/server/api-utils';
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
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left Column - Tutor Profile */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle> Profile</CardTitle>
                <div className="flex space-x-2">
                  <Link href={'/tutor-dashboard/profile'}>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Update Profile
                    </Button>
                  </Link>
                  {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Profile
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Facebook className="mr-2 h-4 w-4" />
                        Share on Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Twitter className="mr-2 h-4 w-4" />
                        Share on Twitter
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Linkedin className="mr-2 h-4 w-4" />
                        Share on LinkedIn
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Share via Email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    //@ts-ignore
                    src={data?.tutor?.profilepic}
                    alt="Tutor"
                  />
                  <AvatarFallback>{'A'}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{data?.name}</h2>
                  <p className="text-muted-foreground">
                    {`${data?.tutor?.subjects[0]} Tutor`}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2"></div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{data?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{data?.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{data?.city}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {data?.tutor?.subjects.map((_item) => (
                  <Badge key={_item}>{_item}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button>Coming Soon</Button>
              {/* <ul className="space-y-2">
                <li className="flex items-center justify-between">
                  <span>Advanced Calculus</span>
                  <span className="text-muted-foreground">Today, 2:00 PM</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Physics 101</span>
                  <span className="text-muted-foreground">
                    Tomorrow, 10:00 AM
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Linear Algebra</span>
                  <span className="text-muted-foreground">May 15, 3:30 PM</span>
                </li>
              </ul> */}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Assigned Students and Other Sections */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Students</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {firstThreeStudents.map((_item, index) => (
                  <li key={_item.id} className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt={`Student ${index + 1}`}
                      />
                      <AvatarFallback>S{index + 1}</AvatarFallback>
                    </Avatar>
                    <span>{_item.name}</span>
                    <Badge variant="outline">{_item.studymode}</Badge>
                  </li>
                ))}
              </ul>
              <Link href="/tutor-dashboard/students">
                <Button className="mt-4 w-full">View All Students</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Button>Coming Soon</Button>

              {/* <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{students.length}</div>
                  <div className="text-muted-foreground">Active Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">4.9</div>
                  <div className="text-muted-foreground">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-muted-foreground">Attendance Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-muted-foreground">Hours Taught</div>
                </div>
              </div> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Coming soon
                </Button>
                {/* <Button className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Students
                </Button>
                <Button className="w-full">
                  <Book className="mr-2 h-4 w-4" />
                  Create Lesson Plan
                </Button>
                <Button className="w-full">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  View Progress Reports
                </Button>
                */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
