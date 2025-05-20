"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  Calculator,
  Download,
  FileText,
  Filter,
  Printer,
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
import { Badge } from "@/components/ui/badge"

// Type for each collection record from API
interface Collection {
  S_RegisterID: string
  S_FullName: string
  Current_Rate: number
  TotalWeight: number
  DateTime: string // ISO date string
}

interface SupplierSalary {
  supplierId: string
  supplierName: string
  totalWeight: number
  averageRate: number
  grossAmount: number
  month: string // e.g. "April 2023"
}

export default function CalculationsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [groupedSalaries, setGroupedSalaries] = useState<SupplierSalary[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [filterMonth, setFilterMonth] = useState<string>("")

  // Fetch all collections
  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          "https://backend-production-f1ac.up.railway.app/api/supplierCollection/all"
        )
        if (!res.ok) throw new Error("Failed to fetch collections")
        const data: Collection[] = await res.json()
        setCollections(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchCollections()
  }, [])

  // Group collections by supplier and by month
  useEffect(() => {
    if (collections.length === 0) {
      setGroupedSalaries([])
      return
    }

    // Filter by month if set (month format YYYY-MM)
    const filtered = filterMonth
      ? collections.filter((c) =>
          c.DateTime.startsWith(filterMonth) // e.g. "2023-04"
        )
      : collections

    // Group by supplier + month
    const map = new Map<string, SupplierSalary>()

    filtered.forEach(({ S_RegisterID, S_FullName, Current_Rate, TotalWeight, DateTime }) => {
      // Extract month like "April 2023"
      const dateObj = new Date(DateTime)
      const monthStr = dateObj.toLocaleString("default", {
        month: "long",
        year: "numeric",
      })

      const key = `${S_RegisterID}-${monthStr}`

      if (!map.has(key)) {
        map.set(key, {
          supplierId: S_RegisterID,
          supplierName: S_FullName,
          totalWeight: 0,
          averageRate: 0,
          grossAmount: 0,
          month: monthStr,
        })
      }
      const existing = map.get(key)!
      // Sum weight and accumulate weighted rates for average calculation
      const newTotalWeight = existing.totalWeight + TotalWeight
      const newGrossAmount = existing.grossAmount + Current_Rate * TotalWeight
      const newAverageRate = newTotalWeight === 0 ? 0 : newGrossAmount / newTotalWeight

      map.set(key, {
        supplierId: S_RegisterID,
        supplierName: S_FullName,
        totalWeight: newTotalWeight,
        grossAmount: newGrossAmount,
        averageRate: newAverageRate,
        month: monthStr,
      })
    })

    setGroupedSalaries(Array.from(map.values()))
  }, [collections, filterMonth])

  // Filter salaries by search on supplier name
  const filteredSalaries = groupedSalaries.filter((s) =>
    s.supplierName.toLowerCase().includes(search.toLowerCase())
  )

  // Example fixed deduction values per supplier — you can replace with real API calls later
  const transportFee = 2000
  const advance = 10000
  const loanDeduction = 5000
  const teaPackets = 1400
  const fertilizer = 2500
  const otherDeductions = 0

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-green-800">
            Salary Calculations
          </h2>
          <p className="text-gray-500">
            Manage supplier salary calculations and payments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Calculator className="mr-2 h-4 w-4" />
            Calculate All
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <Input
          type="search"
          placeholder="Search supplier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />

        <Input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="max-w-xs"
          title="Filter by month"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Salary Calculations</CardTitle>
          <CardDescription>View and manage supplier salary calculations</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading collections...</p>
          ) : filteredSalaries.length === 0 ? (
            <p>No salary calculations found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier ID</TableHead>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Weight (kg)</TableHead>
                  <TableHead>Price/Kg (Rs.)</TableHead>
                  <TableHead>Gross Amount (Rs.)</TableHead>
                  <TableHead>Deductions (Rs.)</TableHead>
                  <TableHead>Net Amount (Rs.)</TableHead>
                  {/* <TableHead className="text-right">Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSalaries.map((s) => {
                  const totalDeductions =
                    transportFee +
                    advance +
                    loanDeduction +
                    teaPackets +
                    fertilizer +
                    otherDeductions
                  const netAmount = Math.max(0, s.grossAmount - totalDeductions)

                  return (
                    <TableRow key={s.supplierId + s.month}>
                      <TableCell>{s.supplierId}</TableCell>
                      <TableCell>{s.supplierName}</TableCell>
                      <TableCell>{s.month}</TableCell>
                      <TableCell>{s.totalWeight.toFixed(2)}</TableCell>
                      <TableCell>{s.averageRate.toFixed(2)}</TableCell>
                      <TableCell>{s.grossAmount.toLocaleString()}</TableCell>
                      <TableCell>{totalDeductions.toLocaleString()}</TableCell>
                      <TableCell>{netAmount.toLocaleString()}</TableCell>
                      {/* <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Printer className="h-4 w-4 text-blue-600" />
                            <span className="sr-only">Print paysheet</span>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/calculations/${s.supplierId}`}>
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Link>
                          </Button>
                        </div>
                      </TableCell> */}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
