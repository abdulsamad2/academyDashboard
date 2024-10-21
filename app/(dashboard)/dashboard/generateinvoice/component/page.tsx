'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Printer, Download } from 'lucide-react'
import { useParams } from 'next/navigation'
import { getLessonForStudent, getTotalDurationForStudentThisMonth } from '@/action/addLesson'
import { getUserById } from '@/action/userRegistration'
import { set } from 'lodash'

export default function InvoicePage() {
  const params = useParams;
  //@ts-ignore
const studentId = params.studentId;

  const [totalHours, setTotalHours] = useState<number | null>(null)
  const [remainderMinutes, setRemainderMinutes] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [InvoiceData, setInvoiceData] = useState<Array<any> | null>(null);
  const [parentId,setParentId] = useState('')
  const [parent, setParent] = useState<Record<string, any> | null>(null);

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

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const data = await getTotalDurationForStudentThisMonth(studentId);
      const parentData = await getUserById(parentId)
      setParent(parentData)
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
              <p>{parent?.name || parent?.email}</p>
              <p>Client ID: {parentId}</p>
              <p>Phone: {parent?.phone}</p>
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
                    <TableHead>Professional Tution Services</TableHead>
                    <TableHead className="text-right">Hourly Rate (RM)</TableHead>
                    <TableHead className="text-right">Hours</TableHead>
                    <TableHead className="text-right">Mintues</TableHead>

                    <TableHead className="text-right">Total Amount (RM)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {InvoiceData?.map((item, index) => {
                    const amount = (item.hourlyRate || 0) * (item.totalHours || 0); // Calculate total amount for the item
                    return (
                        <TableRow className='border-none' key={index}>
                            <TableCell>{item.subject}</TableCell>
                            <TableCell className="text-right">{hourlyRate?.toFixed(2) ?? '-'}</TableCell>
                            <TableCell className="text-right">{item.totalHours ?? '-'}</TableCell>
                            <TableCell className="text-right">{item.remainderMinutes ?? '-'}</TableCell>

                            <TableCell className="text-right">{hourlyRate * item.totalHours.toFixed(2)}</TableCell>
                        </TableRow>
                    );
                })}
                <TableRow>
                    <TableCell colSpan={4} className="text-right font-semibold">Subtotal</TableCell>
                    <TableCell className="text-right">{subtotal.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={4} className="text-right font-semibold">SST (6%)</TableCell>
                    <TableCell className="text-right">{sst.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={4} className="text-right font-semibold">Total</TableCell>
                    <TableCell className="text-right font-bold">{total.toFixed(2)}RM</TableCell>
                </TableRow>
            </TableBody>
        </Table>

         
          <Separator />

          <div className="text-sm text-muted-foreground">
            <p>Thank you for your business. Payment is due within 30 days.</p>
            <p>Please make payments to: UH INNOVATION LEGACY : LEARNING ACADEMY</p>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center items-center py-4">
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? 'Calculating...' : 'Generate Invoice'}
            </Button>
        
          </div>

    </div>
  )
}