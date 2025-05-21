"use client"

import React, { useEffect, useState } from "react"
import {
  ArrowUpRight,
  Leaf,
  Package,
  Truck,
  Users,
  Warehouse,
  AlertTriangle,
  Calendar,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface TeaCollectionStat {
  date: string
  totalWeight: number
}

export default function DashboardPage() {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [teaStats, setTeaStats] = useState<TeaCollectionStat[]>([])
  const [loans, setLoans] = useState<any[]>([])
  const [advances, setAdvances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true)
      try {
        const [
          supRes,
          driverRes,
          collRes,
          prodRes,
          teaStatRes,
          loanRes,
          advanceRes,
        ] = await Promise.all([
          fetch("https://backend-production-f1ac.up.railway.app/api/supplier/all"),
          fetch("https://backend-production-f1ac.up.railway.app/api/driver/AllDrivers"),
          fetch("https://backend-production-f1ac.up.railway.app/api/supplierCollection/all"),
          fetch("https://backend-production-f1ac.up.railway.app/api/product/all"),
          fetch("https://backend-production-f1ac.up.railway.app/api/supplierCollection/statistics"),
          fetch("https://backend-production-f1ac.up.railway.app/api/supplierLoan/all"),
          fetch("https://backend-production-f1ac.up.railway.app/api/supplierAdvance/all"),
        ])

        if (
          !supRes.ok ||
          !driverRes.ok ||
          !collRes.ok ||
          !prodRes.ok ||
          !teaStatRes.ok ||
          !loanRes.ok ||
          !advanceRes.ok
        ) {
          throw new Error("Failed to fetch some data")
        }

        setSuppliers(await supRes.json())
        setDrivers(await driverRes.json())
        setCollections(await collRes.json())
        setProducts(await prodRes.json())

        const teaStatsData = await teaStatRes.json()
        setTeaStats(teaStatsData.dailyCollections || [])

        setLoans(await loanRes.json())
        setAdvances(await advanceRes.json())
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  // Total tea collected (kg)
  const totalTeaCollectionKg = collections.reduce(
    (sum, item) => sum + (item.BalanceWeight_kg || 0),
    0
  )

  // Fertilizer collection value (exclude tea packets)
  const fertilizerProducts = products.filter((p: any) => !p.ProductID.startsWith("T"))
  const fertilizerCollectionValue = fertilizerProducts.reduce(
    (sum, p) => sum + (p.Rate_per_Bag || 0) * (p.Stock_bag || 0),
    0
  )

  // Low stock threshold example: 20 bags
  const lowStockProducts = products.filter(
    (p: any) => (p.Stock_bag ?? 0) < 20
  )

  // Pending loans count - case-sensitive check on capital 'Status'
const pendingLoansCount = loans.filter((loan: any) => loan.Status === "Pending").length

// Pending advances count - same here
const pendingAdvancesCount = advances.filter((adv: any) => adv.Status === "Pending").length


  // Other stats
  const totalSuppliers = suppliers.length
  const activeDriversCount = drivers.length

  const sortedTeaStats = teaStats
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7)

  const dayLabels = sortedTeaStats.map((stat) =>
    new Date(stat.date).toLocaleDateString("en-US", { weekday: "short" })
  )
  const values = sortedTeaStats.map((stat) => stat.totalWeight)
  const maxVal = Math.max(...values, 1)

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-green-800">Dashboard</h2>
          <p className="text-gray-500">Welcome, Admin</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <Calendar className="mr-2 h-4 w-4" />
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Suppliers</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : totalSuppliers}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Drivers</CardTitle>
            <Truck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : activeDriversCount}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tea Collection</CardTitle>
            <Leaf className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : totalTeaCollectionKg.toLocaleString()} kg
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Fertilizer Collection</CardTitle>
            <Warehouse className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : `Rs. ${fertilizerCollectionValue.toLocaleString()}`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tea Collection Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Tea Collection Overview</CardTitle>
            <CardDescription>Daily collection amounts for the month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end justify-between gap-2">
              {loading || sortedTeaStats.length === 0 ? (
                <p className="text-center w-full">Loading chart...</p>
              ) : (
                values.map((value, i) => {
                  const barHeight = (value / maxVal) * 190
                  return (
                    <div key={i} className="relative flex flex-col items-center">
                      <div
                        className="w-12 bg-green-600 rounded-t-md"
                        style={{ height: `${barHeight}px` }}
                      ></div>
                      <span className="text-xs mt-2">{dayLabels[i]}</span>
                      <span className="text-xs text-gray-500">{value.toLocaleString()} kg</span>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
            <CardDescription>Recent system alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Low Stock Notification */}
              {lowStockProducts.length > 0 && (
                <div className="flex items-start gap-4 rounded-lg border p-3">
                  <AlertTriangle className="mt-1 h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Low Fertilizer Stock</p>
                    <p className="text-xs text-gray-500">
                      {lowStockProducts.length} product(s) running low (below 20 bags)
                    </p>
                    <ul className="list-disc list-inside text-xs mt-2 max-h-24 overflow-y-auto">
                      {lowStockProducts.map((p) => (
                        <li key={p.ProductID}>
                          {p.ProductName}: {p.Stock_bag} bags left
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        Order More
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Pending Loans Notification */}
              {pendingLoansCount > 0 && (
                <div className="flex items-start gap-4 rounded-lg border p-3">
                  <AlertTriangle className="mt-1 h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Loan Payment Due</p>
                    <p className="text-xs text-gray-500">
                      {pendingLoansCount} loan(s) have payments pending
                    </p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Pending Advances Notification */}
              {pendingAdvancesCount > 0 && (
                <div className="flex items-start gap-4 rounded-lg border p-3">
                  <AlertTriangle className="mt-1 h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Advance Payment Reminder</p>
                    <p className="text-xs text-gray-500">
                      {pendingAdvancesCount} advance(s) pending payment
                    </p>
                    <div className="mt-2">
                      <Button variant="outline" size="sm">
                        Prepare Advances
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* If no alerts */}
              {lowStockProducts.length === 0 &&
                pendingLoansCount === 0 &&
                pendingAdvancesCount === 0 && (
                  <p className="text-center text-gray-500">No alerts or notifications</p>
                )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Targets and Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        

        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
          
        </div>
      </div>
    </div>
  )
}
