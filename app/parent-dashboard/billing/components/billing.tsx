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
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BanknoteIcon, Download } from 'lucide-react';
import Image from 'next/image';
import { updateInvoiceStatus } from '@/action/invoice';
import ParentSecurityDeposits from '../../components/SecurityDeposits';

// Mock data for invoices

interface invoices {
  id: string;
  invoiceNumber: string;
  status: string;
  subtotal: number;
  sst: number;
  date: Date;
  total: number;
  student: { name: string; email: string };
}

interface arrayInvoices {
  invoices: invoices[];
  deposits: any;
}

const ParentBilling = ({ invoices, deposits }: arrayInvoices) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices =
    invoices.length > 0
      ? invoices.filter((invoice) => {
          // Ensure invoice.date is a Date object
          const invoiceDate = new Date(invoice.date);
          const dateString = invoiceDate.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format

          return (
            invoice.invoiceNumber
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            dateString.includes(searchTerm) // Compare search term with the date in YYYY-MM-DD format
          );
        })
      : [];

  // filter unpiad invoices
  const unpaidInvoices =
    invoices.length > 0
      ? invoices.filter((invoice) => invoice.status !== 'paid')
      : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* No unpaid  Invoices */}
        {unpaidInvoices.length === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>All invoices are Paid </CardTitle>
            </CardHeader>
            <CardContent>
              <p>You have no unpaid invoices at the moment.</p>
            </CardContent>
          </Card>
        )}

        {unpaidInvoices?.map((invoice) => (
          <Card key={invoice.id}>
            <CardHeader>
              <CardTitle>Last Month Invoice</CardTitle>
              <CardDescription>Invoice for the previous month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Invoice ID</p>
                  <p className="font-medium">
                    {invoice.invoiceNumber.slice(1, 16)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount Due</p>
                  <p className="font-medium">RM{invoice.total}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">
                    {invoice.date.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Student Name</p>
                  <p className="font-medium">{invoice.student.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Invoice Status
                  </p>
                  <Badge
                    variant={
                      invoice.status === 'paid' ? 'default' : 'destructive'
                    }
                  >
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {invoice.status !== 'paid' && (
                <Button
                  onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                  className="w-full"
                >
                  Mark as Paid
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Scan the QR code to pay or use the bank details below for
              transfer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0">
              <div className="flex items-start space-x-4">
                {/* Icon representing bank transfer */}
                <BanknoteIcon className="h-8 w-8 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-lg font-semibold">Bank Transfer</p>
                  <div className="text-muted-foreground">
                    <p className="text-md font-bold">
                      Account Title:{' '}
                      <span className="font-normal">UH INNOVATION LEGACY</span>
                    </p>
                    <p className="text-md font-bold">
                      Bank Name: <span className="font-normal">MAYBANK</span>
                    </p>
                    <p className="text-md font-bold">
                      Account No:{' '}
                      <span className="font-normal">562674258518</span>
                    </p>
                  </div>
                </div>
              </div>
              {/* QR code for payment */}
              <div className="mt-4 sm:mt-0">
                <Image
                  src="/QRcode.jpg"
                  alt="QR Code for payment"
                  width={150}
                  height={150}
                  className="rounded shadow-md"
                />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                To pay this invoice, please transfer the invoice amount to the
                above account number and share a screenshot of the transaction
                via WhatsApp for confirmation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="mt-8">
        <TabsList>
          <TabsTrigger value="recent">Recent Invoices</TabsTrigger>
          <TabsTrigger value="all">All Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>
                Your invoice history for the past 3 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.length > 0 ? (
                    invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.invoiceNumber}</TableCell>
                        <TableCell>
                          {invoice.date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>RM{invoice.total}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              invoice.status === 'paid'
                                ? 'default'
                                : 'destructive'
                            }
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {/* <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button> */}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No invoices found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Invoices</CardTitle>
              <CardDescription>Your complete invoice history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="search">Search Invoices</Label>
                <Input
                  id="search"
                  placeholder="Search by Invoice ID or Date"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>DueDate</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>
                        {invoice.date.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>RM{invoice.total}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            invoice.status === 'paid'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {/* <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button> */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mt-4">
        <Card>
          <CardContent>
            <ParentSecurityDeposits deposits={deposits} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentBilling;
