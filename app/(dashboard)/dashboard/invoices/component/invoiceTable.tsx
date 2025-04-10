/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Eye, FileText, Trash2, Send, Ban, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { deleteInvoice, updateInvoiceStatus } from "@/action/invoice"
import { InvoiceTable } from "@/components/tables/invoice-tables/invoice-table"
import { Separator } from "@/components/ui/separator"

interface Invoice {
  id: string
  invoiceNumber: string
  date: string
  parentId: string
  studentId: string
  subtotal: number
  sst: number
  total: number
  status: string
  student: {
    name: string
    email: string
  }
  parent: {
    name: string | null
    email: string
  }
}

interface InvoicesComponentProps {
  data: Invoice[]
}

export default function InvoicesComponent({ data }: InvoicesComponentProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(data)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invoice.parent.name && invoice.parent.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleStatusChange = async (invoiceId: string, newStatus: string) => {
    try {
      await updateInvoiceStatus(invoiceId, newStatus)
      setInvoices(prevInvoices =>
        prevInvoices.map(invoice =>
          invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
        )
      )
      toast({
        title: "Status Updated",
        description: `Invoice status changed to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return
    
    setIsDeleteLoading(true)
    try {
      await deleteInvoice(invoiceToDelete)
      setInvoices(prevInvoices => 
        prevInvoices.filter(invoice => invoice.id !== invoiceToDelete)
      )
      toast({
        title: "Invoice Deleted",
        description: "The invoice has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      })
    } finally {
      setIsDeleteLoading(false)
      setIsDeleteDialogOpen(false)
      setInvoiceToDelete(null)
    }
  }

  const columns = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice #"
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }: any) => {
        return format(new Date(row.original.date), "PP")
      }
    },
    {
      accessorKey: "student.name",
      header: "Student"
    },
    {
      accessorKey: "parent.name",
      header: "Parent"
    },
    {
      accessorKey: "total",
      header: "Amount",
      cell: ({ row }: any) => {
        return `RM ${row.original.total.toFixed(2)}`
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.original.status
        return (
          <Badge 
            variant={
              status === "paid" 
                ? "default" 
                : status === "sent" 
                  ? "outline" 
                  : "destructive"
            } 
            className="rounded-full px-2.5 py-0.5 text-xs"
          >
            {status}
          </Badge>
        )
      }
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const invoice = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] rounded-md">
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => setSelectedInvoice(invoice)}
              >
                <Eye className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => handleStatusChange(invoice.id, "paid")}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>Mark as Paid</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => handleStatusChange(invoice.id, "sent")}
              >
                <Send className="mr-2 h-4 w-4" />
                <span>Mark as Sent</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => handleStatusChange(invoice.id, "unpaid")}
              >
                <Ban className="mr-2 h-4 w-4" />
                <span>Mark as Unpaid</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-destructive"
                onClick={() => {
                  setInvoiceToDelete(invoice.id)
                  setIsDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]

  return (
    <div className="w-full">
      <InvoiceTable
        columns={columns}
        data={filteredInvoices}
        searchKey="student.name"
        pageNo={1}
        totalUsers={filteredInvoices.length}
        pageCount={Math.ceil(filteredInvoices.length / 10)}
      />

      {/* View Invoice Details Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="sm:max-w-[625px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>
              Invoice number: {selectedInvoice?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-auto py-4">
            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Date:</h3>
                  <p>{selectedInvoice && format(new Date(selectedInvoice.date), 'PPP')}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Status:</h3>
                  <Badge 
                    variant={
                      selectedInvoice?.status === "paid" 
                        ? "default" 
                        : selectedInvoice?.status === "sent" 
                          ? "outline" 
                          : "destructive"
                    }
                    className="rounded-full px-2.5 py-0.5 text-xs"
                  >
                    {selectedInvoice?.status}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Student:</h3>
                  <p>{selectedInvoice?.student.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedInvoice?.student.email}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Parent:</h3>
                  <p>{selectedInvoice?.parent.name || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">{selectedInvoice?.parent.email}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Financial Details:</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-sm">Subtotal:</p>
                  <p className="text-sm text-right">RM {selectedInvoice?.subtotal.toFixed(2)}</p>
                  
                  <p className="text-sm">SST (6%):</p>
                  <p className="text-sm text-right">RM {selectedInvoice?.sst.toFixed(2)}</p>
                  
                  <p className="text-sm font-medium">Total:</p>
                  <p className="text-sm font-medium text-right">RM {selectedInvoice?.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={() => setSelectedInvoice(null)}>Close</Button>
            <Button>Print Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the invoice
              and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteInvoice}
              disabled={isDeleteLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}