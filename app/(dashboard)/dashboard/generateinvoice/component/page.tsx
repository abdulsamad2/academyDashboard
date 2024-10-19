'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Printer, Download } from 'lucide-react'
import { useParams } from 'next/navigation'
import { getTotalDurationForStudentThisMonth } from '@/action/addLesson'

export default function InvoicePage() {
  const params = useParams<{ tag: string; item: string }>()
const studentId = params.studentId;

  const [totalHours, setTotalHours] = useState<number | null>(null)
  const [remainderMinutes, setRemainderMinutes] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [InvoiceData, setInvoiceData] = useState<Array<any> | null>(null);


  const handleGenerate = async () => {
    setLoading(true)
    try {
        const data = await getTotalDurationForStudentThisMonth(studentId)
      setTotalHours(data.overallTotalHours)
      setRemainderMinutes(data.overallRemainderMinutes)
      setInvoiceData(data.totalDurationBySubject)
    } catch (error) {
      console.error('Error fetching total duration:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate subtotal, SST, and total
  const hourlyRate = 27 // Assuming RM100 per hour
  const subtotal = totalHours !== null ? totalHours * hourlyRate + (remainderMinutes ?? 0) / 60 * hourlyRate : 0
  const sst = subtotal * 0.06
  const total = subtotal + sst

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">INVOICE</CardTitle>
              <p className="text-sm text-muted-foreground">Invoice #: INV-{new Date().getFullYear()}-{studentId}</p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-semibold">UH INNOVATION LEGACY : LEARNING ACADEMY</h2>
              <p className="text-sm text-muted-foreground">12th Floor, Sri Ampang Mas, Jalan Dagang B/5,</p>
              <p className="text-sm text-muted-foreground">Taman Dagang, 68000 Ampang, Selangor</p>
              <p className="text-sm text-muted-foreground">Tel: +6016-4175134</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">Bill To:</h3>
              <p>PN. LILY</p>
              <p>Client ID: {studentId}</p>
              <p>Phone: 019-7609757</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold">Invoice Date:</h3>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Payment A/C No :</h3>
            <p>UH INNOVATION LEGACY - MAYBANK - Account No : 562674258518</p>
          </div>

          <Separator />

          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>METHOD</TableHead>
                    <TableHead className="text-right">Hourly Rate (RM)</TableHead>
                    <TableHead className="text-right">Hours</TableHead>
                    <TableHead className="text-right">Total Amount (RM)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {InvoiceData?.map((item, index) => {
                    const amount = (item.hourlyRate || 0) * (item.totalHours || 0); // Calculate total amount for the item
                    return (
                        <TableRow key={index}>
                            <TableCell>{item.subject}</TableCell>
                            <TableCell className="text-right">{item.hourlyRate?.toFixed(2) ?? '-'}</TableCell>
                            <TableCell className="text-right">{item.totalHours ?? '-'}</TableCell>
                            <TableCell className="text-right">{amount.toFixed(2)}</TableCell>
                        </TableRow>
                    );
                })}
                <TableRow>
                    <TableCell colSpan={3} className="text-right font-semibold">Subtotal</TableCell>
                    <TableCell className="text-right">{subtotal.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={3} className="text-right font-semibold">SST (6%)</TableCell>
                    <TableCell className="text-right">{sst.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={3} className="text-right font-semibold">Total</TableCell>
                    <TableCell className="text-right font-bold">{total.toFixed(2)}</TableCell>
                </TableRow>
            </TableBody>
        </Table>

          <div className="flex justify-between items-center">
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? 'Calculating...' : 'Generate Total Duration'}
            </Button>
            <div className="space-x-2">
              <Button variant="outline" size="icon">
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          <div className="text-sm text-muted-foreground">
            <p>Thank you for your business. Payment is due within 30 days.</p>
            <p>Please make payments to: UH INNOVATION LEGACY : LEARNING ACADEMY</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}