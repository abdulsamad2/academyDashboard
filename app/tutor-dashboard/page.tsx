import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
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
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export default function TutorDashboardHome() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tutor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Tutor Profile */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Tutor Profile</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Update Profile
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Profile
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Facebook className="w-4 h-4 mr-2" />
                        Share on Facebook
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Twitter className="w-4 h-4 mr-2" />
                        Share on Twitter
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Linkedin className="w-4 h-4 mr-2" />
                        Share on LinkedIn
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" />
                        Share via Email
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Tutor" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">John Doe</h2>
                  <p className="text-muted-foreground">Mathematics & Physics Tutor</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>john.doe@example.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>New York, NY</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>Mathematics</Badge>
                <Badge>Physics</Badge>
                <Badge>Calculus</Badge>
                <Badge>Algebra</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span>Advanced Calculus</span>
                  <span className="text-muted-foreground">Today, 2:00 PM</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Physics 101</span>
                  <span className="text-muted-foreground">Tomorrow, 10:00 AM</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Linear Algebra</span>
                  <span className="text-muted-foreground">May 15, 3:30 PM</span>
                </li>
              </ul>
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
                <li className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Student 1" />
                    <AvatarFallback>S1</AvatarFallback>
                  </Avatar>
                  <span>Alice Johnson</span>
                  <Badge variant="outline">Mathematics</Badge>
                </li>
                <li className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Student 2" />
                    <AvatarFallback>S2</AvatarFallback>
                  </Avatar>
                  <span>Bob Smith</span>
                  <Badge variant="outline">Physics</Badge>
                </li>
                <li className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Student 3" />
                    <AvatarFallback>S3</AvatarFallback>
                  </Avatar>
                  <span>Charlie Brown</span>
                  <Badge variant="outline">Calculus</Badge>
                </li>
              </ul>
              <Button className="w-full mt-4">View All Students</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">15</div>
                  <div className="text-muted-foreground">Active Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">4.8</div>
                  <div className="text-muted-foreground">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-muted-foreground">Attendance Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">25</div>
                  <div className="text-muted-foreground">Hours Taught</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
                <Button className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Students
                </Button>
                <Button className="w-full">
                  <Book className="w-4 h-4 mr-2" />
                  Create Lesson Plan
                </Button>
                <Button className="w-full">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  View Progress Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}