import React from 'react';
import Jobs from './components/Jobs';
import { getJobs } from '@/action/jobActions';

const page = async () => {
  const tutorRequests = await getJobs();
  return (
    <div className="overflow-auto">
      <Jobs
        //@ts-ignore
        tutorRequests={tutorRequests ? tutorRequests : []}
      />
    </div>
  );
};

export default page;
