import Link from "next/link"
import { Calendar, Download, FileText, Filter, Plus, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FinancesPage() {
  // Mock data for advances
  const advances = [
    {
      id: "ADV001",
      supplier: "Kamal Perera",
      supplierId: "SUP001",
      amount: 10000,
      date: "2023-04-25",
      status: "Paid",
    },
    {
      id: "ADV002",
      supplier: "Nimal Silva",
      supplierId: "SUP002",
      amount: 15000,
      date: "2023-04-25",
      status: "Paid",
    },
    {
      id: "ADV003",
      supplier: "Sunil Fernando",
      supplierId: "SUP003",
      amount: 8000,
      date: "2023-04-25",
      status: "Pending",
    },
    {
      id: "ADV004",
      supplier: "Amal Jayawardena",
      supplierId: "SUP004",
      amount: 12000,
      date: "2023-04-25",
      status: "Paid",
    },
    {
      id: "ADV005",
      supplier: "Saman Kumara",
      supplierId: "SUP005",
      amount: 7500,
      date: "2023-04-25",
      status: "Pending",
    },
  ]

  // Mock data for loans
  const loans = [
    {
      id: "LN001",
      supplier: "Kamal Perera",
      supplierId: "SUP001",
      amount: 50000,
      requestDate: "2023-03-10",
      installment: 5000,
      remaining: 35000,
      status: "Active",
    },
    {
      id: "LN002",
      supplier: "Nimal Silva",
      supplierId: "SUP002",
      amount: 75000,
      requestDate: "2023-02-15",
      installment: 7500,
      remaining: 45000,
      status: "Active",
    },
    {
      id: "LN003",
      supplier: "Sunil Fernando",
      supplierId: "SUP003",
      amount: 30000,
      requestDate: "2023-04-05",
      installment: 3000,
      remaining: 30000,
      status: "Pending Approval",
    },
    {
      id: "LN004",
      supplier: "Amal Jayawardena",
      supplierId: "SUP004",
      amount: 100000,
      requestDate: "2022-12-20",
      installment: 10000,
      remaining: 20000,
      status: "Active",
    },
    {
      id: "LN005",
      supplier: "Saman Kumara",
      supplierId: "SUP005",
      amount: 25000,
      requestDate: "2023-01-15",
      installment: 2500,
      remaining: 0,
      status: "Completed",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-green-800">Finances</h2>
          <p className="text-gray-500">Manage advances, loans, and payments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            April 2023
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Advances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. 52,500</div>
            <p className="text-xs text-gray-500">For April 2023</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. 130,000</div>
            <p className="text-xs text-gray-500">Outstanding balance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. 1.2M</div>
            <p className="text-xs text-gray-500">Supplier payments this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500">Loan requests awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Management</CardTitle>
          <CardDescription>Manage supplier advances, loans, and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="advances">
            <TabsList className="mb-4">
              <TabsTrigger value="advances">Advances</TabsTrigger>
              <TabsTrigger value="loans">Loans</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="advances" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input type="search" placeholder="Search advances..." className="w-full pl-8" />
                </div>
                <div className="flex gap-2">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Advance
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Amount (Rs.)</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {advances.map((advance) => (
                      <TableRow key={advance.id}>
                        <TableCell className="font-medium">{advance.id}</TableCell>
                        <TableCell>{advance.supplier}</TableCell>
                        <TableCell>{advance.amount.toLocaleString()}</TableCell>
                        <TableCell>{new Date(advance.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              advance.status === "Paid"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            }
                          >
                            {advance.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/finances/advances/${advance.id}`}>
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="loans" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input type="search" placeholder="Search loans..." className="w-full pl-8" />
                </div>
                <div className="flex gap-2">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Loan
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Amount (Rs.)</TableHead>
                      <TableHead>Monthly Payment</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loans.map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{loan.id}</TableCell>
                        <TableCell>{loan.supplier}</TableCell>
                        <TableCell>{loan.amount.toLocaleString()}</TableCell>
                        <TableCell>{loan.installment.toLocaleString()}</TableCell>
                        <TableCell>{loan.remaining.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              loan.status === "Active"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : loan.status === "Completed"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            }
                          >
                            {loan.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/finances/loans/${loan.id}`}>
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input type="search" placeholder="Search payments..." className="w-full pl-8" />
                </div>
                <div className="flex gap-2">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Payment
                  </Button>
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Advanced
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Amount (Rs.)</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        id: "PAY001",
                        supplier: "Kamal Perera",
                        amount: 45000,
                        date: "2023-04-01",
                        type: "Salary",
                      },
                      {
                        id: "PAY002",
                        supplier: "Nimal Silva",
                        amount: 52000,
                        date: "2023-04-01",
                        type: "Salary",
                      },
                      {
                        id: "PAY003",
                        supplier: "Sunil Fernando",
                        amount: 10000,
                        date: "2023-04-05",
                        type: "Advance",
                      },
                      {
                        id: "PAY004",
                        supplier: "Amal Jayawardena",
                        amount: 10000,
                        date: "2023-04-10",
                        type: "Loan Installment",
                      },
                      {
                        id: "PAY005",
                        supplier: "Saman Kumara",
                        amount: 38000,
                        date: "2023-04-01",
                        type: "Salary",
                      },
                    ].map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.supplier}</TableCell>
                        <TableCell>{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              payment.type === "Salary"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : payment.type === "Advance"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                  : "bg-purple-100 text-purple-800 hover:bg-purple-100"
                            }
                          >
                            {payment.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/finances/payments/${payment.id}`}>
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
