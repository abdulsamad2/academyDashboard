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
import React, { useState } from 'react';

const Billpayment = () => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const handlePayment = () => {
    console.log('Processing payment:', paymentAmount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tution Fee</CardTitle>
        <CardDescription>This Month tution Fee</CardDescription>
        <CardContent>
          <div className="pt-4 text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
          <p className="mt-3 text-muted-foreground">Due Date : 5 Sep 24</p>
        </CardContent>
      </CardHeader>
      <CardFooter>
        <div>
          <Button onClick={handlePayment}>Pay it Now</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Billpayment;
