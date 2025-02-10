import React from 'react';
import { getJobs } from '@/action/jobActions';
import TutorRequests from './components/TutorRequests'
const page = async () => {
  const tutorRequests = await getJobs();
  
  return (
    <div className="overflow-auto">
      <TutorRequests
        //@ts-ignore
        tutorRequests={tutorRequests ? tutorRequests : []}
      />
    </div>
  );
};

export default page;
