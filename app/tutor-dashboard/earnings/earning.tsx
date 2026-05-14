'use client';

import { Banknote, Clock, TrendingUp, Users } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { EarningsChart } from './components/earnings-chart';
import TutorPayout from './components/TutorPayout';

interface EarningsPoint {
  month: string;
  earnings: number;
}

interface TutorEarningsDashboardProps {
  lastMonthEarnings: number;
  totalPaid: number;
  pendingTotal: number;
  assignedStudents: number;
  monthlyEarnings: EarningsPoint[];
  payouts: any[];
  tutordetails: any;
}

export default function TutorEarningsDashboard({
  lastMonthEarnings,
  totalPaid,
  pendingTotal,
  assignedStudents,
  monthlyEarnings,
  payouts,
  tutordetails
}: TutorEarningsDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Last month"
          value={`RM ${lastMonthEarnings.toFixed(2)}`}
          icon={TrendingUp}
          helper="Earnings from last month's lessons"
        />
        <StatCard
          label="Total paid out"
          value={`RM ${totalPaid.toFixed(2)}`}
          icon={Banknote}
          helper="All payouts issued to you"
        />
        <StatCard
          label="Pending payout"
          value={`RM ${pendingTotal.toFixed(2)}`}
          icon={Clock}
          helper="Awaiting processing"
        />
        <StatCard
          label="Active students"
          value={assignedStudents}
          icon={Users}
          helper="Currently assigned to you"
        />
      </div>

      <EarningsChart data={monthlyEarnings} />

      <TutorPayout tutordetails={tutordetails} payouts={payouts} />
    </div>
  );
}
