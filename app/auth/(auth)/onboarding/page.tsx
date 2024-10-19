'use client'
import { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { TutorForm } from '@/components/forms/tutor-form'
import { getSubjects } from '@/action/subjectAction'
import { ParentOnBoarding } from '@/components/forms/parent-oboarding'
import { useRouter } from 'next/navigation'
export default  function OnboardingForm() {
  const [userType, setUserType] = useState<'parent' | 'tutor'>('parent')
  const [subject,setSubject] = useState([''])
  const router = useRouter()
  const { useSession } = require("next-auth/react")
  
  const { data: session, update: updateSession } = useSession();
  if(session.onboarding !== true && session.role ==='parent') router.push('/parent-dashboard');
  if(session.onboarding !== true && session.role ==='tutor') router.push('/tutor-dashboard');
  if(session.onboarding !== true && session.role ==='admin') router.push('/dashboard');

  useEffect(() => {
    const fetchSubjects = async () => {

      try {
        const sub = await getSubjects();
        if (sub && sub.length > 0) {
          setSubject(sub)
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchSubjects();
  }, []); 
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
              <ParentOnBoarding initialData={null} />
            )}

            {userType === 'tutor' && (
              <TutorForm initialData={null} //@ts-ignore
               subject={subject} />
            )}
          </CardContent>
          
      </Card>
    </div>
  )
}
