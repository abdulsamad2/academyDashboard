"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Search, MessageCircle, Mail, Phone, BookOpen, Calendar, CreditCard, HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "How do I schedule a tutoring session?",
    answer: "You can schedule a tutoring session by logging into your account, navigating to the 'Schedule' tab, and selecting an available time slot with your preferred tutor."
  },
  {
    question: "What is the cancellation policy?",
    answer: "You can cancel a tutoring session up to 24 hours before the scheduled time without any charge. Cancellations made less than 24 hours in advance may incur a fee."
  },
  {
    question: "How do I update my payment information?",
    answer: "To update your payment information, go to your account settings and select the 'Billing' tab. From there, you can add or modify your payment methods."
  },
  {
    question: "Can I change my tutor?",
    answer: "Yes, you can request a change of tutor by contacting our support team. We'll do our best to match you with a tutor that meets your needs and preferences."
  },
  {
    question: "How are tutors vetted?",
    answer: "All our tutors undergo a rigorous vetting process, including background checks, qualification verification, and teaching demonstrations to ensure they meet our high standards."
  }
]

const popularTopics = [
  { title: "Scheduling", icon: Calendar },
  { title: "Billing", icon: CreditCard },
  { title: "Tutoring Process", icon: BookOpen },
  { title: "Technical Support", icon: HelpCircle }
]

export default function HelpSection() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">How can we help you?</h1>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 pr-4 py-2 w-full"
            placeholder="Search for help..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        {popularTopics.map((topic, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <topic.icon className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-lg font-semibold">{topic.title}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="faq" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>Send us a message and we&apos;ll get back to you as soon as possible</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="Your email" type="email" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="How can we help you?" />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Send Message</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>Chat with our support team in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <Button className="flex items-center">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Start Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Still need help?</CardTitle>
          <CardDescription>Contact us directly through these channels</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row justify-around items-center space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <Mail className="h-6 w-6 mr-2 text-primary" />
            <span>support@tutionacademy.com</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-6 w-6 mr-2 text-primary" />
            <span>+1 (555) 123-4567</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}