import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  tutor: any;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Inquiries',
    href: '/dashboard/inquiries',
    icon: 'messageSquare',
    label: 'Inquiries'
  },
  {
    title: 'Tutors',
    href: '/dashboard/tutor',
    icon: 'tutor',
    label: 'Tutors'
  },
  {
    title: 'Tutor Report',
    href: '/dashboard/tutor-report',
    icon: 'barChart',
    label: 'Tutor Report',
    variant: 'new'
  },

  {
    title: 'Students',
    href: '/dashboard/student',
    icon: 'student',
    label: 'Students'
  },
  {
    title: 'Parents',
    href: '/dashboard/parent',
    icon: 'parent',
    label: 'Parents'
  },
  {
    title: 'Users',
    href: '/dashboard/user',
    icon: 'admin',
    label: 'Users'
  },
  {
    title: 'Lessons',
    href: '/dashboard/lesson',
    icon: 'book',
    label: 'Lessons'
  },
  {
    title: 'Subjects',
    href: '/dashboard/subject',
    icon: 'job',
    label: 'Subjects'
  },
  {
    title: 'Books',
    href: '/dashboard/book',
    icon: 'book',
    label: 'Books'
  },
  {
    title: 'Invoices',
    href: '/dashboard/invoices',
    icon: 'post',
    label: 'Invoices'
  },

  {
    title: 'Deposits',
    href: '/dashboard/deposit',
    icon: 'billing',
    label: 'Deposits'
  },

  {
    title: 'Payouts',
    href: '/dashboard/payout',
    icon: 'earning',
    label: 'Payouts'
  },
  {
    title: 'Profile',
    href: '/dashboard/profile',
    icon: 'profile',
    label: 'Profile'
  }
];
