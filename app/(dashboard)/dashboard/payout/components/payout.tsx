'use client';

import { useState } from 'react';
import PayoutTable from '@/components/tables/payout-table/payout-table';

interface Teacher {
  totalEarning: number;
  name: string;
  avatar: string;
  id: string;
  email: string;
  phoneNumber: string;
  address: string;
  bankName: string;
  accountNumber: string;
  payoutAmount: number;
  status: string;
  payoutDate: string;
  lastPayoutDate: string;
  taxId: string;
  updatedAt: Date;
  adminId: string;
  penaltyPercentage?: number;
  penaltyReason?: string;
}

interface TeacherPayouts {
  teacherPayouts: Teacher[];
}

export default function SimplifiedTeacherPayoutsPage({
  teacherPayouts
}: TeacherPayouts) {
  return (
    <div className="container mx-auto p-6">
      <PayoutTable teacherPayouts={teacherPayouts} />
    </div>
  );
}
