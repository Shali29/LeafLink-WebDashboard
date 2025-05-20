"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  Calendar,
  Download,
  FileText,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Advance {
  LoanID: number
  S_RegisterID: string
  S_FullName: string
  Loan_Amount: number
  Duration: number
  PurposeOfLoan: string
  Monthly_Amount: number
  Due_Date: string
  Status: string
}

interface Loan {
  LoanID: number
  S_RegisterID: string
  S_FullName: string
  Loan_Amount: number
  Duration: number
  PurposeOfLoan: string
  Monthly_Amount: number
  Due_Date: string
  Status: string
}

interface Payment {
  PaymentsID: number
  S_RegisterID: string
  S_FullName: string
  Supplier_Loan_Amount: number
  Supplier_Advance_Amount: number
  TeaPackets_Fertilizers_Amount: number
  Transport_Charge: number
  Final_Total_Salary: number
  Date: string
  Status: string
}

interface Supplier {
  S_RegisterID: string
  S_FullName: string
}

interface Collection {
  S_RegisterID: string
  Current_Rate: number
  TotalWeight: number
  S_FullName: string
  DateTime: string
}

export default function FinancesPage() {
  // States
  const [advances, setAdvances] = useState<Advance[]>([])
  const [loans, setLoans] = useState<Loan[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(false)
  const [searchAdvances, setSearchAdvances] = useState("")
  const [searchLoans, setSearchLoans] = useState("")
  const [searchPayments, setSearchPayments] = useState("")
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null)

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [advRes, loanRes, payRes, supRes, collRes] = await Promise.all([
          fetch("https://backend-production-f1ac.up.railway.app/api/supplierAdvance/all"),
          fetch("https://backend-production-f1ac.up.railway.app/api/supplierLoan/all"),
          fetch("https://backend-production-f1ac.up.railway.app/api/supplierPayment/all"),
          fetch("https://backend-production-f1ac.up.railway.app/api/supplier/all"),
          fetch("https://backend-production-f1ac.up.railway.app/api/supplierCollection/all"),
        ])

        if (!advRes.ok || !loanRes.ok || !payRes.ok || !supRes.ok || !collRes.ok)
          throw new Error("Failed to fetch some data")

        const advData = await advRes.json()
        const loanData = await loanRes.json()
        const payData = await payRes.json()
        const supData = await supRes.json()
        const collData = await collRes.json()

        setAdvances(advData)
        setLoans(loanData)
        setPayments(payData)
        setSuppliers(supData)
        setCollections(collData)
      } catch (error) {
        console.error("Error fetching finances data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Update status for advances or loans or payments
  const updateStatus = async (
  type: "advance" | "loan" | "payment",
  id: number,
  newStatus: string
) => {
  try {
    let url = ""
    switch (type) {
      case "advance":
        url = `https://backend-production-f1ac.up.railway.app/api/supplierAdvance/updateStatus/${id}`
        break
      case "loan":
        url = `https://backend-production-f1ac.up.railway.app/api/supplierLoan/updateStatus/${id}`
        break
      case "payment":
        url = `https://backend-production-f1ac.up.railway.app/api/supplierPayment/updateStatus/${id}`
        break
    }

    console.log(`Updating ${type} ID=${id} to status: ${newStatus} at ${url}`)

    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        type === "payment"
          ? { Status: newStatus }   // Capital S for payments
          : { status: newStatus }   // lowercase for advance and loan
      ),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`Failed to update status, response:`, errorText)
      throw new Error("Failed to update status")
    }

    // Update local state
    if (type === "advance") {
      setAdvances((prev) =>
        prev.map((a) => (a.LoanID === id ? { ...a, Status: newStatus } : a))
      )
    } else if (type === "loan") {
      setLoans((prev) =>
        prev.map((l) => (l.LoanID === id ? { ...l, Status: newStatus } : l))
      )
    } else if (type === "payment") {
      setPayments((prev) =>
        prev.map((p) => (p.PaymentsID === id ? { ...p, Status: newStatus } : p))
      )
    }
  } catch (error) {
    alert("Failed to update status: " + error)
  }
}


  // Filter helpers
  const filteredAdvances = advances.filter((a) =>
    a.S_FullName.toLowerCase().includes(searchAdvances.toLowerCase())
  )
  const filteredLoans = loans.filter((l) =>
    l.S_FullName.toLowerCase().includes(searchLoans.toLowerCase())
  )
  const filteredPayments = payments.filter((p) =>
    p.S_FullName.toLowerCase().includes(searchPayments.toLowerCase())
  )

  // Added 'Approved' to match UI logic with payments statuses
  const statusOptions = [
    "Pending",
    "Approved",
    "Rejected",
    "Paid",
  ]

  // Calculate outstanding advances and loans for a supplier (only non-paid/active)
  const getOutstandingAdvanceForSupplier = (supplierId: string): number =>
    advances
      .filter(
        (a) =>
          a.S_RegisterID === supplierId && (a.Status || "").toLowerCase() !== "paid"
      )
      .reduce((acc, a) => acc + a.Loan_Amount, 0)

  const getOutstandingLoanForSupplier = (supplierId: string): number =>
    loans
      .filter((l) => l.S_RegisterID === supplierId && (l.Status || "").toLowerCase() === "active")
      .reduce((acc, l) => acc + l.Loan_Amount, 0)

  // Calculate total tea collection amount for supplier from collections (Current_Rate * TotalWeight)
  const getTeaCollectionAmountForSupplier = (supplierId: string): number => {
    return collections
      .filter((c) => c.S_RegisterID === supplierId)
      .reduce((acc, c) => acc + c.Current_Rate * c.TotalWeight, 0)
  }

  // SYNC PAYMENTS for all suppliers: Create or Update payment records
  const syncPaymentsForAllSuppliers = async () => {
    setLoading(true)
    try {
      for (const supplier of suppliers) {
        const supplierId = supplier.S_RegisterID

        // Calculate amounts
        const teaAmount = getTeaCollectionAmountForSupplier(supplierId)
        const advanceAmount = getOutstandingAdvanceForSupplier(supplierId)
        const loanAmount = getOutstandingLoanForSupplier(supplierId)

        // Transport charge fixed for example, can be dynamic
        const transportCharge = 100

        // Calculate final salary = teaAmount - advanceAmount - loanAmount - transportCharge
        const finalSalary = Math.max(0, teaAmount - advanceAmount - loanAmount - transportCharge)

        // Check if payment record exists
        const existingPayment = payments.find((p) => p.S_RegisterID === supplierId)

        if (existingPayment) {
          // Update existing payment
          const updateRes = await fetch(
            `https://backend-production-f1ac.up.railway.app/api/supplierPayment/update/${existingPayment.PaymentsID}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                S_RegisterID: supplierId,
                Supplier_Loan_Amount: loanAmount,
                Supplier_Advance_Amount: advanceAmount,
                TeaPackets_Fertilizers_Amount: teaAmount,
                Transport_Charge: transportCharge,
                Final_Total_Salary: finalSalary,
                Date: new Date().toISOString(),
                Status: existingPayment.Status || "Pending",
              }),
            }
          )
          if (!updateRes.ok) {
            console.error(`Failed to update payment for supplier ${supplierId}`)
          }
        } else {
          // Create new payment
          const createRes = await fetch(
            `https://backend-production-f1ac.up.railway.app/api/supplierPayment/create`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                S_RegisterID: supplierId,
                Supplier_Loan_Amount: loanAmount,
                Supplier_Advance_Amount: advanceAmount,
                TeaPackets_Fertilizers_Amount: teaAmount,
                Transport_Charge: transportCharge,
                Final_Total_Salary: finalSalary,
                Date: new Date().toISOString(),
                Status: "Pending",
              }),
            }
          )
          if (!createRes.ok) {
            console.error(`Failed to create payment for supplier ${supplierId}`)
          }
        }
      }

      // Refresh payments data after sync
      const refreshedPaymentsRes = await fetch(
        "https://backend-production-f1ac.up.railway.app/api/supplierPayment/all"
      )
      if (refreshedPaymentsRes.ok) {
        const refreshedPayments = await refreshedPaymentsRes.json()
        setPayments(refreshedPayments)
      }
    } catch (error) {
      console.error("Error syncing payments:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-green-800">
            Finances
          </h2>
          <p className="text-gray-500">Manage advances, loans, and payments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <Calendar className="mr-2 h-4 w-4" />
            {new Date().toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
            })}
          </Button>
          <Button
            onClick={syncPaymentsForAllSuppliers}
            disabled={loading}
            variant="outline"
          >
            Sync Payments
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Advances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs.{" "}
              {loading
                ? "..."
                : advances.reduce((acc, adv) => acc + adv.Loan_Amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Current total advances</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs.{" "}
              {loading
                ? "..."
                : loans
                    .filter((l) => (l.Status || "").toLowerCase() === "active")
                    .reduce((acc, loan) => acc + loan.Loan_Amount, 0)
                    .toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Outstanding active loans</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs.{" "}
              {loading
                ? "..."
                : payments
                    .reduce((acc, p) => {
                      // Recalculate final salary for each payment
                      const teaAmt = getTeaCollectionAmountForSupplier(p.S_RegisterID)
                      const advAmt = getOutstandingAdvanceForSupplier(p.S_RegisterID)
                      const loanAmt = getOutstandingLoanForSupplier(p.S_RegisterID)
                      const transportCharge = p.Transport_Charge || 0
                      const finalSalary = Math.max(0, teaAmt - advAmt - loanAmt - transportCharge)
                      return acc + finalSalary
                    }, 0)
                    .toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Payments this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading
                ? "..."
                : advances.filter((a) => (a.Status || "").toLowerCase() === "pending").length +
                  loans.filter((l) => (l.Status || "").toLowerCase() === "pending").length +
                  payments.filter((p) => (p.Status || "").toLowerCase() === "pending").length}
            </div>
            <p className="text-xs text-gray-500">Requests awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Management</CardTitle>
          <CardDescription>
            Manage supplier advances, loans, and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="advances">
            <TabsList className="mb-4">
              <TabsTrigger value="advances">Advances</TabsTrigger>
              <TabsTrigger value="loans">Loans</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            {/* Advances Tab */}
            <TabsContent value="advances" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search advances..."
                    className="w-full pl-8"
                    value={searchAdvances}
                    onChange={(e) => setSearchAdvances(e.target.value)}
                  />
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

              <div className="rounded-md border overflow-x-auto">
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          Loading advances...
                        </TableCell>
                      </TableRow>
                    ) : filteredAdvances.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          No advances found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAdvances.map((adv) => (
                        <TableRow key={adv.LoanID}>
                          <TableCell className="font-medium">{adv.LoanID}</TableCell>
                          <TableCell>{adv.S_FullName}</TableCell>
                          <TableCell>{adv.Loan_Amount.toLocaleString()}</TableCell>
                          <TableCell>
                            {new Date(adv.Due_Date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <select
                              className={`rounded px-2 py-1 border ${
                                adv.Status === "Paid"
                                  ? "bg-green-100 border-green-500"
                                  : adv.Status === "Approved"
                                  ? "bg-blue-100 border-blue-500"
                                  : adv.Status === "Pending"
                                  ? "bg-yellow-100 border-yellow-500"
                                  : adv.Status === "Rejected"
                                  ? "bg-red-100 border-red-500"
                                  : "bg-gray-100 border-gray-400"
                              }`}
                              value={adv.Status}
                              onChange={(e) =>
                                updateStatus("advance", adv.LoanID, e.target.value)
                              }
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/dashboard/finances/advances/${adv.LoanID}`}>
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">View details</span>
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Loans Tab */}
            <TabsContent value="loans" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search loans..."
                    className="w-full pl-8"
                    value={searchLoans}
                    onChange={(e) => setSearchLoans(e.target.value)}
                  />
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

              <div className="rounded-md border overflow-x-auto">
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
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          Loading loans...
                        </TableCell>
                      </TableRow>
                    ) : filteredLoans.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No loans found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLoans.map((loan) => (
                        <TableRow key={loan.LoanID}>
                          <TableCell className="font-medium">{loan.LoanID}</TableCell>
                          <TableCell>{loan.S_FullName}</TableCell>
                          <TableCell>{loan.Loan_Amount.toLocaleString()}</TableCell>
                          <TableCell>{loan.Monthly_Amount.toLocaleString()}</TableCell>
                          <TableCell>
                            {(loan.Loan_Amount - loan.Duration * loan.Monthly_Amount).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <select
                              className={`rounded px-2 py-1 border ${
                                loan.Status === "Active"
                                  ? "bg-blue-100 border-blue-500"
                                  : loan.Status === "Completed"
                                  ? "bg-green-100 border-green-500"
                                  : loan.Status === "Pending"
                                  ? "bg-yellow-100 border-yellow-500"
                                  : loan.Status === "Rejected"
                                  ? "bg-red-100 border-red-500"
                                  : "bg-gray-100 border-gray-400"
                              }`}
                              value={loan.Status}
                              onChange={(e) =>
                                updateStatus("loan", loan.LoanID, e.target.value)
                              }
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/dashboard/finances/loans/${loan.LoanID}`}>
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">View details</span>
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                {/* Supplier selector */}
                <select
                  className="w-full sm:w-48 rounded border border-gray-300 px-2 py-1"
                  value={selectedSupplierId || ""}
                  onChange={(e) => setSelectedSupplierId(e.target.value || null)}
                >
                  <option value="">-- Select Supplier --</option>
                  {suppliers.map((sup) => (
                    <option key={sup.S_RegisterID} value={sup.S_RegisterID}>
                      {sup.S_FullName}
                    </option>
                  ))}
                </select>

                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search payments..."
                    className="w-full pl-8"
                    value={searchPayments}
                    onChange={(e) => setSearchPayments(e.target.value)}
                  />
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

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Loan Amount (Rs.)</TableHead>
                      <TableHead>Advance Amount (Rs.)</TableHead>
                      <TableHead>Tea & Fertilizer Amount (Rs.)</TableHead>
                      <TableHead>Transport Charge (Rs.)</TableHead>
                      <TableHead>Total Salary (Rs.)</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center">
                          Loading payments...
                        </TableCell>
                      </TableRow>
                    ) : filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center">
                          No payments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      payments
                        .filter((p) =>
                          (selectedSupplierId ? p.S_RegisterID === selectedSupplierId : true) &&
                          p.S_FullName.toLowerCase().includes(searchPayments.toLowerCase())
                        )
                        .map((pay) => {
                          // Recalculate tea collection amount for display consistency
                          const teaAmt = getTeaCollectionAmountForSupplier(pay.S_RegisterID)
                          const advAmt = getOutstandingAdvanceForSupplier(pay.S_RegisterID)
                          const loanAmt = getOutstandingLoanForSupplier(pay.S_RegisterID)

                          // Adjusted salary calculation (same as sync logic)
                          const adjustedSalary = Math.max(
                            0,
                            teaAmt - advAmt - loanAmt - (pay.Transport_Charge || 0)
                          )

                          return (
                            <TableRow key={pay.PaymentsID}>
                              <TableCell className="font-medium">{pay.PaymentsID}</TableCell>
                              <TableCell>{pay.S_FullName}</TableCell>
                              <TableCell>{pay.Supplier_Loan_Amount.toLocaleString()}</TableCell>
                              <TableCell>{pay.Supplier_Advance_Amount.toLocaleString()}</TableCell>
                              <TableCell>
                                {teaAmt.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell>{pay.Transport_Charge.toLocaleString()}</TableCell>
                              <TableCell>
                                {adjustedSalary.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell>{new Date(pay.Date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <select
                                  className={`rounded px-2 py-1 border ${
                                    pay.Status === "Approved"
                                      ? "bg-green-100 border-green-500"
                                      : pay.Status === "Pending"
                                      ? "bg-yellow-100 border-yellow-500"
                                      : pay.Status === "Rejected"
                                      ? "bg-red-100 border-red-500"
                                      : pay.Status === "Paid"
                                      ? "bg-blue-100 border-blue-500"
                                      : "bg-gray-100 border-gray-400"
                                  }`}
                                  value={pay.Status}
                                  onChange={(e) =>
                                    updateStatus("payment", pay.PaymentsID, e.target.value)
                                  }
                                >
                                  {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                      {status}
                                    </option>
                                  ))}
                                </select>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/dashboard/finances/payments/${pay.PaymentsID}`}>
                                    <FileText className="h-4 w-4" />
                                    <span className="sr-only">View details</span>
                                  </Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })
                    )}
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
