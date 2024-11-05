"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, Mail, Phone } from "lucide-react"

const faqs = [
  {
    question: "How do I schedule a tutoring session?",
    answer: "Log into your account, go to the 'Schedule' tab, and select an available time slot with your preferred tutor."
  },
  {
    question: "What is the cancellation policy?",
    answer: "You can cancel a session up to 24 hours before the scheduled time without charge. Late cancellations may incur a fee."
  },
  {
    question: "How do I update my payment information?",
    answer: "Go to your account settings, select the 'Billing' tab, and you can add or modify your payment methods there."
  },
]

export default function HelpSection() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">How can we help you?</h1>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10 pr-4"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq" className="mb-12">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
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
              <CardDescription>We&apos;ll connect you with a tutor to discuss your needs</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Your email" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Describe your requirements" />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
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
            <Mail className="h-5 w-5 mr-2 text-primary" />
            <span>support@tutionacademy.com</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-2 text-primary" />
            <span>+1 (555) 123-4567</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}