import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';

export default async function Component() {
  return (
    <div className="flex min-h-screen w-full">
      <aside className="fixed inset-y-0 left-0 top-14 z-10 w-64 flex-col border-r bg-background">
        <nav className="flex flex-col items-start gap-2 px-4 py-6">
          <Link
            href="#"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <UsersIcon className="h-5 w-5" />
            <span>Students</span>
          </Link>
          <Link
            href="#"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <CalendarIcon className="h-5 w-5" />
            <span>Calendar</span>
          </Link>
          <Link
            href="#"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <BookIcon className="h-5 w-5" />
            <span>Lessons</span>
          </Link>
          <Link
            href="#"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <SettingsIcon className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Students</CardTitle>
                <CardDescription>
                  An overview of your current students.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold">24</div>
                  <UsersIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Upcoming Lessons</CardTitle>
                <CardDescription>
                  A summary of your upcoming lessons.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold">8</div>
                  <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Announcements</CardTitle>
                <CardDescription>
                  Important updates and announcements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-bold">3</div>
                  <BellIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Recent Students</CardTitle>
                <CardDescription>
                  A list of your most recent students.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Enrolled</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">John Doe</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-muted-foreground">
                          john@example.com
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>2023-04-15</div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Jane Smith</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-muted-foreground">
                          jane@example.com
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>2023-04-12</div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Bob Johnson</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-muted-foreground">
                          bob@example.com
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>2023-04-10</div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Upcoming Lessons</CardTitle>
                <CardDescription>
                  A list of your upcoming lessons.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">John Doe</div>
                      </TableCell>
                      <TableCell>
                        <div>2023-04-20</div>
                      </TableCell>
                      <TableCell>
                        <div>10:00 AM</div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Jane Smith</div>
                      </TableCell>
                      <TableCell>
                        <div>2023-04-22</div>
                      </TableCell>
                      <TableCell>
                        <div>2:00 PM</div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <div className="font-medium">Bob Johnson</div>
                      </TableCell>
                      <TableCell>
                        <div>2023-04-25</div>
                      </TableCell>
                      <TableCell>
                        <div>4:30 PM</div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Announcements</CardTitle>
                <CardDescription>
                  Important updates and announcements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <BellIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">New Course Added</div>
                      <div className="text-muted-foreground">
                        A new course on Advanced JavaScript has been added to
                        the curriculum.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <CalendarIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">Upcoming Webinar</div>
                      <div className="text-muted-foreground">
                        Join us for a webinar on effective teaching strategies
                        on April 30th at 7 PM.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <InfoIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">Grading Policy Update</div>
                      <div className="text-muted-foreground">
                        The grading policy has been updated to include more
                        emphasis on class participation.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

function BellIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function BookIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function InfoIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
