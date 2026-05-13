import { type Icons } from '@/components/icons';

export type NavRole = 'admin' | 'tutor' | 'parent' | 'student';

export interface NavLink {
  title: string;
  href: string;
  icon?: keyof typeof Icons;
  badge?: string;
  disabled?: boolean;
}

export interface NavSection {
  label: string;
  items: NavLink[];
}

const adminNav: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
      { title: 'Approvals', href: '/dashboard/approvals', icon: 'warning' },
      { title: 'Inquiries', href: '/dashboard/inquiries', icon: 'help' }
    ]
  },
  {
    label: 'Operations',
    items: [
      { title: 'Lessons', href: '/dashboard/lesson', icon: 'book' },
      { title: 'Subjects', href: '/dashboard/subject', icon: 'kanban' },
      { title: 'Resources', href: '/dashboard/book', icon: 'book' }
    ]
  },
  {
    label: 'People',
    items: [
      { title: 'Users', href: '/dashboard/user', icon: 'user' },
      { title: 'Tutors', href: '/dashboard/tutor', icon: 'employee' },
      { title: 'Parents', href: '/dashboard/parent', icon: 'user' },
      { title: 'Students', href: '/dashboard/student', icon: 'student' }
    ]
  },
  {
    label: 'Finance',
    items: [
      { title: 'Invoices', href: '/dashboard/invoices', icon: 'billing' },
      { title: 'Deposits', href: '/dashboard/deposit', icon: 'billing' },
      { title: 'Payouts', href: '/dashboard/payout', icon: 'earning' }
    ]
  }
];

const tutorNav: NavSection[] = [
  {
    label: 'Workspace',
    items: [
      { title: 'Dashboard', href: '/tutor-dashboard', icon: 'dashboard' },
      {
        title: 'My Students',
        href: '/tutor-dashboard/students',
        icon: 'student'
      },
      {
        title: 'Lessons',
        href: '/tutor-dashboard/lesson',
        icon: 'book'
      },
      {
        title: 'Tuition Jobs',
        href: '/tutor-dashboard/tution-jobs',
        icon: 'job'
      }
    ]
  },
  {
    label: 'Finance',
    items: [
      { title: 'Earnings', href: '/tutor-dashboard/earnings', icon: 'earning' }
    ]
  },
  {
    label: 'Account',
    items: [
      { title: 'Profile', href: '/tutor-dashboard/profile', icon: 'profile' },
      { title: 'Resources', href: '/tutor-dashboard/resources', icon: 'book' }
    ]
  }
];

const parentNav: NavSection[] = [
  {
    label: 'Workspace',
    items: [
      { title: 'Dashboard', href: '/parent-dashboard', icon: 'dashboard' },
      {
        title: 'My Children',
        href: '/parent-dashboard/children',
        icon: 'student'
      },
      {
        title: 'Add a Child',
        href: '/parent-dashboard/children/new',
        icon: 'add'
      }
    ]
  },
  {
    label: 'Finance',
    items: [
      { title: 'Billing', href: '/parent-dashboard/billing', icon: 'billing' }
    ]
  },
  {
    label: 'Account',
    items: [
      { title: 'Profile', href: '/parent-dashboard/profile', icon: 'profile' },
      { title: 'Resources', href: '/parent-dashboard/resources', icon: 'book' }
    ]
  }
];

export const NAV_BY_ROLE: Record<NavRole, NavSection[]> = {
  admin: adminNav,
  tutor: tutorNav,
  parent: parentNav,
  student: parentNav
};

export const HOME_BY_ROLE: Record<NavRole, string> = {
  admin: '/dashboard',
  tutor: '/tutor-dashboard',
  parent: '/parent-dashboard',
  student: '/parent-dashboard'
};
