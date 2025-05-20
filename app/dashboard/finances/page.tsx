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
  X,
  Trash2,
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

// Modal component (unchanged)
function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          aria-label="Close modal"
        >
          <X />
        </button>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  )
}

interface Advance {
  AdvanceID: number
  S_RegisterID: string
  S_FullName: string
  Advance_Amount: number
  Date: string
  Status: string
  Month?: string
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
  // Data states
  const [advances, setAdvances] = useState<Advance[]>([])
  const [loans, setLoans] = useState<Loan[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(false)

  // Search states
  const [searchAdvances, setSearchAdvances] = useState("")
  const [searchLoans, setSearchLoans] = useState("")
  const [searchPayments, setSearchPayments] = useState("")
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null)

  const advanceStatusOptions = ["Pending", "Transfered"]
  const statusOptions = ["Pending", "Approved", "Rejected", "Paid"]

  // Advance modal states
  const [modalOpenSingleAdvance, setModalOpenSingleAdvance] = useState(false)
  const [modalSupplierAdvance, setModalSupplierAdvance] = useState<Supplier | null>(null)
  const [modalAdvanceAmount, setModalAdvanceAmount] = useState<number>(0)
  const [modalAdvanceMonth, setModalAdvanceMonth] = useState<string>(() => {
    const now = new Date()
    return now.toISOString().slice(0, 7) // yyyy-MM
  })

  // Advance all suppliers modal states
  const [modalOpenAllAdvance, setModalOpenAllAdvance] = useState(false)
  const [modalAdvanceAmountAll, setModalAdvanceAmountAll] = useState<number>(0)
  const [modalAdvanceMonthAll, setModalAdvanceMonthAll] = useState<string>(() => {
    const now = new Date()
    return now.toISOString().slice(0, 7)
  })

  // Payment modal states
  const [modalOpenSinglePayment, setModalOpenSinglePayment] = useState(false)
  const [modalSupplierPayment, setModalSupplierPayment] = useState<Supplier | null>(null)
  const [modalSupplierLoanAmount, setModalSupplierLoanAmount] = useState<number>(0)
  const [modalSupplierAdvanceAmount, setModalSupplierAdvanceAmount] = useState<number>(0)
  const [modalTeaPacketsAmount, setModalTeaPacketsAmount] = useState<number>(0)
  const [modalTransportCharge, setModalTransportCharge] = useState<number>(0)
  const [modalFinalTotalSalary, setModalFinalTotalSalary] = useState<number>(0)
  const [modalPaymentStatus, setModalPaymentStatus] = useState<string>("Pending")
  const [modalPaymentDate, setModalPaymentDate] = useState<string>(new Date().toISOString().slice(0, 10))

