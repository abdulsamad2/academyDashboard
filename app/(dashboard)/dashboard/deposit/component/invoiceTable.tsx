'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Eye,
  FileText,
  Printer,
  Trash2,
  Send,
  Ban,
  Cog,
  Search
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { deleteInvoice, updateInvoiceStatus } from '@/action/invoice';
import { updateSecurityDepositStatus } from '@/action/securityDeposit';

interface Deposit {
  id: string;
  invoiceNumber: string;
  date: string;
  parentId: string;
  studentId: string;
  depositAmount: number;
  status: string;
  student: {
    name: string;
  };
  parent: {
    name: string | null;
    email: string;
  };
}

interface DepositsTableProps {
  data: Deposit[];
}

export default function InvoicesComponent({ data }: DepositsTableProps) {
  const [invoices, setInvoices] = useState<Deposit[]>(data);
  const [filteredInvoices, setFilteredInvoices] = useState<Deposit[]>(data);
  const [selectedInvoice, setSelectedInvoice] = useState<Deposit | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = invoices.filter(
      (invoice) =>
        invoice.student.name.toLowerCase().includes(lowercasedQuery) ||
        (invoice.parent.name &&
          invoice.parent.name.toLowerCase().includes(lowercasedQuery))
    );
    setFilteredInvoices(filtered);
  }, [searchQuery, invoices]);

  const handleViewInvoice = (invoice: Deposit) => {
    setSelectedInvoice(invoice);
  };

  const handleDeleteInvoice = async (id: string) => {
    const res = await deleteInvoice(id);
    setInvoices(invoices.filter((invoice) => invoice.id !== id));
    if (res.error) {
      toast({
        title: 'Error',
        description: res.error,
        variant: 'destructive'
      });
      return;
    }
    toast({
      title: 'Invoice deleted',
      description: 'The invoice has been successfully deleted.'
    });
  };

  const handleChangeStatus = async (
    id: string,
    newStatus: Deposit['status']
  ) => {
    try {
      // Call the function to update the status in the database
      await updateSecurityDepositStatus(id, newStatus);

      // Update the local state of invoices
      const updatedInvoices = invoices.map((invoice) =>
        invoice.id === id ? { ...invoice, status: newStatus } : invoice
      );
      setInvoices(updatedInvoices);

      // Show a success toast notification
      toast({
        title: 'Status updated',
        description: `The invoice status has been changed to ${newStatus}.`
      });
    } catch (error) {
      // Handle any errors that may occur during the update process
      console.error('Error updating invoice status:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while updating the invoice status.',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: Deposit['status']) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'sent':
        return 'default';
      case 'paid':
        return 'default';
      case 'unpaid':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto space-y-8 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Deposits</CardTitle>
          <CardDescription>
            Manage and view your tutor academy deposits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by student or parent name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Depsoit Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Amout</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>
                  <TableCell>{format(new Date(invoice.date), 'PPP')}</TableCell>
                  <TableCell>{invoice.student.name}</TableCell>
                  <TableCell>RM{invoice.depositAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Cog className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onSelect={() => handleViewInvoice(invoice)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            handleChangeStatus(invoice.id, 'sent')
                          }
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Mark as Sent
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            handleChangeStatus(invoice.id, 'paid')
                          }
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Mark as Paid
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            handleChangeStatus(invoice.id, 'unpaid')
                          }
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Mark as Unpaid
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the invoice and remove it
                                from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteInvoice(invoice.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Previous</Button>
          <Button variant="outline">Next</Button>
        </CardFooter>
      </Card>

      <Dialog
        open={!!selectedInvoice}
        onOpenChange={(open) => !open && setSelectedInvoice(null)}
      >
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Deposit Details</DialogTitle>
            <DialogDescription>
              Deposit number: {selectedInvoice?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <div>
                <p className="font-semibold">Date:</p>
                <p>
                  {selectedInvoice &&
                    format(new Date(selectedInvoice.date), 'PPP')}
                </p>
              </div>
              <div>
                <p className="font-semibold">Status:</p>
                <Badge
                  variant={
                    selectedInvoice?.status == 'unpaid'
                      ? 'destructive'
                      : 'default'
                  }
                >
                  {selectedInvoice?.status}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <div>
                <p className="font-semibold">Student:</p>
                <p>{selectedInvoice?.student.name}</p>
              </div>
              <div>
                <p className="font-semibold">Parent:</p>
                <p>{selectedInvoice?.parent.name}</p>
                <p className="text-sm text-gray-500">
                  {selectedInvoice?.parent.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <div>
                <p className="font-semibold">Subtotal:</p>
                <p>RM{selectedInvoice?.depositAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Change Status</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onSelect={() =>
                      selectedInvoice &&
                      handleChangeStatus(selectedInvoice.id, 'sent')
                    }
                  >
                    Mark as Sent
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      selectedInvoice &&
                      handleChangeStatus(selectedInvoice.id, 'paid')
                    }
                  >
                    Mark as Paid
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      selectedInvoice &&
                      handleChangeStatus(selectedInvoice.id, 'unpaid')
                    }
                  >
                    Mark as Unpaid
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
