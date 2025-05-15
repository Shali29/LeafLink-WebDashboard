import Link from "next/link"
import { Calculator, Download, FileText, Filter, Printer, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function CalculationsPage() {
  // Mock data for salary calculations
  const salaryCalculations = [
    {
      id: "SC001",
      supplier: "Kamal Perera",
      supplierId: "SUP001",
      totalWeight: 450,
      pricePerKg: 100,
      grossAmount: 45000,
      transportFee: 2000,
      advance: 10000,
      loanDeduction: 5000,
      teaPackets: 1400,
      fertilizer: 2500,
      otherDeductions: 0,
      netAmount: 24100,
      status: "Paid",
      month: "April 2023",
    },
    {
      id: "SC002",
      supplier: "Nimal Silva",
      supplierId: "SUP002",
      totalWeight: 520,
      pricePerKg: 100,
      grossAmount: 52000,
      transportFee: 2500,
      advance: 15000,
      loanDeduction: 7500,
      teaPackets: 700,
      fertilizer: 4500,
      otherDeductions: 1000,
      netAmount: 20800,
      status: "Paid",
      month: "April 2023",
    },
    {
      id: "SC003",
      supplier: "Sunil Fernando",
      supplierId: "SUP003",
      totalWeight: 380,
      pricePerKg: 100,
      grossAmount: 38000,
      transportFee: 1800,
      advance: 8000,
      loanDeduction: 3000,
      teaPackets: 1400,
      fertilizer: 0,
      otherDeductions: 500,
      netAmount: 23300,
      status: "Pending",
      month: "April 2023",
    },
    {
      id: "SC004",
      supplier: "Amal Jayawardena",
      supplierId: "SUP004",
      totalWeight: 480,
      pricePerKg: 100,
      grossAmount: 48000,
      transportFee: 2200,
      advance: 12000,
      loanDeduction: 10000,
      teaPackets: 700,
      fertilizer: 2800,
      otherDeductions: 0,
      netAmount: 20300,
      status: "Pending",
      month: "April 2023",
    },
    {
      id: "SC005",
      supplier: "Saman Kumara",
      supplierId: "SUP005",
      totalWeight: 410,
      pricePerKg: 100,
      grossAmount: 41000,
      transportFee: 2000,
      advance: 7500,
      loanDeduction: 2500,
      teaPackets: 1400,
      fertilizer: 1800,
      otherDeductions: 0,
      netAmount: 25800,
      status: "Paid",
      month: "April 2023",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-green-800">Salary Calculations</h2>
          <p className="text-gray-500">Manage supplier salary calculations and payments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Calculator className="mr-2 h-4 w-4" />
            Calculate All
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Gross Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. 224,000</div>
            <p className="text-xs text-gray-500">For April 2023</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. 109,700</div>
            <p className="text-xs text-gray-500">All deductions combined</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Net Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. 114,300</div>
            <p className="text-xs text-gray-500">To be paid to suppliers</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Salary Calculations</CardTitle>
          <CardDescription>View and manage supplier salary calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search calculations..." className="w-full pl-8" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
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
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>Gross (Rs.)</TableHead>
                    <TableHead>Deductions (Rs.)</TableHead>
                    <TableHead>Net (Rs.)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salaryCalculations.map((calc) => {
                    const totalDeductions =
                      calc.transportFee +
                      calc.advance +
                      calc.loanDeduction +
                      calc.teaPackets +
                      calc.fertilizer +
                      calc.otherDeductions

                    return (
                      <TableRow key={calc.id}>
                        <TableCell className="font-medium">{calc.id}</TableCell>
                        <TableCell>{calc.supplier}</TableCell>
                        <TableCell>{calc.totalWeight}</TableCell>
                        <TableCell>{calc.grossAmount.toLocaleString()}</TableCell>
                        <TableCell>{totalDeductions.toLocaleString()}</TableCell>
                        <TableCell>{calc.netAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              calc.status === "Paid"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            }
                          >
                            {calc.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Printer className="h-4 w-4 text-blue-600" />
                              <span className="sr-only">Print paysheet</span>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/dashboard/calculations/${calc.id}`}>
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">View details</span>
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{" "}
                <span className="font-medium">128</span> calculations
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
