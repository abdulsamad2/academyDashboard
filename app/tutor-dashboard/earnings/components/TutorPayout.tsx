'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, CreditCard } from "lucide-react"
import { BanknoteIcon } from "lucide-react"

interface Payout {
  id: string
  status: string
  payoutAmount: number
  updatedAt: string
  payoutDate:string
 
}

interface TutorPayoutProps {
  payouts: Payout[]
}

export default function TutorPayout ({ payouts }: TutorPayoutProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPayouts = payouts.filter(payout => 
    payout.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payout.updatedAt.includes(searchTerm)
  )

  const pendingPayouts = payouts.filter(payout => payout.status === 'Pending')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {pendingPayouts.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Pending Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You have no pending payouts at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          pendingPayouts.map((payout) => (
            <Card key={payout.id}>
              <CardHeader>
                <CardTitle>Pending Payout</CardTitle>
                <CardDescription>Payout for the current period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Payout ID</p>
                    <p className="font-medium">{payout.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">RM{payout.payoutAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Date</p>
                    <p className="font-medium">{payout.payoutDate}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    {/* <p className="text-sm text-muted-foreground">Total Lessons</p>
                    <p className="font-medium">{payout?.lessons}</p> */}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={payout.status === "processed" ? "default" : "secondary"}>
                      {payout.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        <Card>
          <CardHeader>
            <CardTitle>Payout Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <BanknoteIcon className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="font-medium">Bank Transfer</p>
                <p className="text-sm text-muted-foreground">Account Name: John Doe</p>
                <p className="text-sm text-muted-foreground">Bank: MAYBANK</p>
                <p className="text-sm text-muted-foreground">Account No: XXXX-XXXX-XXXX</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Payouts are processed every 1st and 15th of the month. Please ensure your bank details are up to date.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Update Bank Details</Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="mt-8">
        <TabsList>
          <TabsTrigger value="recent">Recent Payouts</TabsTrigger>
          <TabsTrigger value="all">All Payouts</TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payouts</CardTitle>
              <CardDescription>Your payout history for the past 3 months</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payout ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.slice(0, 5).map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>{payout.id}</TableCell>
                      <TableCell>{payout.updatedAt}</TableCell>
                      <TableCell>RM{payout. payoutAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={payout.status === "processed" ? "default" : "secondary"}>
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
              <div className="mb-4">
                <Label htmlFor="search">Search Payouts</Label>
                <Input
                  id="search"
                  placeholder="Search by Payout ID or Date"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payout ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>{payout.id}</TableCell>
                      <TableCell>{payout.payoutDate}</TableCell>
                      <TableCell>RM{payout.payoutAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={payout.status === "processed" ? "default" : "secondary"}>
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

