
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
    title: 'Invoices',
    href: 'tutor-dashboard/invoices',
    icon: 'FileText', // Matches the key in the Icons object
    label: 'Invoices'
  },
  {
    title: 'Transactions',
    href: '/schedule',
    icon: 'calendar', // Matches the key in the Icons object
    label: 'Transactions'
  },
  {
    title: 'Messages',
    href: 'tutor-dashboard/messages',
    icon: 'messageSquare', // Matches the key in the Icons object
    label: 'Messages'
  },
  {
    title: 'My Profile',
    href: 'tutor-dashboard/profile',
    icon: 'user', // Matches the key in the Icons object
    label: 'Profile'
  }
];
