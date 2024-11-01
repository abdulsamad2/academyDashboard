

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
    href: '/parent-dashboard/billing',
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
    title: 'Register Child',
    href: '/parent-dashboard/children/new',
    icon: 'user', // Matches the key in the Icons object
    label: 'Add Child'
  },
  {
    title: 'Help',
    href: '/parent-dashboard/help',
    icon: 'user', // Matches the key in the Icons object
    label: 'Help'
  },

  {
    title: 'Profile',
    href: '/parent-dashboard/profile',
    icon: 'user', // Matches the key in the Icons object
    label: 'Profile'
  }
];
