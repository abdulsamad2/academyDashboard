interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  //@ts-ignore
  icon?: keyof typeof Icons;
  label?: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export const MenuItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/parent-dashboard',
    icon: 'home',
    label: 'Home'
  },
  {
    title: 'My Children',
    href: '/parent-dashboard/children',
    icon: 'users',
    label: 'Children'
  },
  {
    title: 'Add Child',
    href: '/parent-dashboard/children/new',
    icon: 'add',
    label: 'Add Child'
  },

  {
    title: 'Invoices & Payments',
    href: '/parent-dashboard/billing',
    icon: 'creditCard',
    label: 'Invoices'
  },
  {
    title: 'Learning Resources',
    href: '/parent-dashboard/resources',
    icon: 'book',
    label: 'Resources'
  },
  {
    title: 'My Profile',
    href: '/parent-dashboard/profile',
    icon: 'profile',
    label: 'Profile'
  },
];
