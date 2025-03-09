'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  getLessonForStudent,
  getTotalDurationByMonth
} from '@/action/addLesson';
import { getUserById } from '@/action/userRegistration';
import {
  Download,
  Loader2,
  Send,
  FileText,
  Eye,
  CalendarIcon
} from 'lucide-react';
import { saveInvoice } from '@/action/saveInvoice';
import { toast } from '@/components/ui/use-toast';
import { format, getMonth, getYear } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useSearchParams } from 'next/navigation';
import MonthYearPicker from '@/components/monthYearPicker';

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
  status: 'unpaid' | 'sent' | 'paid';
  parent: {
    name: string;
    email: string;
    phone: string;
  };
  month: number;
  year: number;
}

export default function ModernInvoicePage({
  studentId,
  initialMonth,
  initialYear
}: {
  studentId: string;
  initialMonth?: number;
  initialYear?: number;
}) {
  const searchParams = useSearchParams();

  const monthParam = searchParams.get('month');
  const yearParam = searchParams.get('year');

  const [month, setMonth] = useState<number>(
    monthParam
      ? parseInt(monthParam)
      : initialMonth !== undefined
      ? initialMonth
      : getMonth(new Date())
  );

  const [year, setYear] = useState<number>(
    yearParam
      ? parseInt(yearParam)
      : initialYear !== undefined
      ? initialYear
      : getYear(new Date())
  );

  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceItem[] | null>(null);
  const [parentId, setParentId] = useState('');
  const [parent, setParent] = useState<Record<string, any> | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (monthParam && !isNaN(parseInt(monthParam))) {
      setMonth(parseInt(monthParam));
    }

    if (yearParam && !isNaN(parseInt(yearParam))) {
      setYear(parseInt(yearParam));
    }
  }, [monthParam, yearParam]);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const studentData = await getLessonForStudent(studentId, month, year);
        if (studentData && studentData.length > 0) {
          setParentId(studentData[0].student.parentId);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [studentId, month, year]);

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
      totalAmount: parseFloat(
        ((item.totalDuration / 60) * parseFloat(item.tutorhourly)).toFixed(2)
      )
    }));

    // Create a date object for the selected month/year for the invoice date
    const invoiceDate = new Date(year, month, 1);

    return {
      invoiceNumber: `INV-${format(invoiceDate, 'yyyyMM')}-${studentId.slice(
        -4
      )}`,
      date: format(new Date(), 'yyyy-MM-dd'),
      parentId,
      studentId,
      items: formattedItems,
      subtotal,
      sst,
      total,
      status: 'unpaid',
      parent: {
        name: parent.name || 'N/A',
        email: parent.email || '',
        phone: parent.phone || ''
      },
      month,
      year
    };
  };

  const handleGeneratePreview = async () => {
    setLoadingPreview(true);
    try {
      // Use the updated function with month and year parameters
const data = await getTotalDurationByMonth(studentId, month, year);
      const parentData = await getUserById(parentId);
      setParent(parentData);
      //@ts-ignore
      setInvoiceData(data);
      toast({
        title: 'Preview Generated',
        description: `Invoice preview for ${format(
          new Date(year, month, 1),
          'MMMM yyyy'
        )} is ready.`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Error fetching total duration:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate invoice preview. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoadingPreview(false);
    }
  };

const handleSaveAndSend = async () => {
  setLoadingSend(true);
  try {
    const invoice = prepareInvoiceData();
    if (!invoice) throw new Error('Invoice data not ready');

    // Make sure the invoice object includes month and year
    const invoiceWithDate = {
      ...invoice,
      month: month, // Current month state from your component
      year: year // Current year state from your component
    };

    //@ts-ignore
    await saveInvoice(invoiceWithDate);

    toast({
      title: 'Invoice Sent',
      description: `The invoice for ${format(
        new Date(year, month, 1),
        'MMMM yyyy'
      )} has been saved and sent to the parent.`
    });
  } catch (error) {
    toast({
      title: 'Error',
      description: 'An error occurred while saving and sending the invoice.',
      variant: 'destructive'
    });
    console.error('Error saving invoice:', error);
  } finally {
    setLoadingSend(false);
  }
};

  const handleDownloadPDF = async () => {
    if (invoiceRef.current) {
      // Generate a canvas with optimized settings
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 1.5, // Slightly higher scale for better text clarity
        useCORS: true,
        logging: false, // Disable logging for better performance
        imageTimeout: 0,
        removeContainer: true,
        // Optimize background handling
        backgroundColor: null
      });

      // Optimize canvas quality and compression
      const imgData = canvas.toDataURL('image/jpeg', 0.75); // Use JPEG with 75% quality for better compression

      // Create PDF with optimized settings
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a5',
        compress: true // Enable PDF compression
      });

      // Calculate dimensions while maintaining aspect ratio
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 40; // Add 20pt padding on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Function to add image with compression options
      const addImageToPDF = (y: number) => {
        pdf.addImage(
          imgData,
          'JPEG',
          20,
          y,
          imgWidth,
          imgHeight,
          undefined,
          'FAST',
          0
        );
      };

      // Add first page
      addImageToPDF(20); // Add 20pt top padding

      // Handle multiple pages if needed
      let heightLeft = imgHeight - (pageHeight - 40); // Account for padding
      let position = -(pageHeight - 40); // Start position for next pages

      while (heightLeft > 0) {
        pdf.addPage();
        addImageToPDF(position);
        heightLeft -= pageHeight - 40;
        position -= pageHeight - 40;
      }

      // Generate filename with month and year
      const invoiceDate = new Date(year, month, 1);
      const filename = `INV-${format(invoiceDate, 'yyyyMM')}-${studentId.slice(
        -4
      )}.pdf`;

      // Save with optimized settings
      pdf.save(filename, {
        //@ts-ignore
        compress: true
      });
    }
  };

  // Get the month name for display
  const monthName = format(new Date(year, month, 1), 'MMMM yyyy');

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Month/Year Picker */}
      <div className="no-print mx-auto mb-6 max-w-5xl">
        <MonthYearPicker
          studentId={studentId}
          initialMonth={month}
          initialYear={year}
        />
      </div>

      {/* Control Panel */}
      <Card className="no-print mx-auto mb-8 max-w-5xl bg-white shadow-lg">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-700">
              Invoice Management - {monthName}
            </span>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={handleGeneratePreview}
              disabled={loadingPreview}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800"
            >
              {loadingPreview ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Eye className="mr-2 h-4 w-4" />
              )}
              {loadingPreview ? 'Generating...' : 'Generate Preview'}
            </Button>
            <Button
              onClick={handleSaveAndSend}
              disabled={loadingSend || !invoiceData}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md transition-all duration-200 hover:from-green-700 hover:to-green-800"
            >
              {loadingSend ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {loadingSend ? 'Sending...' : 'Save & Send'}
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={!invoiceData}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md transition-all duration-200 hover:from-indigo-700 hover:to-indigo-800"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Template */}
      <div
        ref={invoiceRef}
        className="mx-auto max-w-5xl overflow-hidden rounded-lg bg-white shadow-xl print:shadow-none"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white print:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/logo.jpg"
                alt="UHIL Logo"
                width={150}
                height={100}
                className="mr-4 rounded-md"
              />
              <div>
                <h1 className="text-4xl font-bold tracking-tight">INVOICE</h1>
                <p className="mt-2 text-lg font-light opacity-90">
                  UH Innovation Legacy Learning Academy
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold">
                {`INV-${format(
                  new Date(year, month, 1),
                  'yyyyMM'
                )}-${studentId.slice(-4)}`}
              </p>
              <p className="mt-1 opacity-90">
                Date: {format(new Date(), 'MMMM dd, yyyy')}
              </p>
              <p className="mt-1 opacity-90">
                <CalendarIcon className="mr-1 inline-block h-4 w-4" />
                For period: {monthName}
              </p>
            </div>
          </div>
        </div>

        {/* Bill To & Pay To Section */}
        <div className="p-8 print:p-6">
          <div className="mb-8 flex justify-between">
            <div className="w-5/12 rounded-lg bg-gray-50 p-4">
              <h2 className="mb-2 text-xl font-semibold text-gray-800">
                Bill To:
              </h2>
              <div className="space-y-1 text-gray-600">
                <p className="font-medium">{parent?.name || 'N/A'}</p>
                <p className="text-sm">Client ID: {parentId}</p>
                <p className="text-sm">{parent?.email || 'N/A'}</p>
                <p className="text-sm">{parent?.phone || 'N/A'}</p>
              </div>
            </div>
            <div className="w-5/12 rounded-lg bg-gray-50 p-4">
              <h2 className="mb-2 text-xl font-semibold text-gray-800">
                Pay To:
              </h2>
              <div className="space-y-1 text-gray-600">
                <p className="font-medium">UH Innovation Legacy</p>
                <p className="text-sm">MAYBANK</p>
                <p className="text-sm">Acc: 562674258518</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                    Rate (RM/hr)
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                    Hours
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                    Amount (RM)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoiceData?.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {item.subject}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-800">
                      {item.tutorhourly}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-800">
                      {(item.totalDuration / 60).toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-800">
                      {(
                        (item.totalDuration / 60) *
                        parseFloat(item.tutorhourly)
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {!invoiceData || invoiceData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No data available for {monthName}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="mb-8 flex justify-end">
            <div className="w-1/2 rounded-lg bg-gray-50 p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-600">Subtotal:</span>
                  <span className="text-gray-800">
                    RM{' '}
                    {invoiceData
                      ? calculateFinancials(invoiceData).subtotal.toFixed(2)
                      : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-600">SST (6%):</span>
                  <span className="text-gray-800">
                    RM{' '}
                    {invoiceData
                      ? calculateFinancials(invoiceData).sst.toFixed(2)
                      : '0.00'}
                  </span>
                </div>
                <div className="mt-2 border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-800">Total:</span>
                    <span className="text-blue-600">
                      RM{' '}
                      {invoiceData
                        ? calculateFinancials(invoiceData).total.toFixed(2)
                        : '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Note Section */}
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-gray-600">
            <p className="leading-relaxed">
              Thank you for choosing UH Innovation Legacy Learning Academy. We
              appreciate your prompt payment by the 4th of each month, which
              enables us to maintain our high standards of education. Your
              partnership in your child&apos;s academic journey is invaluable to
              us.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-8 py-6 print:py-4">
          <div className="text-center text-sm text-gray-600">
            <p className="font-medium">UH Innovation Legacy Learning Academy</p>
            <p className="mt-1">
              12th Floor, Sri Ampang Mas, Jalan Dagang B/5, Taman Dagang, 68000
              Ampang, Selangor
            </p>
            <p className="mt-1">
              Tel: +6016-4175134 | Email: info@uhilacademy.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
