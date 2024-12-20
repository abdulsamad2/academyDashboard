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
    title: 'Home',
    href: '/parent-dashboard',
    icon: 'home', // Matches the key in the Icons object
    label: 'Dashboard'
  },

  {
    title: 'Children Overview',
    href: '/parent-dashboard/children',
    icon: 'employee', // Matches the key in the Icons object
    label: 'My Children'
  },
  {
    title: 'Parent Profile',
    href: '/parent-dashboard/profile',
    icon: 'profile', // Matches the key in the Icons object
    label: 'Profile'
  },
  {
    title: 'Add More Child',
    href: '/parent-dashboard/children/new',
    icon: 'student', // Matches the key in the Icons object
    label: 'Add Child'
  },
  // {
  //   title: 'Help',
  //   href: '/parent-dashboard/help',
  //   icon: 'help', // Matches the key in the Icons object
  //   label: 'Help'
  // },

  {
    title: 'Invoices / Deposits',
    href: '/parent-dashboard/billing',
    icon: 'creditCard', // Matches the key in the Icons object
    label: 'Billing'
  }
];
