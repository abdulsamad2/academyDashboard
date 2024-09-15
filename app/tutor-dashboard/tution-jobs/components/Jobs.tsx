'use client'

import { useState, useEffect } from 'react'
import { Search, } from 'lucide-react'
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
  DialogDescription,
} from "@/components/ui/dialog"


// Mock data for tutor requests

interface jobsPorps{
  tutorRequests: {
    id: number;
    user: {
      name: string;
      email: string;
      image: string;
    };
    subject: string;
    requriments: string;
    updatedAt: string;
  }[];
}

export default function Jobs({tutorRequests}:jobsPorps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredRequests = tutorRequests && tutorRequests.filter(request =>
    request?.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request?.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )


  if (!mounted) return null
  if (!tutorRequests.length) return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
      </div>
      <div className="text-center">
        <p className="text-lg">No tutor requests found.</p>
      </div>
    </div>
  )
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">

      </div>

      <div className="mb-8 max-w-md mx-auto relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name or subject"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredRequests.map(request => (
          <Card key={request.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Requested By:{request.user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date(request.updatedAt).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <p className="font-semibold mb-2">Subject: {request.subject}</p>
              <p className="text-sm mb-4 flex-grow">
                {request.requriments?.length > 50
                  ? `${request.requriments.slice(0, 50)}...`
                  : request.requriments}
              </p>
              <div className="flex justify-between items-center mt-auto">
                <Badge variant="secondary">
                 
                  {
                  //@ts-ignore 
                  request.mode}
                </Badge>
                <Dialog>
                  <DialogTrigger>
                    <Badge>Contact</Badge>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contact Details</DialogTitle>
                      <DialogDescription>
                        <div className='border p-4 '>
                          <p>Email:{request.user.email}</p>
                          <p>Phone:{
                           //@ts-ignore
                          request.user.phone}</p>
                        </div>

                      </DialogDescription>
                    </DialogHeader>
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