'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ParentForm } from '@/components/forms/parent-form'
import { TutorForm } from '@/components/forms/tutor-form'

export default function OnboardingForm() {
  const [userType, setUserType] = useState<'parent' | 'tutor'>('parent')

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-screen-lg ">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription>Please provide the following information to get started with our tuition academy.</CardDescription>
        </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>I am a:</Label>
              <RadioGroup defaultValue="parent" onValueChange={(value) => setUserType(value as 'parent' | 'tutor')} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="parent" id="parent" />
                  <Label htmlFor="parent">Parent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tutor" id="tutor" />
                  <Label htmlFor="tutor">Tutor</Label>
                </div>
              </RadioGroup>
            </div>

            {userType === 'parent' && (
              <ParentForm initialData={null} />
            )}

            {userType === 'tutor' && (
              <TutorForm initialData={null} />
            )}
          </CardContent>
          
      </Card>
    </div>
  )
}
