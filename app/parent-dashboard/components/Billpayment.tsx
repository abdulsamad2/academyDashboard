'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import React from 'react';

const BillPayment = () => {
  return (
    <Card className="rounded-xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-3xl font-semibold text-foreground">
          Tuition Fee
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          This Month&apos;s Tuition Fee
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start">
        <div className="pt-6 text-4xl font-extrabold text-foreground">
          $45,231.89
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Due Date: 5 Sep 24</p>
      </CardContent>
      <CardFooter className="pt-6">
        <Button className="w-full rounded-lg bg-indigo-500 py-3 text-primary-foreground shadow-md hover:bg-indigo-600">
          Pay Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BillPayment;
