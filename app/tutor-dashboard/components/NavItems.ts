
interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  //@ts-ignore
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
    icon: 'bookOpen', // Matches the key in the Icons object
    label: 'Tution Job'
  },
  {
    title: 'Students',
    href: '/tutor-dashboard/students',
    icon: 'user', // Matches the key in the Icons object
    label: 'Students'
  },
  {
    title: 'Earnings',
    href: '/tutor-dashboard/earnings',
    icon: 'FileText', // Matches the key in the Icons object
    label: 'Earnings'
  },
  
  {
    title: 'My Profile',
    href: 'tutor-dashboard/profile',
    icon: 'user', // Matches the key in the Icons object
    label: 'Profile'
  }
];
