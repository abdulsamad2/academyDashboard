'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  PersonStandingIcon as Person,
  School,
  CheckCircle,
  ExpandIcon as Add,
  StarIcon
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import RequestTutorForm from './requestTutor';

interface ParentStepsProps {
  parentName: string;
  studentCount: number;
  tutorRequests: number;
}

export default function ParentSteps({
  parentName,
  studentCount,
  tutorRequests
}: ParentStepsProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isRequestTutorOpen, setIsRequestTutorOpen] = useState(false);

  useEffect(() => {
    if (studentCount > 0) {
      setActiveStep(1);
    }
    if (tutorRequests > 0) {
      setActiveStep(2);
    }
  }, [studentCount, tutorRequests]);

  const steps = [
    {
      label: 'Add Child',
      icon: Person,
      description:
        'Provide details about your child to help us find the best tutor match.'
    },
    {
      label: 'Request Tutor',
      icon: School,
      description:
        "Now that you've added your child, let's find them a perfect tutor."
    },
    {
      label: 'Wait for Matching',
      icon: CheckCircle,
      description:
        "We're working on finding the best tutor for your child. We'll notify you once we have a match!"
    }
  ];

  const handleRequestTutorSuccess = () => {
    setIsRequestTutorOpen(false);
    setActiveStep(2);
  };

  if (studentCount > 0 && tutorRequests > 0) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <StarIcon className="mr-2 h-8 w-8 text-primary" />
            Onboarding Complete
          </CardTitle>
          <CardDescription>
            You've successfully added your child and requested a tutor!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Button asChild>
            <Link href="/parent-dashboard/children/new">
              <Add className="mr-2 h-4 w-4" /> Add Another Child
            </Link>
          </Button>
          <Dialog
            open={isRequestTutorOpen}
            onOpenChange={setIsRequestTutorOpen}
          >
            <DialogTrigger asChild>
              <Button variant="secondary">
                <School className="mr-2 h-4 w-4" /> Request Another Tutor
              </Button>
            </DialogTrigger>
            <DialogContent
              style={{
                position: 'fixed',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '70vw!important',
                height: '90vh',
                overflowY: 'auto',
                padding: '2rem'
              }}
            >
              <RequestTutorForm
                onSuccess={handleRequestTutorSuccess}
                initialData={null}
              />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Progress
        value={(activeStep / (steps.length - 1)) * 100}
        className="mb-8"
      />

      <AnimatePresence>
        {steps.map((step, index) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`mb-6 ${index > activeStep ? 'opacity-50' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <step.icon
                    className={`mr-2 h-6 w-6 ${
                      index <= activeStep
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  />
                  Step {index + 1}: {step.label}
                </CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {index === 0 && (
                  <Button
                    asChild
                    className="w-full"
                    disabled={index > activeStep}
                  >
                    <Link href="/parent-dashboard/children/new">
                      <Add className="mr-2 h-4 w-4" /> Add Child
                    </Link>
                  </Button>
                )}
                {index === 1 && studentCount > 0 && (
                  <Dialog
                    open={isRequestTutorOpen}
                    onOpenChange={setIsRequestTutorOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="w-full" disabled={index > activeStep}>
                        <School className="mr-2 h-4 w-4" /> Request Tutor
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className="max-h-[90vh] w-[70vw] overflow-y-auto p-6"
                      style={{
                        position: 'fixed',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <DialogHeader>
                        <DialogTitle>Request a Tutor</DialogTitle>
                        <DialogDescription>
                          Fill out the form below to request a tutor for your
                          child.
                        </DialogDescription>
                      </DialogHeader>
                      <RequestTutorForm
                        onSuccess={handleRequestTutorSuccess}
                        initialData={null}
                      />
                    </DialogContent>
                  </Dialog>
                )}
                {index === 1 && studentCount === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Please add a child first to request a tutor
                  </p>
                )}
              </CardContent>
              {index === activeStep && (
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    This is your current step
                  </p>
                </CardFooter>
              )}
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
