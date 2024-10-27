'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getLessonForStudent, getTotalDurationForStudentThisMonth } from '@/action/addLesson'
import { getUserById } from '@/action/userRegistration'
import { Download } from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { saveInvoice } from '@/action/saveInvoice'
import { toast } from '@/components/ui/use-toast'

// Define TypeScript interfaces for better type safety
interface InvoiceItem {
  subject: string;
  tutorId:string;
  totalDuration: number;
  tutorhourly: string;
  totalAmount: number;
  totalHours: number;
}

interface Invoice {
  invoiceNumber: string;
  date: string;
  parentId: string;
  studentId: string;
  items: InvoiceItem[];
  subtotal: number;
  sst: number;
  total: number;
  status: 'draft' | 'sent' | 'paid';
  parent: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function InvoicePage({studentId}:any) {
  const [loading, setLoading] = useState(false)
  const [InvoiceData, setInvoiceData] = useState<Record<string, any> | null>(null);
  const [parentId, setParentId] = useState('')
  const [parent, setParent] = useState<Record<string, any> | null>(null);
  console.log('invoice Data',InvoiceData)
  const invoiceRef = useRef(null);
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentData = await getLessonForStudent(studentId);
        if (studentData && studentData.length > 0) {
          setParentId(studentData[0].student.parentId);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [studentId]);

  // Calculate subtotal, SST, and total
  const calculateFinancials = (data: any[]) => {
    const subtotal = data.reduce((acc, item) => {
      const hours = Math.floor(item.totalDuration / 60);
      const remainderMinutes = item.totalDuration % 60;
      const totalHours = parseFloat((hours + remainderMinutes / 60).toFixed(1));
      const totalAmount = totalHours * parseFloat(item.tutorhourly);
      return acc + totalAmount;
    }, 0);
    
    const sst = parseFloat((subtotal * 0.06).toFixed(2));
    const total = parseFloat((subtotal + sst).toFixed(2));

    return { subtotal, sst, total };
  };

  // Prepare invoice data for saving
  const prepareInvoiceData = () => {
    if (!InvoiceData || !parent) return null;
    //@ts-ignore
    const { subtotal, sst, total } = calculateFinancials(InvoiceData);
    const formattedItems = InvoiceData.map((item: any) => {
      const tutorId = item.tutorId;
      const tutorhourly=item.tutorhourly;
      const hours = Math.floor(item.totalDuration / 60);
      const remainderMinutes = item.totalDuration % 60;
      const totalHours = parseFloat((hours + remainderMinutes / 60).toFixed(1));
      const totalAmount = parseFloat((totalHours * parseFloat(item.tutorhourly)).toFixed(2));
      return {
        lessonId:item.lessonId,
        tutorId:tutorId,
        subject: item.subject,
        totalDuration: item.totalDuration,
        tutorhourly:tutorhourly,
        totalHours,
        totalAmount
      };
    });

    const invoice: Invoice = {
      invoiceNumber: `INV-${new Date().getFullYear()}-${studentId}`,
      date: new Date().toLocaleDateString(),
      parentId,
      studentId,
      items: formattedItems,
      subtotal,
      sst,
      total,
      status: 'draft',
      parent: {
        name: parent.name || 'NA',
        email: parent.email || '',
        phone: parent.phone || ''
      },
    };

    return invoice;
  };

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const data = await getTotalDurationForStudentThisMonth(studentId);
      const parentData = await getUserById(parentId)
      setParent(parentData)
      setInvoiceData(data)
    } catch (error) {
      console.error('Error fetching total duration:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle saving invoice to database
  const handleSaveAndSend = async () => {
    setLoading(true);
    try {
      const invoice = prepareInvoiceData();
      if (!invoice) throw new Error('Invoice data not ready');

      // Save invoice to database
      //@ts-ignore
     const rest = await saveInvoice(invoice)      
      // TODO: Implement email sending logic here
      toast({
        title: 'Invoice Saved',
        description: 'The invoice has been saved and sent to the parent.',
      });
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while saving the invoice.',
        variant: 'destructive',
      });
      console.error('Error saving invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF generation
  const handlePrint = useReactToPrint({
    //@ts-ignore
    content: () => invoiceRef.current,
    documentTitle: `Invoice-${studentId}-${new Date().toLocaleDateString()}`,
  });

  // Calculate totals for display
  const subtotal = InvoiceData?.reduce((acc:any, item:any) => {
    const hours = Math.floor(item.totalDuration / 60);
    const remainderMinutes = item.totalDuration % 60;
    const totalHours = (hours + remainderMinutes / 60).toFixed(1);
    const totalAmount = parseFloat(totalHours) * parseFloat(item.tutorhourly);
    return acc + totalAmount;
  }, 0);
  
  const sst = subtotal ? (subtotal * 0.06).toFixed(2) : '0.00';
  const total = subtotal ? (subtotal + parseFloat(sst)).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div ref={invoiceRef}>
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="bg-primary text-primary-foreground p-6 rounded-t-xl">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold">INVOICE</CardTitle>
                <p className="text-sm opacity-80">Invoice #: INV-{new Date().getFullYear()}-{studentId}</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-semibold">UH INNOVATION LEGACY : LEARNING ACADEMY</h2>
                <p className="text-sm opacity-80">12th Floor, Sri Ampang Mas, Jalan Dagang B/5,</p>
                <p className="text-sm opacity-80">Taman Dagang, 68000 Ampang, Selangor</p>
                <p className="text-sm opacity-80">Tel: +6016-4175134</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg mb-2">Bill To:</h3>
                <p className="text-gray-700">{parent?.name || parent?.email}</p>
                <p className="text-gray-700">Client ID: {parentId}</p>
                <p className="text-gray-700">Phone: {parent?.phone}</p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-lg mb-2">Invoice Date:</h3>
                <p className="text-gray-700">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Payment A/C No :</h3>
              <p className="text-gray-700">UH INNOVATION LEGACY - MAYBANK - Account No : 562674258518</p>
            </div>

            <Separator className="my-6" />

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3 font-semibold text-sm uppercase">Professional Tuition Services</th>
                    <th className="p-3 font-semibold text-sm uppercase text-right">Hourly Rate (RM)</th>
                    <th className="p-3 font-semibold text-sm uppercase text-right">Hours</th>
                    <th className="p-3 font-semibold text-sm uppercase text-right">Total Amount (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  {InvoiceData?.map((item:any, index:number) => {
                    const hours = Math.floor(item.totalDuration / 60);
                    const remainderMinutes = item.totalDuration % 60;
                    const totalHours = (hours + remainderMinutes / 60).toFixed(1);
                    const totalAmount = (parseFloat(totalHours) * parseFloat(item.tutorhourly)).toFixed(2);

                    return (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="p-3">{item.subject}</td>
                        <td className="p-3 text-right">{item.tutorhourly ?? '-'}</td>
                        <td className="p-3 text-right">{totalHours ?? '-'}</td>
                        <td className="p-3 text-right">{totalAmount ?? '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td colSpan={3} className="p-3 text-right font-semibold">Subtotal</td>
                    <td className="p-3 text-right">{subtotal?.toFixed(2) ?? '-'}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="p-3 text-right font-semibold">SST (6%)</td>
                    <td className="p-3 text-right">{sst ?? '-'}</td>
                  </tr>
                  <tr className="bg-primary text-primary-foreground">
                    <td colSpan={3} className="p-3 text-right font-semibold text-lg">Total</td>
                    <td className="p-3 text-right font-bold text-lg">RM {total ?? "-"}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
           
            <Separator className="my-6" />

            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <p>Thank you for entrusting us with your child&apos;s education. Please note that payment is kindly requested by the 4th of the month. Your timely support allows us to continue providing quality education. We truly appreciate your partnership.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-center items-center py-8 space-x-4">
        <Button 
          onClick={handleGenerate} 
          disabled={loading} 
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Calculating...' : 'Preview Invoice'}
        </Button>
        <Button 
          onClick={handleSaveAndSend} 
          disabled={loading} 
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Processing...' : 'Save & Send'}
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </Button>
      </div>
    </div>
  );
}

export const revalidate = 0;