import Link from 'next/link';
import {
  UserPlus,
  GraduationCap,
  FilePlus,
  BookPlus,
  ArrowRight
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const actions = [
  {
    title: 'Add tutor',
    description: 'Onboard a new tutor profile',
    href: '/dashboard/tutor/new',
    icon: GraduationCap,
    accent: 'bg-primary/10 text-primary'
  },
  {
    title: 'Add parent',
    description: 'Register a parent account',
    href: '/dashboard/parent/new',
    icon: UserPlus,
    accent: 'bg-info-muted text-info'
  },
  {
    title: 'Create invoice',
    description: 'Generate billing for a parent',
    href: '/dashboard/generateinvoice',
    icon: FilePlus,
    accent: 'bg-success-muted text-success'
  },
  {
    title: 'Add subject',
    description: 'Add a teachable subject',
    href: '/dashboard/subject/new',
    icon: BookPlus,
    accent: 'bg-warning-muted text-warning'
  }
];

export function QuickActions() {
  return (
    <Card className="shadow-elevated-sm">
      <CardHeader>
        <CardTitle className="text-base">Quick actions</CardTitle>
        <CardDescription>Common tasks for admins</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {actions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated-sm"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${a.accent}`}
              >
                <a.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center justify-between text-sm font-medium text-foreground">
                  {a.title}
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {a.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
