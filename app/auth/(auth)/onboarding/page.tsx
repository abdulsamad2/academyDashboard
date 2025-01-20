'use client';
import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ParentOnBoarding } from '@/components/forms/parent-oboarding';
import { TutorOnboarding } from '@/components/forms/tutor-onboarding';
import { useRouter } from 'next/navigation';
import { getSubjects } from '@/action/subjectAction';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function OnboardingForm() {
  const [userType, setUserType] = useState<'parent' | 'tutor' | null>(null);
  const [subject, setSubject] = useState<Record<string, any> | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();

  useEffect(() => {
    //@ts-ignore
    if (session?.onboarding !== true) {
      //@ts-ignore
      if (session?.role === 'parent') router.push('/parent-dashboard');
      //@ts-ignore
      if (session?.role === 'tutor') router.push('/tutor-dashboard');
      //@ts-ignore
      if (session?.role === 'admin') router.push('/dashboard');
    }
    setIsLoading(false);
  }, [session, router]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const sub = await getSubjects();
        setSubject(sub && sub.length > 0 ? sub : []);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setSubject([]);
      }
    };

    fetchSubjects();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800 md:p-8">
      <motion.div
        className="mx-auto max-w-screen-lg"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <Card className="bg-white/90 shadow-xl backdrop-blur-sm dark:bg-gray-800/90">
          <CardHeader className="space-y-4 text-center">
            <CardTitle className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-3xl font-bold text-transparent dark:from-primary/90 dark:to-primary/70">
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
              Unlock a world of learning and growth with our tuition academy!
              Whether you&apos;re looking for expert education or ready to share your
              expertise, we&apos;re here to support your journey. Join us today and
              take the first step toward excellence together!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-6">
            <motion.div className="space-y-6" variants={fadeInUp}>
              <h3 className="text-center text-xl font-semibold text-gray-800 dark:text-gray-100">
                JOINING AS
              </h3>
              <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
                <Button
                  variant={userType === 'parent' ? 'default' : 'outline'}
                  onClick={() => setUserType('parent')}
                  className={`flex h-64 flex-col items-center justify-center gap-4 p-6 transition-all duration-300 dark:border-gray-600 dark:text-gray-100 ${
                    userType === 'parent' ? 'scale-105 shadow-lg' : ''
                  }`}
                >
                  <div className="h-32 w-32 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      width={200}
                      height={200}
                      src="/parent.jpeg"
                      alt="Parent"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-xl font-bold">Parents / Customer</span>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Find the perfect tutor for your educational needs
                  </p>
                </Button>
                <Button
                  variant={userType === 'tutor' ? 'default' : 'outline'}
                  onClick={() => setUserType('tutor')}
                  className={`flex h-64 flex-col items-center justify-center gap-4 p-6 transition-all duration-300 dark:border-gray-600 dark:text-gray-100 ${
                    userType === 'tutor' ? 'scale-105 shadow-lg' : ''
                  }`}
                >
                  <div className="h-32 w-32 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src="/tutor.jpeg"
                      alt="Tutor"
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-xl font-bold">Tutor / Teacher</span>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Share your expertise and help students excel
                  </p>
                </Button>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-6">
              {userType === 'parent' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ParentOnBoarding initialData={null} />
                </motion.div>
              )}

              {userType === 'tutor' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <TutorOnboarding
                    initialData={null}
                    key={null}
                    //@ts-ignore
                    subject={subject ? subject : []}
                  />
                </motion.div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