  // Loan modal states
  const [modalOpenSingleLoan, setModalOpenSingleLoan] = useState(false)
  const [modalSupplierLoan, setModalSupplierLoan] = useState<Supplier | null>(null)
  const [modalLoanAmount, setModalLoanAmount] = useState<number>(0)
  const [modalLoanDuration, setModalLoanDuration] = useState<number>(0)
  const [modalLoanPurpose, setModalLoanPurpose] = useState<string>("")
  const [modalLoanMonthlyAmount, setModalLoanMonthlyAmount] = useState<number>(0)
  const [modalLoanDueDate, setModalLoanDueDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [modalLoanStatus, setModalLoanStatus] = useState<string>("Pending")

  // Format number helper
  function formatNumber(value: any) {
    return typeof value === "number" ? value.toLocaleString() : "0"
  }

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

  // Update status
  const updateStatus = async (
    type: "advance" | "loan" | "payment",
    id: number,
    newStatus: string
  ) => {
    try {
      let url = ""
      let bodyData = {}

      switch (type) {
        case "advance":
          url = `https://backend-production-f1ac.up.railway.app/api/supplierAdvance/updateStatus/${id}`
          bodyData = { Status: newStatus }
          break
        case "loan":
          url = `https://backend-production-f1ac.up.railway.app/api/supplierLoan/updateStatus/${id}`
          bodyData = { status: newStatus }
          break
        case "payment":
          url = `https://backend-production-f1ac.up.railway.app/api/supplierPayment/updateStatus/${id}`
          bodyData = { Status: newStatus }
          break
      }

      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error(`Failed to update status, response:`, errorText)
        throw new Error("Failed to update status")
      }

      if (type === "advance") {
        setAdvances((prev) =>
          prev.map((a) => (a.AdvanceID === id ? { ...a, Status: newStatus } : a))
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

  // Delete handlers
  const deleteAdvance = async (id: number) => {
    if (!confirm("Are you sure you want to delete this advance?")) return
    setLoading(true)
    try {
      const res = await fetch(`https://backend-production-f1ac.up.railway.app/api/supplierAdvance/delete/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete advance")
      setAdvances((prev) => prev.filter((a) => a.AdvanceID !== id))
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error deleting advance")
    } finally {
      setLoading(false)
    }
  }

  const deleteLoan = async (id: number) => {
    if (!confirm("Are you sure you want to delete this loan?")) return
    setLoading(true)
    try {
      const res = await fetch(`https://backend-production-f1ac.up.railway.app/api/supplierLoan/delete/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete loan")
      setLoans((prev) => prev.filter((l) => l.LoanID !== id))
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error deleting loan")
    } finally {
      setLoading(false)
    }
  }

  const deletePayment = async (id: number) => {
    if (!confirm("Are you sure you want to delete this payment?")) return
    setLoading(true)
    try {
      const res = await fetch(`https://backend-production-f1ac.up.railway.app/api/supplierPayment/delete/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete payment")
      setPayments((prev) => prev.filter((p) => p.PaymentsID !== id))
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error deleting payment")
    } finally {
      setLoading(false)
    }
  }

  // Filters
  const filteredAdvances = advances.filter((a) =>
    a.S_FullName.toLowerCase().includes(searchAdvances.toLowerCase())
  )
  const filteredLoans = loans.filter((l) =>
    l.S_FullName.toLowerCase().includes(searchLoans.toLowerCase())
  )
  const filteredPayments = payments.filter((p) =>
    p.S_FullName.toLowerCase().includes(searchPayments.toLowerCase())
  )

  // Outstanding calculations
  const getOutstandingAdvanceForSupplier = (supplierId: string): number =>
    advances
      .filter(
        (a) =>
          a.S_RegisterID === supplierId && (a.Status || "").toLowerCase() !== "paid"
      )
      .reduce((acc, a) => acc + (a.Advance_Amount || 0), 0)

  const getOutstandingLoanForSupplier = (supplierId: string): number =>
    loans
      .filter(
        (l) =>
          l.S_RegisterID === supplierId &&
          ["active", "approved", "pending"].includes((l.Status || "").toLowerCase())
      )
      .reduce((acc, l) => acc + (l.Loan_Amount || 0), 0)

  const getTeaCollectionAmountForSupplier = (supplierId: string): number =>
    collections
      .filter((c) => c.S_RegisterID === supplierId)
      .reduce((acc, c) => acc + (c.Current_Rate || 0) * (c.TotalWeight || 0), 0)

  // Sync payments for all suppliers
  const syncPaymentsForAllSuppliers = async () => {
    setLoading(true)
    try {
      for (const supplier of suppliers) {
        const supplierId = supplier.S_RegisterID

        const teaAmount = getTeaCollectionAmountForSupplier(supplierId)
        const advanceAmount = getOutstandingAdvanceForSupplier(supplierId)
        const loanAmount = getOutstandingLoanForSupplier(supplierId)

        const transportCharge = 100

        const finalSalary = Math.max(0, teaAmount - advanceAmount - loanAmount - transportCharge)

        const existingPayment = payments.find((p) => p.S_RegisterID === supplierId)

        if (existingPayment) {
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

  // Create advance for single supplier (with month)
  const createAdvanceForSupplier = async () => {
    if (!modalSupplierAdvance) return
    if (!modalAdvanceAmount || modalAdvanceAmount <= 0) {
      alert("Please enter a valid advance amount greater than zero.")
      return
    }
    if (!modalAdvanceMonth) {
      alert("Please select a month.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("https://backend-production-f1ac.up.railway.app/api/supplierAdvance/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          S_RegisterID: modalSupplierAdvance.S_RegisterID,
          Advance_Amount: modalAdvanceAmount,
          Month: modalAdvanceMonth,
          Status: "Pending",
        }),
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Failed to create advance: ${errorText}`)
      }
      const advRes = await fetch("https://backend-production-f1ac.up.railway.app/api/supplierAdvance/all")
      const advData = await advRes.json()
      setAdvances(advData)
      alert(`Advance of Rs.${modalAdvanceAmount} created for supplier ${modalSupplierAdvance.S_FullName} for month ${modalAdvanceMonth}.`)
      setModalOpenSingleAdvance(false)
      setModalAdvanceAmount(0)
      setModalSupplierAdvance(null)
    } catch (error: any) {
      alert(error.message || "Failed to create advance.")
    } finally {
      setLoading(false)
    }
  }

  // Create advances for all suppliers (with month)
  const createAdvanceForAllSuppliers = async () => {
    if (!modalAdvanceAmountAll || modalAdvanceAmountAll <= 0) {
      alert("Please enter a valid advance amount greater than zero.")
      return
    }
    if (!modalAdvanceMonthAll) {
      alert("Please select a month.")
      return
    }
    setLoading(true)
    try {
      for (const supplier of suppliers) {
        await fetch("https://backend-production-f1ac.up.railway.app/api/supplierAdvance/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            S_RegisterID: supplier.S_RegisterID,
            Advance_Amount: modalAdvanceAmountAll,
            Month: modalAdvanceMonthAll,
            Status: "Pending",
          }),
        })
      }
      const advRes = await fetch("https://backend-production-f1ac.up.railway.app/api/supplierAdvance/all")
      const advData = await advRes.json()
      setAdvances(advData)
      alert(`Advance of Rs.${modalAdvanceAmountAll} created for all suppliers for month ${modalAdvanceMonthAll}.`)
      setModalOpenAllAdvance(false)
      setModalAdvanceAmountAll(0)
    } catch (error) {
      alert("Failed to create advances for all suppliers.")
    } finally {
      setLoading(false)
    }
  }

  // Create payment for single supplier (existing)
  const createPaymentForSupplier = async () => {
    if (!modalSupplierPayment) return
    if (
      modalSupplierLoanAmount < 0 ||
      modalSupplierAdvanceAmount < 0 ||
      modalTeaPacketsAmount < 0 ||
      modalTransportCharge < 0 ||
      modalFinalTotalSalary < 0
    ) {
      alert("Amounts must be zero or positive.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("https://backend-production-f1ac.up.railway.app/api/supplierPayment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          S_RegisterID: modalSupplierPayment.S_RegisterID,
          Supplier_Loan_Amount: modalSupplierLoanAmount,
          Supplier_Advance_Amount: modalSupplierAdvanceAmount,
          TeaPackets_Fertilizers_Amount: modalTeaPacketsAmount,
          Transport_Charge: modalTransportCharge,
          Final_Total_Salary: modalFinalTotalSalary,
          Date: modalPaymentDate,
          Status: modalPaymentStatus,
        }),
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Failed to create payment: ${errorText}`)
      }
      const payRes = await fetch("https://backend-production-f1ac.up.railway.app/api/supplierPayment/all")
      const payData = await payRes.json()
      setPayments(payData)
      alert(`Payment created for supplier ${modalSupplierPayment.S_FullName}.`)
      setModalOpenSinglePayment(false)
      setModalSupplierPayment(null)
      setModalSupplierLoanAmount(0)
      setModalSupplierAdvanceAmount(0)
      setModalTeaPacketsAmount(0)
      setModalTransportCharge(0)
      setModalFinalTotalSalary(0)
      setModalPaymentStatus("Pending")
      setModalPaymentDate(new Date().toISOString().slice(0, 10))
    } catch (error: any) {
      alert(error.message || "Failed to create payment.")
    } finally {
      setLoading(false)
    }
  }

  // Loan: Create loan for single supplier
  const createLoanForSupplier = async () => {
    if (!modalSupplierLoan) {
      alert("Supplier not selected")
      return
    }
    if (modalLoanAmount <= 0) {
      alert("Please enter a valid loan amount greater than zero.")
      return
    }
    if (modalLoanDuration <= 0) {
      alert("Please enter a valid duration greater than zero.")
      return
    }
    if (!modalLoanPurpose.trim()) {
      alert("Please enter the purpose of the loan.")
      return
    }
    if (modalLoanMonthlyAmount <= 0) {
      alert("Please enter a valid monthly amount greater than zero.")
      return
    }
    if (!modalLoanDueDate) {
      alert("Please enter a valid due date.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("https://backend-production-f1ac.up.railway.app/api/supplierLoan/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          S_RegisterID: modalSupplierLoan.S_RegisterID,
          Loan_Amount: modalLoanAmount,
          Duration: modalLoanDuration,
          PurposeOfLoan: modalLoanPurpose,
          Monthly_Amount: modalLoanMonthlyAmount,
          Due_Date: modalLoanDueDate,
          Status: modalLoanStatus,
        }),
      })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Failed to create loan: ${errorText}`)
      }
      const loanRes = await fetch("https://backend-production-f1ac.up.railway.app/api/supplierLoan/all")
      const loanData = await loanRes.json()
      setLoans(loanData)
      alert(`Loan created for supplier ${modalSupplierLoan.S_FullName}.`)
      setModalOpenSingleLoan(false)
      setModalSupplierLoan(null)
      setModalLoanAmount(0)
      setModalLoanDuration(0)
      setModalLoanPurpose("")
      setModalLoanMonthlyAmount(0)
      setModalLoanDueDate(new Date().toISOString().slice(0, 10))
      setModalLoanStatus("Pending")
    } catch (error: any) {
      alert(error.message || "Failed to create loan.")
    } finally {
      setLoading(false)
    }
  }

  // Compute final salary dynamically for payment modal
  useEffect(() => {
    const finalSalaryCalc =
      modalTeaPacketsAmount - modalSupplierAdvanceAmount - modalSupplierLoanAmount - modalTransportCharge
    setModalFinalTotalSalary(finalSalaryCalc > 0 ? finalSalaryCalc : 0)
  }, [modalTeaPacketsAmount, modalSupplierAdvanceAmount, modalSupplierLoanAmount, modalTransportCharge])

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-green-800">Finances</h2>
          <p className="text-gray-500">Manage advances, loans, and payments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <Calendar className="mr-2 h-4 w-4" />
            {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long" })}
          </Button>
          <Button onClick={syncPaymentsForAllSuppliers} disabled={loading} variant="outline">
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
                : advances.reduce((acc, adv) => acc + (adv.Advance_Amount || 0), 0).toLocaleString()}
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
                    .filter((l) =>
                      ["active", "approved", "pending"].includes((l.Status || "").toLowerCase())
                    )
                    .reduce((acc, loan) => acc + (loan.Loan_Amount || 0), 0)
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
          <CardDescription>Manage supplier advances, loans, and payments</CardDescription>
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
                <div className="flex gap-2 items-center">
                  <Button
                    onClick={() => setModalOpenAllAdvance(true)}
                    disabled={loading || suppliers.length === 0}
                    variant="outline"
                    size="sm"
                  >
                    Create Advance for All Suppliers
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="rounded-md border overflow-x-auto max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Amount (Rs.)</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          Loading advances...
                        </TableCell>
                      </TableRow>
                    ) : filteredAdvances.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No advances found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAdvances.map((adv) => (
                        <TableRow key={adv.AdvanceID}>
                          <TableCell className="font-medium">{adv.AdvanceID}</TableCell>
                          <TableCell>{adv.S_FullName}</TableCell>
                          <TableCell>{formatNumber(adv.Advance_Amount)}</TableCell>
                          <TableCell>{adv.Month || "-"}</TableCell>
                          <TableCell>{adv.Date ? new Date(adv.Date).toLocaleDateString() : "-"}</TableCell>
                          <TableCell>
                            <select
                              className={`rounded px-2 py-1 border ${
                                adv.Status === "Transfered"
                                  ? "bg-green-100 border-green-500"
                                  : adv.Status === "Pending"
                                  ? "bg-yellow-100 border-yellow-500"
                                  : "bg-gray-100 border-gray-400"
                              }`}
                              value={adv.Status || "Pending"}
                              onChange={(e) =>
                                updateStatus("advance", adv.AdvanceID, e.target.value)
                              }
                            >
                              {advanceStatusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </TableCell>
                          <TableCell className="text-right space-x-2 flex justify-end items-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const supplier = suppliers.find((s) => s.S_RegisterID === adv.S_RegisterID)
                                setModalSupplierAdvance(supplier || null)
                                setModalAdvanceAmount(0)
                                setModalAdvanceMonth(new Date().toISOString().slice(0, 7))
                                setModalOpenSingleAdvance(true)
                              }}
                            >
                              Create Advance
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteAdvance(adv.AdvanceID)}
                              title="Delete advance"
                            >
                              <Trash2 className="h-4 w-4 text-red-600 hover:text-red-800" />
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/dashboard/finances/advances/${adv.AdvanceID}`}>
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
                <div className="flex gap-2 items-center">
                  <Button
                    onClick={() => setModalOpenSingleLoan(true)}
                    disabled={loading || suppliers.length === 0}
                    variant="outline"
                    size="sm"
                  >
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

              <div className="rounded-md border overflow-x-auto max-h-[400px]">
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
                          <TableCell>{formatNumber(loan.Loan_Amount)}</TableCell>
                          <TableCell>{formatNumber(loan.Monthly_Amount)}</TableCell>
                          <TableCell>
                            {typeof loan.Loan_Amount === "number" &&
                            typeof loan.Monthly_Amount === "number" &&
                            typeof loan.Duration === "number"
                              ? (loan.Loan_Amount - loan.Duration * loan.Monthly_Amount).toLocaleString()
                              : "0"}
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
                          <TableCell className="text-right space-x-2 flex justify-end items-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteLoan(loan.LoanID)}
                              title="Delete loan"
                            >
                              <Trash2 className="h-4 w-4 text-red-600 hover:text-red-800" />
                            </Button>
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

                <div className="flex gap-2 items-center">
                  <Button
                    onClick={() => {
                      if (!selectedSupplierId) {
                        alert("Please select a supplier to create payment.")
                        return
                      }
                      const supplier = suppliers.find((s) => s.S_RegisterID === selectedSupplierId)
                      if (!supplier) {
                        alert("Selected supplier not found.")
                        return
                      }
                      setModalSupplierPayment(supplier)
                      setModalSupplierLoanAmount(getOutstandingLoanForSupplier(supplier.S_RegisterID))
                      setModalSupplierAdvanceAmount(getOutstandingAdvanceForSupplier(supplier.S_RegisterID))
                      setModalTeaPacketsAmount(getTeaCollectionAmountForSupplier(supplier.S_RegisterID))
                      setModalTransportCharge(100)
                      setModalPaymentStatus("Pending")
                      setModalPaymentDate(new Date().toISOString().slice(0, 10))
                      setModalOpenSinglePayment(true)
                    }}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                  >
                    Create Payment
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

              <div className="rounded-md border overflow-x-auto max-h-[400px]">
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
                          const teaAmt = getTeaCollectionAmountForSupplier(pay.S_RegisterID)
                          const advAmt = getOutstandingAdvanceForSupplier(pay.S_RegisterID)
                          const loanAmt = getOutstandingLoanForSupplier(pay.S_RegisterID)

                          const adjustedSalary = Math.max(
                            0,
                            teaAmt - advAmt - loanAmt - (pay.Transport_Charge || 0)
                          )

                          return (
                            <TableRow key={pay.PaymentsID}>
                              <TableCell className="font-medium">{pay.PaymentsID}</TableCell>
                              <TableCell>{pay.S_FullName}</TableCell>
                              <TableCell>{formatNumber(loanAmt)}</TableCell>
                              <TableCell>{formatNumber(advAmt)}</TableCell>
                              <TableCell>
                                {teaAmt.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell>{formatNumber(pay.Transport_Charge)}</TableCell>
                              <TableCell>
                                {adjustedSalary.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell>{pay.Date ? new Date(pay.Date).toLocaleDateString() : "-"}</TableCell>
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
                              <TableCell className="text-right space-x-2 flex justify-end items-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deletePayment(pay.PaymentsID)}
                                  title="Delete payment"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600 hover:text-red-800" />
                                </Button>
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

      {/* Modal: Create Advance Single */}
      <Modal open={modalOpenSingleAdvance} onClose={() => setModalOpenSingleAdvance(false)} title="Create Advance">
        <div className="space-y-4">
          <p>
            Supplier: <strong>{modalSupplierAdvance?.S_FullName || "-"}</strong>
          </p>
          <Input
            type="number"
            placeholder="Advance Amount"
            value={modalAdvanceAmount > 0 ? modalAdvanceAmount : ""}
            onChange={(e) => setModalAdvanceAmount(Number(e.target.value))}
          />
          <div>
            <label className="block mb-1 font-medium">Select Month</label>
            <input
              type="month"
              value={modalAdvanceMonth}
              onChange={(e) => setModalAdvanceMonth(e.target.value)}
              className="w-full rounded border border-gray-300 px-2 py-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpenSingleAdvance(false)}>
              Cancel
            </Button>
            <Button onClick={createAdvanceForSupplier} disabled={loading}>
              Create
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Create Advance for All Suppliers */}
      <Modal open={modalOpenAllAdvance} onClose={() => setModalOpenAllAdvance(false)} title="Create Advance for All Suppliers">
        <div className="space-y-4">
          <Input
            type="number"
            placeholder="Advance Amount for All"
            value={modalAdvanceAmountAll > 0 ? modalAdvanceAmountAll : ""}
            onChange={(e) => setModalAdvanceAmountAll(Number(e.target.value))}
          />
          <div>
            <label className="block mb-1 font-medium">Select Month</label>
            <input
              type="month"
              value={modalAdvanceMonthAll}
              onChange={(e) => setModalAdvanceMonthAll(e.target.value)}
              className="w-full rounded border border-gray-300 px-2 py-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpenAllAdvance(false)}>
              Cancel
            </Button>
            <Button onClick={createAdvanceForAllSuppliers} disabled={loading}>
              Create for All
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Create Payment Single */}
      <Modal open={modalOpenSinglePayment} onClose={() => setModalOpenSinglePayment(false)} title="Create Payment">
        <div className="space-y-4">
          <p>
            Supplier: <strong>{modalSupplierPayment?.S_FullName || "-"}</strong>
          </p>
          <Input
            type="number"
            placeholder="Supplier Loan Amount"
            value={modalSupplierLoanAmount}
            onChange={(e) => setModalSupplierLoanAmount(Number(e.target.value))}
            min={0}
          />
          <Input
            type="number"
            placeholder="Supplier Advance Amount"
            value={modalSupplierAdvanceAmount}
            onChange={(e) => setModalSupplierAdvanceAmount(Number(e.target.value))}
            min={0}
          />
          <Input
            type="number"
            placeholder="Tea & Fertilizer Amount"
            value={modalTeaPacketsAmount}
            onChange={(e) => setModalTeaPacketsAmount(Number(e.target.value))}
            min={0}
          />
          <Input
            type="number"
            placeholder="Transport Charge"
            value={modalTransportCharge}
            onChange={(e) => setModalTransportCharge(Number(e.target.value))}
            min={0}
          />
          <Input
            type="number"
            placeholder="Final Total Salary"
            value={modalFinalTotalSalary}
            readOnly
          />
          <Input
            type="date"
            placeholder="Payment Date"
            value={modalPaymentDate}
            onChange={(e) => setModalPaymentDate(e.target.value)}
          />
          <select
            className="w-full rounded border border-gray-300 px-2 py-1"
            value={modalPaymentStatus}
            onChange={(e) => setModalPaymentStatus(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpenSinglePayment(false)}>
              Cancel
            </Button>
            <Button onClick={createPaymentForSupplier} disabled={loading}>
              Create Payment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Create Loan Single */}
      <Modal open={modalOpenSingleLoan} onClose={() => setModalOpenSingleLoan(false)} title="Create Loan">
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Supplier</label>
            <select
              className="w-full rounded border border-gray-300 px-2 py-1"
              value={modalSupplierLoan?.S_RegisterID || ""}
              onChange={(e) => {
                const sup = suppliers.find((s) => s.S_RegisterID === e.target.value) || null
                setModalSupplierLoan(sup)
              }}
            >
              <option value="">-- Select Supplier --</option>
              {suppliers.map((sup) => (
                <option key={sup.S_RegisterID} value={sup.S_RegisterID}>
                  {sup.S_FullName}
                </option>
              ))}
            </select>
          </div>
          <Input
            type="number"
            placeholder="Loan Amount"
            value={modalLoanAmount > 0 ? modalLoanAmount : ""}
            onChange={(e) => setModalLoanAmount(Number(e.target.value))}
            min={0}
          />
          <Input
            type="number"
            placeholder="Duration (months)"
            value={modalLoanDuration > 0 ? modalLoanDuration : ""}
            onChange={(e) => setModalLoanDuration(Number(e.target.value))}
            min={0}
          />
          <Input
            type="text"
            placeholder="Purpose of Loan"
            value={modalLoanPurpose}
            onChange={(e) => setModalLoanPurpose(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Monthly Amount"
            value={modalLoanMonthlyAmount > 0 ? modalLoanMonthlyAmount : ""}
            onChange={(e) => setModalLoanMonthlyAmount(Number(e.target.value))}
            min={0}
          />
          <Input
            type="date"
            placeholder="Due Date"
            value={modalLoanDueDate}
            onChange={(e) => setModalLoanDueDate(e.target.value)}
          />
          <select
            className="w-full rounded border border-gray-300 px-2 py-1"
            value={modalLoanStatus}
            onChange={(e) => setModalLoanStatus(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalOpenSingleLoan(false)}>
              Cancel
            </Button>
            <Button onClick={createLoanForSupplier} disabled={loading}>
              Create Loan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
