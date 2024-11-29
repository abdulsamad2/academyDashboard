'use client';
import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  Calendar,
  MessageCircle,
  CreditCard,
  User2Icon
} from 'lucide-react';

const WorkflowSteps = () => {
  const parentSteps = [
    {
      icon: <User2Icon className="h-6 w-6 text-blue-500" />,
      title: 'Create Account',
      description: 'Sign up and set up your parent profile with child details'
    },
    {
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
      title: "Add Your Child's Information",
      description:
        'Provide details about your child to help us understand their learning needs.'
    },
    {
      icon: <Calendar className="h-6 w-6 text-purple-500" />,
      title: 'Request a Tutor',
      description: 'Submit a tutor request specifying your preferences.'
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-orange-500" />,
      title: 'Get Matched with the Best Tutor',
      description:
        'Within 24 hours, we’ll find the ideal tutor for your child and notify you.'
    }
  ];

  const tutorSteps = [
    {
      icon: <User2Icon className="h-6 w-6 text-blue-500" />,
      title: 'Professional Profile',
      description:
        'Create a detailed profile showcasing your expertise and qualifications'
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      title: 'Verify Credentials',
      description:
        'Provide all necessary information along with valid credentials for verification.'
    },
    {
      icon: <BookOpen className="h-6 w-6 text-purple-500" />,
      title: 'Explore Tuition Jobs',
      description:
        'Browse available tutoring opportunities and apply for the ones that suit you.'
    },
    {
      icon: <CreditCard className="h-6 w-6 text-orange-500" />,
      title: 'Earn & Grow',
      description:
        'Within 24 hours, we’ll assign you a class and connect you with students.'
    }
  ];

  const AccordionItem = ({ title, steps, isOpen, onToggle }: any) => (
    <div className="rounded-lg border border-gray-200">
      <button
        className="flex w-full items-center justify-between bg-gray-100 px-4 py-3 text-left font-semibold text-gray-700"
        onClick={onToggle}
      >
        {title}
        <span className={`transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="bg-white p-4">
          <div className="space-y-4">
            {steps.map((step: any, index: number) => (
              <div key={index} className="flex items-start space-x-4">
                {step.icon}
                <div>
                  <h4 className="font-semibold text-gray-800">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const [openSection, setOpenSection] = useState('parents');

  return (
    <div className="container mx-auto my-8 px-4">
      <h1 className="mb-4 text-2xl font-bold text-primary">How It Works</h1>
      <p className="mb-8 text-gray-600">
        Explore the process of finding and booking tutoring sessions of our
        academy
      </p>

      <div className="space-y-6 rounded-lg bg-white p-6 shadow-md">
        <AccordionItem
          title="For Parents"
          steps={parentSteps}
          isOpen={openSection === 'parents'}
          onToggle={() =>
            //@ts-ignore
            setOpenSection(openSection === 'parents' ? null : 'parents')
          }
        />
        <AccordionItem
          title="For Tutors"
          steps={tutorSteps}
          isOpen={openSection === 'tutors'}
          onToggle={() =>
            //@ts-ignore
            setOpenSection(openSection === 'tutors' ? null : 'tutors')
          }
        />
      </div>
    </div>
  );
};

export default WorkflowSteps;
