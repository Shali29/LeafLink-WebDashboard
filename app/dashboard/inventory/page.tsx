"use client"

import Link from "next/link"
import React, { useEffect, useState } from "react"
import { Download, FileText, Filter, Plus, Search } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Product {
  ProductID: string
  ProductName: string
  Rate_per_Bag: number
  Stock_bag: number
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTea, setSearchTea] = useState("")
  const [searchFertilizer, setSearchFertilizer] = useState("")

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const res = await fetch(
          "https://backend-production-f1ac.up.railway.app/api/product/all"
        )
        if (!res.ok) throw new Error("Failed to fetch products")
        const data: Product[] = await res.json()
        setProducts(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Separate tea packets and fertilizers
  const teaPackets = products
    .filter((p) => p.ProductID.startsWith("T"))
    .filter((p) =>
      p.ProductName.toLowerCase().includes(searchTea.toLowerCase())
    )
    .map((p) => ({
      id: p.ProductID,
      name: p.ProductName,
      weight: "", // no weight info in API, leave blank or parse if you want
      price: p.Rate_per_Bag,
      quantity: p.Stock_bag,
      status: p.Stock_bag > 0 ? "In Stock" : "Out of Stock",
    }))

  const fertilizers = products
    .filter((p) => !p.ProductID.startsWith("T"))
    .filter((p) =>
      p.ProductName.toLowerCase().includes(searchFertilizer.toLowerCase())
    )
    .map((p) => ({
      id: p.ProductID,
      name: p.ProductName,
      weight: "", // no weight info, optional to parse from name string
      price: p.Rate_per_Bag,
      quantity: p.Stock_bag,
      status: p.Stock_bag > 10 ? "In Stock" : "Low Stock",
    }))

  // Calculations for cards
  const totalTeaQuantity = teaPackets.reduce((a, c) => a + c.quantity, 0)
  const totalTeaValue = teaPackets.reduce((a, c) => a + c.price * c.quantity, 0)

  const totalFertilizerQuantity = fertilizers.reduce((a, c) => a + c.quantity, 0)
  const totalFertilizerValue = fertilizers.reduce(
    (a, c) => a + c.price * c.quantity,
    0
  )

  const lowStockCount =
    fertilizers.filter((f) => f.status === "Low Stock").length +
    teaPackets.filter((t) => t.status !== "In Stock").length

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-green-800">
            Inventory
          </h2>
          <p className="text-gray-500">
            Manage tea packets and fertilizer inventory
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tea Packets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTeaQuantity.toLocaleString()} units
            </div>
            <p className="text-xs text-gray-500">
              Value: Rs. {totalTeaValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fertilizers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalFertilizerQuantity.toLocaleString()} units
            </div>
            <p className="text-xs text-gray-500">
              Value: Rs. {totalFertilizerValue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockCount} items</div>
            <p className="text-xs text-gray-500">Require reordering</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
          <CardDescription>View and manage inventory items</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tea">
            <TabsList className="mb-4">
              <TabsTrigger value="tea">Tea Packets</TabsTrigger>
              <TabsTrigger value="fertilizer">Fertilizers</TabsTrigger>
            </TabsList>

            <TabsContent value="tea" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search tea packets..."
                    className="w-full pl-8"
                    value={searchTea}
                    onChange={(e) => setSearchTea(e.target.value)}
                  />
                </div>
                
              </div>

              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Price (Rs.)</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teaPackets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No tea packets found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      teaPackets.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.weight}</TableCell>
                          <TableCell>{item.price.toLocaleString()}</TableCell>
                          <TableCell>{item.quantity.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 hover:bg-green-100"
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="fertilizer" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search fertilizers..."
                    className="w-full pl-8"
                    value={searchFertilizer}
                    onChange={(e) => setSearchFertilizer(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
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
                      <TableHead>Name</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Price (Rs.)</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fertilizers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">
                          No fertilizers found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      fertilizers.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.weight}</TableCell>
                          <TableCell>{item.price.toLocaleString()}</TableCell>
                          <TableCell>{item.quantity.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={
                                item.status === "In Stock"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/dashboard/inventory/${item.id}`}>
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
