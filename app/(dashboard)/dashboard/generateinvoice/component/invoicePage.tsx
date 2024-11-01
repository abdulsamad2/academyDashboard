'use client'

import React, { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLessonForStudent, getTotalDurationForStudentThisMonth } from '@/action/addLesson';
import { getUserById } from '@/action/userRegistration';
import { Download, Loader2, Send, FileText } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { saveInvoice } from '@/action/saveInvoice';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface InvoiceItem {
  subject: string;
  tutorId: string;
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

export default function ModernInvoicePage({ studentId }: { studentId: string }) {
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceItem[] | null>(null);
  const [parentId, setParentId] = useState('');
  const [parent, setParent] = useState<Record<string, any> | null>(null);
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

  const calculateFinancials = (data: InvoiceItem[]) => {
    const subtotal = data.reduce((acc, item) => {
      const totalHours = parseFloat((item.totalDuration / 60).toFixed(1));
      const totalAmount = totalHours * parseFloat(item.tutorhourly);
      return acc + totalAmount;
    }, 0);
    
    const sst = parseFloat((subtotal * 0.06).toFixed(2));
    const total = parseFloat((subtotal + sst).toFixed(2));

    return { subtotal, sst, total };
  };

  const prepareInvoiceData = (): Invoice | null => {
    if (!invoiceData || !parent) return null;
    const { subtotal, sst, total } = calculateFinancials(invoiceData);
    const formattedItems = invoiceData.map((item) => ({
      ...item,
      totalHours: parseFloat((item.totalDuration / 60).toFixed(1)),
      totalAmount: parseFloat((item.totalDuration / 60 * parseFloat(item.tutorhourly)).toFixed(2))
    }));

    return {
      invoiceNumber: `INV-${format(new Date(), 'yyyyMMdd')}-${studentId.slice(-4)}`,
      date: format(new Date(), 'yyyy-MM-dd'),
      parentId,
      studentId,
      items: formattedItems,
      subtotal,
      sst,
      total,
      status: 'draft',
      parent: {
        name: parent.name || 'N/A',
        email: parent.email || '',
        phone: parent.phone || ''
      },
    };
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await getTotalDurationForStudentThisMonth(studentId);
      const parentData = await getUserById(parentId);
      setParent(parentData);
      //@ts-ignore
      setInvoiceData(data);
    } catch (error) {
      console.error('Error fetching total duration:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate invoice. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndSend = async () => {
    setLoading(true);
    try {
      const invoice = prepareInvoiceData();
      if (!invoice) throw new Error('Invoice data not ready');
      //@ts-ignore

      await saveInvoice(invoice);      
      toast({
        title: 'Invoice Sent',
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

  const handlePrint = async () => {
    return {}
  }
  

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Control Panel */}
      <Card className="max-w-5xl mx-auto mb-8 bg-white shadow-lg no-print">
        <CardContent className="flex justify-between items-center p-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-700">Invoice Management</span>
          </div>
          <div className="flex space-x-4">
            <Button 
              onClick={handleGenerate} 
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md transition-all duration-200"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Generate Invoice
            </Button>
            <Button 
              onClick={handleSaveAndSend} 
              disabled={loading || !invoiceData}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md transition-all duration-200"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Save & Send
            </Button>
            <Button 
              onClick={handlePrint}
              disabled={!invoiceData}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md transition-all duration-200"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Template */}
      <div ref={invoiceRef} className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden print:shadow-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 print:p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">INVOICE</h1>
              <p className="text-lg mt-2 opacity-90 font-light">UH Innovation Legacy Learning Academy</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold">{`INV-${format(new Date(), 'yyyyMMdd')}-${studentId.slice(-4)}`}</p>
              <p className="mt-1 opacity-90">Date: {format(new Date(), 'MMMM dd, yyyy')}</p>
            </div>
          </div>
        </div>
        
        {/* Bill To & Pay To Section */}
        <div className="p-8 print:p-6">
          <div className="flex justify-between mb-8">
            <div className="bg-gray-50 p-4 rounded-lg w-5/12">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">Bill To:</h2>
              <div className="space-y-1 text-gray-600">
                <p className="font-medium">{parent?.name || 'N/A'}</p>
                <p className="text-sm">Client ID: {parentId}</p>
                <p className="text-sm">{parent?.email || 'N/A'}</p>
                <p className="text-sm">{parent?.phone || 'N/A'}</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg w-5/12">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">Pay To:</h2>
              <div className="space-y-1 text-gray-600">
                <p className="font-medium">UH Innovation Legacy</p>
                <p className="text-sm">MAYBANK</p>
                <p className="text-sm">Acc: 562674258518</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-hidden rounded-lg border border-gray-200 mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Subject</th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-900">Rate (RM/hr)</th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-900">Hours</th>
                  <th className="py-3 px-4 text-right text-sm font-semibold text-gray-900">Amount (RM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoiceData?.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-800">{item.subject}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 text-right">{item.tutorhourly}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 text-right">
                      {(item.totalDuration / 60).toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800 text-right">
                      {(item.totalDuration / 60 * parseFloat(item.tutorhourly)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mb-8">
            <div className="w-1/2 bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-600">Subtotal:</span>
                  <span className="text-gray-800">RM {invoiceData ? calculateFinancials(invoiceData).subtotal.toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-600">SST (6%):</span>
                  <span className="text-gray-800">RM {invoiceData ? calculateFinancials(invoiceData).sst.toFixed(2) : '0.00'}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-800">Total:</span>
                    <span className="text-blue-600">RM {invoiceData ? calculateFinancials(invoiceData).total.toFixed(2) : '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Note Section */}
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-600 border border-blue-100">
            <p className="leading-relaxed">
              Thank you for choosing UH Innovation Legacy Learning Academy. We appreciate your prompt payment by the 4th of each month, 
              which enables us to maintain our high standards of education. Your partnership in your child&apos;s academic journey is invaluable to us.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 print:py-4 border-t">
          <div className="text-center text-sm text-gray-600">
            <p className="font-medium">UH Innovation Legacy Learning Academy</p>
            <p className="mt-1">12th Floor, Sri Ampang Mas, Jalan Dagang B/5, Taman Dagang, 68000 Ampang, Selangor</p>
            <p className="mt-1">Tel: +6016-4175134 | Email: info@uhinnovation.edu</p>
          </div>
        </div>
      </div>
    </div>
  );
}