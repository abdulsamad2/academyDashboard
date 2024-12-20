'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Eye, Download, Search } from 'lucide-react';

// Mock data structure
interface SecurityDeposit {
  studentName: any;
  id: string;
  depositAmount: number;
  date: Date;
  status: 'paid' | 'pending' | 'refunded';
  student: {
    name: string;
  };
}

interface ParentSecurityDepositsProps {
  deposits: SecurityDeposit[];
}

export default function ParentSecurityDeposits({
  deposits: initialDeposits
}: ParentSecurityDepositsProps) {
  const [deposits, setDeposits] = useState<SecurityDeposit[]>(initialDeposits);

  const getStatusColor = (status: SecurityDeposit['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Security Deposits</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deposits.map((deposit) => (
          <Card key={deposit.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>Student : {deposit.student.name}</CardTitle>
              <CardDescription>ID: {deposit.id}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold">Amount:</span>
                <span>RM {deposit.depositAmount.toFixed(2)}</span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold">Date:</span>
                <span>{format(deposit.date, 'dd MMM yyyy')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Status:</span>
                <Badge className={getStatusColor(deposit.status)}>
                  {deposit.status.charAt(0).toUpperCase() +
                    deposit.status.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {deposits.length === 0 && (
        <p className="mt-4 text-center text-gray-500">
          No security deposits found.
        </p>
      )}
    </div>
  );
}
