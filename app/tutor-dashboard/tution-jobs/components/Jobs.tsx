'use client'

import { useState, useEffect } from 'react'
import { Search, Mail, Phone, Calendar, BookOpen, MapPin, Briefcase } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface JobsProps {
  tutorRequests: {
    id: number;
    user: {
      name: string;
      email: string;
      image: string;
      phone?: string;
    };
    subject: string;
    requriments: string;
    updatedAt: string;
    mode?: string;
  }[];
}

export default function Jobs({ tutorRequests }: JobsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredRequests = tutorRequests.filter(request =>
    request.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Handle form submission here
    console.log('Form submitted')
  }

  if (!mounted) return null
  if (!tutorRequests.length) return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="text-center">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No tutor requests</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new tutor request.</p>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Tutor Requests</h1>

      <div className="mb-8 max-w-md mx-auto relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="search"
          placeholder="Search by name or subject"
          className="pl-10 pr-4 py-2 w-full rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredRequests.map(request => (
          <Card key={request.id} className="flex flex-col overflow-hidden transition-all duration-200 hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={request.user.image} />
                  <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{request.user.name}</CardTitle>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(request.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col pt-4">
              <Badge variant="secondary" className="self-start mb-2">
                <BookOpen className="h-3 w-3 mr-1" />
                {request.subject}
              </Badge>
              <p className="text-sm mb-4 flex-grow">
                {request.requriments?.length > 100
                  ? `${request.requriments.slice(0, 100)}...`
                  : request.requriments}
              </p>
              <div className="flex justify-between items-center mt-auto pt-4 border-t">
                <Badge variant="outline" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {request.mode || 'Not specified'}
                </Badge>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Apply for this job
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center space-x-2">
                        <Briefcase className="h-5 w-5" />
                        <span>Apply for {request.subject} Tutor Position</span>
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+1234567890" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Input id="experience" type="number" min="0" placeholder="2" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="message">Why are you a good fit for this position?</Label>
                        <Textarea id="message" placeholder="I am a good fit because..." required />
                      </div>
                      <DialogClose asChild>
                        <Button type="submit" className="w-full">Submit Application</Button>
                      </DialogClose>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}