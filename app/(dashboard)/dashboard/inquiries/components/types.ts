// types.ts
export interface Tutor {
  experience: any;
  subjects: any;
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  image: string;
}

export interface Application {
  id: string;
  coverLetter: string;
  tutor: Tutor;
}

export interface TutorRequest {
  id: string;
  user: {
    name: string;
    email: string;
    image: string;
    phone?: string;
  };
  subject: string;
  requriments: string;
  updatedAt: string;
  mode: string;
  status: string;
  start: string;
  hourly: string;
  location: string;
  studentLevel: string;
  application: Application[];
}

export interface Filters {
  studentLevel: string;
  mode: string;
  subject: string;
}
