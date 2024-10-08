

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
    href: '/parent-dashboard',
    icon: 'home', // Matches the key in the Icons object
    label: 'Dashboard'
  },
  {
    title: 'Billing',
    href: '/billing',
    icon: 'creditCard', // Matches the key in the Icons object
    label: 'Billing'
  },
  {
    title: 'My Children',
    href: '/parent-dashboard/children',
    icon: 'user', // Matches the key in the Icons object
    label: 'My Children'
  },
  {
    title: 'Courses',
    href: 'parent-dashboard/courses',
    icon: 'book', // Matches the key in the Icons object
    label: 'Courses'
  },
  {
    title: 'Schedule',
    href: '/schedule',
    icon: 'calendar', // Matches the key in the Icons object
    label: 'Schedule'
  },
  {
    title: 'Messages',
    href: 'parent-dashboard/messages',
    icon: 'messageSquare', // Matches the key in the Icons object
    label: 'Messages'
  },
  {
    title: 'Profile',
    href: 'parent-dashboard/profile',
    icon: 'user', // Matches the key in the Icons object
    label: 'Profile'
  }
];
