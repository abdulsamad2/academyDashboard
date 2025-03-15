'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  BanknoteIcon,
  Calendar,
  ChevronRight,
  Download,
  ExternalLink,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Payout {
  id: string;
  status: string;
  payoutAmount: number;
  updatedAt: string;
  payoutDate: string;
  penaltyPercentage: number;
  penaltyReason: string;
}

interface TutorPayoutProps {
  payouts: Payout[];
  tutordetails: any;
}

export default function TutorPayout({
  tutordetails,
  payouts
}: TutorPayoutProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayouts = payouts.filter(
    (payout) =>
      payout.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.updatedAt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.payoutDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payout.penaltyReason &&
        payout.penaltyReason.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pendingPayouts = payouts.filter(
    (payout) => payout.status === 'Pending'
  );

  // Calculate total earnings
  const totalEarnings = payouts
    .filter((payout) => payout.status === 'processed')
    .reduce((sum, payout) => sum + payout.payoutAmount, 0);

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payouts</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and track your earnings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 px-3 py-1"
          >
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            Next payout: {new Date().getDate() <= 8 ? '8th' : '8th next month'}
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">
                RM {totalEarnings.toFixed(2)}
              </span>
              <span className="mb-1 text-sm text-muted-foreground">
                lifetime
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">
                {pendingPayouts.length > 0
                  ? `RM ${pendingPayouts[0].payoutAmount.toFixed(2)}`
                  : 'RM 0.00'}
              </span>
              <span className="mb-1 text-sm text-muted-foreground">
                {pendingPayouts.length > 0 ? 'processing' : 'no pending'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2">
              <BanknoteIcon className="h-5 w-5 text-muted-foreground" />
              <span className="truncate font-medium">
                {tutordetails.tutor.bank} ••••{' '}
                {tutordetails.tutor.bankaccount.slice(-4)}
              </span>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link
              href="/tutor-dashboard/profile"
              className="flex items-center text-xs text-primary"
            >
              Update <ChevronRight className="ml-1 h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Pending Payout Details */}
      {pendingPayouts.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800/30 dark:bg-amber-950/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Pending Payout
              </CardTitle>
              <Badge
                variant="outline"
                className="border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800/30 dark:bg-amber-900/30 dark:text-amber-400"
              >
                Processing
              </Badge>
            </div>
            <CardDescription>
              Expected to be processed by {pendingPayouts[0].payoutDate}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Payout ID
                </p>
                <p className="mt-1 font-medium">{pendingPayouts[0].id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Amount
                </p>
                <p className="mt-1 text-xl font-medium">
                  RM {pendingPayouts[0].payoutAmount.toFixed(2)}
                </p>
              </div>
              {pendingPayouts[0].penaltyPercentage > 0 && (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Penalty
                    </p>
                    <p className="mt-1 font-medium text-red-500">
                      -{pendingPayouts[0].penaltyPercentage}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Reason
                    </p>
                    <p className="mt-1 font-medium">
                      {pendingPayouts[0].penaltyReason}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payout Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2.5">
                <BanknoteIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Bank Transfer</p>
                <p className="text-sm text-muted-foreground">
                  Processed on the 8th of each month
                </p>
              </div>
            </div>
            <div className="grid gap-1 text-sm sm:ml-auto">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Account Name:</span>
                <span className="font-medium">{tutordetails.name}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Bank:</span>
                <span className="font-medium">{tutordetails.tutor.bank}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Account No:</span>
                <span className="font-medium">
                  {tutordetails.tutor.bankaccount}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              Payouts are processed every 8th of the month. Please ensure your
              bank details are up to date to avoid payment delays.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Link href="/tutor-dashboard/profile" className="w-full sm:w-auto">
            <Button className="w-full" variant="outline">
              Update Bank Details
            </Button>
          </Link>
          <Button variant="ghost" className="w-full sm:w-auto">
            View Payout Policy
          </Button>
        </CardFooter>
      </Card>

      {/* Payout History */}
      <Tabs defaultValue="recent" className="mt-8">
        <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <TabsList>
            <TabsTrigger value="recent">Recent Payouts</TabsTrigger>
            <TabsTrigger value="all">All Payouts</TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by ID, date, status, or reason"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:w-[280px]"
            />
          </div>
        </div>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payouts</CardTitle>
              <CardDescription>
                Your payout history for the past 3 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Payout ID</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Date Processed</TableHead>
                      <TableHead>Toal Earning </TableHead>
                      <TableHead>Penalties</TableHead>
                      <TableHead>Final Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.slice(0, 5).length > 0 ? (
                      payouts.slice(0, 5).map((payout) => (
                        <TableRow key={payout.id} className="group">
                          <TableCell className="font-medium">
                            {payout.id}
                          </TableCell>
                          <TableCell>
                            {new Date(payout.payoutDate).toLocaleDateString(
                              'default',
                              {
                                month: 'short',
                                year: 'numeric'
                              }
                            )}
                          </TableCell>
                          <TableCell>{payout.updatedAt}</TableCell>
                          <TableCell>
                            {payout.penaltyPercentage > 0
                              ? `RM ${(
                                  payout.payoutAmount /
                                  (1 - payout.penaltyPercentage / 100)
                                ).toFixed(2)}`
                              : `RM ${payout.payoutAmount.toFixed(2)}`}
                          </TableCell>
                          <TableCell>
                            {payout.penaltyPercentage > 0 ? (
                              <div className="flex flex-col">
                                <span className="text-red-500">
                                  -{payout.penaltyPercentage}%
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  (RM{' '}
                                  {(
                                    ((payout.payoutAmount /
                                      (1 - payout.penaltyPercentage / 100)) *
                                      payout.penaltyPercentage) /
                                    100
                                  ).toFixed(2)}
                                  )
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">
                                None
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            RM {payout.payoutAmount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                payout.status === 'processed'
                                  ? 'default'
                                  : 'secondary'
                              }
                              className={cn(
                                payout.status === 'processed' &&
                                  'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400',
                                payout.status === 'Pending' &&
                                  'bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400'
                              )}
                            >
                              {payout.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {payout.status === 'processed' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 opacity-0 transition-opacity group-hover:opacity-100"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="sr-only">
                                      View Details
                                    </span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8"
                                  >
                                    <Download className="h-4 w-4" />
                                    <span className="sr-only">
                                      Download Receipt
                                    </span>
                                  </Button>
                                </>
                              )}
                              {payout.status === 'Pending' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  <span className="sr-only">View Details</span>
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="py-6 text-center text-muted-foreground"
                        >
                          No recent payouts found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Payouts</CardTitle>
              <CardDescription>Your complete payout history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Payout ID</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Date Processed</TableHead>
                      <TableHead>Base Amount</TableHead>
                      <TableHead>Penalties</TableHead>
                      <TableHead>Final Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayouts.length > 0 ? (
                      filteredPayouts.map((payout) => (
                        <TableRow key={payout.id} className="group">
                          <TableCell className="font-medium">
                            {payout.id}
                          </TableCell>
                          <TableCell>
                            {new Date(payout.payoutDate).toLocaleDateString(
                              'default',
                              {
                                month: 'short',
                                year: 'numeric'
                              }
                            )}
                          </TableCell>
                          <TableCell>{payout.updatedAt}</TableCell>
                          <TableCell>
                            {payout.penaltyPercentage > 0
                              ? `RM ${(
                                  payout.payoutAmount /
                                  (1 - payout.penaltyPercentage / 100)
                                ).toFixed(2)}`
                              : `RM ${payout.payoutAmount.toFixed(2)}`}
                          </TableCell>
                          <TableCell>
                            {payout.penaltyPercentage > 0 ? (
                              <div className="flex flex-col">
                                <span className="text-red-500">
                                  -{payout.penaltyPercentage}%
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  (RM{' '}
                                  {(
                                    ((payout.payoutAmount /
                                      (1 - payout.penaltyPercentage / 100)) *
                                      payout.penaltyPercentage) /
                                    100
                                  ).toFixed(2)}
                                  )
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">
                                None
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            RM {payout.payoutAmount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                payout.status === 'processed'
                                  ? 'default'
                                  : 'secondary'
                              }
                              className={cn(
                                payout.status === 'processed' &&
                                  'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400',
                                payout.status === 'Pending' &&
                                  'bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400'
                              )}
                            >
                              {payout.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {payout.status === 'processed' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 opacity-0 transition-opacity group-hover:opacity-100"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="sr-only">
                                      View Details
                                    </span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8"
                                  >
                                    <Download className="h-4 w-4" />
                                    <span className="sr-only">
                                      Download Receipt
                                    </span>
                                  </Button>
                                </>
                              )}
                              {payout.status === 'Pending' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  <span className="sr-only">View Details</span>
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="py-6 text-center text-muted-foreground"
                        >
                          No payouts found matching your search
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredPayouts.length > 10 && (
                <div className="flex items-center justify-center space-x-2 py-4">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-3 font-medium"
                  >
                    1
                  </Button>
                  <Button variant="ghost" size="sm" className="px-3">
                    2
                  </Button>
                  <Button variant="ghost" size="sm" className="px-3">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
