'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Loader2, Send, FileText, Eye } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { saveSecurityDeposit } from '@/action/securityDeposit';

interface SecurityDepositInvoice {
  studentName: string;
  invoiceNumber: string;
  date: string;
  parentId: string;
  studentId: string;
  depositAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'unpaid';
  parentName: string;
  parentEmail: string;
  parentPhone: string;
}

interface InitialData {
  id: string;
  studentName: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
}

export default function SecurityDepositInvoicePage({
  initialData
}: {
  initialData: InitialData;
}) {
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [invoiceData, setInvoiceData] = useState<SecurityDepositInvoice | null>(
    null
  );
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDepositAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const amount = parseFloat(event.target.value);
    setDepositAmount(amount);
  };
  const prepareInvoiceData = (): SecurityDepositInvoice | null => {
    if (!initialData || depositAmount <= 0) return null;

    return {
      invoiceNumber: `SD-${format(
        new Date(),
        'yyyyMMdd'
      )}-${initialData.id.slice(-4)}`,
      date: format(new Date(), 'yyyy-MM-dd'),
      parentId: initialData.parentId,
      studentId: initialData.id,
      studentName: initialData.studentName,
      depositAmount,
      status: 'unpaid',
      parentName: initialData.parentName,
      parentEmail: initialData.parentEmail,
      parentPhone: initialData.parentPhone
    };
  };

  const handleGeneratePreview = async () => {
    setLoadingPreview(true);

    try {
      const invoice = prepareInvoiceData();
      if (invoice) {
        setInvoiceData(invoice);
        toast({
          title: 'Preview Generated',
          description: 'Security Deposit Invoice preview is ready.',
          variant: 'default'
        });
      } else {
        throw new Error('Invalid invoice data');
      }
    } catch (error) {
      console.error('Error generating preview:', error);
      toast({
        title: 'Error',
        description:
          'Failed to generate invoice preview. Please check the deposit amount.',
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

      await saveSecurityDeposit(invoice);

      toast({
        title: 'Invoice Sent',
        description:
          'The security deposit invoice has been saved and sent to the parent.'
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
      try {
        const canvas = await html2canvas(invoiceRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          imageTimeout: 0,
          removeContainer: true,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: 'a4',
          compress: true
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

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

        addImageToPDF(20);

        let heightLeft = imgHeight - (pageHeight - 40);
        let position = -(pageHeight - 40);

        while (heightLeft > 0) {
          pdf.addPage();
          addImageToPDF(position);
          heightLeft -= pageHeight - 40;
          position -= pageHeight - 40;
        }

        const filename = `SD-INV-${format(
          new Date(),
          'yyyyMMdd'
        )}-${initialData.id.slice(-4)}.pdf`;

        pdf.save(filename);
      } catch (error) {
        console.error('PDF generation error:', error);
        toast({
          title: 'Error',
          description: 'Failed to generate PDF. Please try again.',
          variant: 'destructive'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Control Panel */}
      <Card className="no-print mx-auto mb-8 max-w-5xl bg-white shadow-lg">
        <CardContent className="flex flex-col space-y-4 p-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-gray-700">
              Security Deposit Invoice Management
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="depositAmount">
                Security Deposit Amount (RM)
              </Label>
              <Input
                id="depositAmount"
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(parseFloat(e.target.value))}
                placeholder="Enter Deposit Amount"
                min={0}
                step={0.01}
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={handleGeneratePreview}
              disabled={loadingPreview || depositAmount <= 0}
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
      {invoiceData && (
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
                  <h1 className="text-2xl font-bold tracking-tight">
                    SECURITY DEPOSIT INVOICE
                  </h1>
                  <p className="mt-2 text-lg font-light opacity-90">
                    UH Innovation Legacy Learning Academy
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold">
                  {invoiceData.invoiceNumber}
                </p>
                <p className="mt-1 opacity-90">
                  Date: {format(new Date(invoiceData.date), 'MMMM dd, yyyy')}
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
                  <p className="font-medium">{invoiceData.parentName}</p>
                  <p className="text-sm">
                    Student Name: {invoiceData.studentName}
                  </p>
                  <p className="text-sm">{invoiceData.parentEmail}</p>
                  <p className="text-sm">{invoiceData.parentPhone}</p>
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
                      Description
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      Amount (RM)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">
                      Security Deposit
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-800">
                      {invoiceData.depositAmount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="mb-8 flex justify-end">
              <div className="w-1/2 rounded-lg bg-gray-50 p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">Total:</span>
                    <span className="text-gray-800">
                      RM {invoiceData.depositAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note Section */}
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-gray-600">
              <p className="leading-relaxed">
                This security deposit is required before your child can start
                classes at UH Innovation Legacy Learning Academy. The deposit is
                fully refundable upon completion of the program, subject to our
                terms and conditions. We appreciate your cooperation in ensuring
                a smooth start to your child&apos;s educational journey with us.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-8 py-6 print:py-4">
            <div className="text-center text-sm text-gray-600">
              <p className="font-medium">
                UH Innovation Legacy Learning Academy
              </p>
              <p className="mt-1">
                12th Floor, Sri Ampang Mas, Jalan Dagang B/5, Taman Dagang,
                68000 Ampang, Selangor
              </p>
              <p className="mt-1">
                Tel: +6016-4175134 | Email: info@uhilacademy.com
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
