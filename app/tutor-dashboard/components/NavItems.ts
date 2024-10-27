import { Icons } from "@/components/icons";

interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export const MenuItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/tutor-dashboard',
    icon: 'home', // Matches the key in the Icons object
    label: 'Dashboard'
  },
  {
    title: 'Tution Jobs',
    href: '/tutor-dashboard/tution-jobs',
    icon: 'job', // Matches the key in the Icons object
    label: 'Tution Job'
  },
  {
    title: 'Students',
    href: '/tutor-dashboard/students',
    icon: 'student', // Matches the key in the Icons object
    label: 'Students'
  },
  {
    title: 'Earnings',
    href: '/tutor-dashboard/earnings',
    icon: 'earning', // Matches the key in the Icons object
    label: 'Earnings'
  },
  
  {
    title: 'My Profile',
    href: '/tutor-dashboard/profile',
    icon: 'profile', // Matches the key in the Icons object
    label: 'Profile'
  }
];
