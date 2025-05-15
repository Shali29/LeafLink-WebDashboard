import Link from "next/link"
import { Download, FileText, Filter, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InventoryPage() {
  // Mock data for tea packets
  const teaPackets = [
    {
      id: "TP001",
      name: "Premium Tea Packet",
      weight: "500g",
      price: 700,
      quantity: 1250,
      status: "In Stock",
    },
  ]

  // Mock data for fertilizers
  const fertilizers = [
    {
      id: "FT001",
      name: "NPK Fertilizer",
      weight: "25kg",
      price: 4500,
      quantity: 45,
      status: "In Stock",
    },
    {
      id: "FT002",
      name: "Organic Fertilizer",
      weight: "20kg",
      price: 3200,
      quantity: 78,
      status: "In Stock",
    },
    {
      id: "FT003",
      name: "Urea Fertilizer",
      weight: "25kg",
      price: 5000,
      quantity: 15,
      status: "Low Stock",
    },
    {
      id: "FT004",
      name: "Potassium Fertilizer",
      weight: "10kg",
      price: 2800,
      quantity: 32,
      status: "In Stock",
    },
    {
      id: "FT005",
      name: "Micronutrient Mix",
      weight: "5kg",
      price: 1800,
      quantity: 8,
      status: "Low Stock",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-green-800">Inventory</h2>
          <p className="text-gray-500">Manage tea packets and fertilizer inventory</p>
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
            <div className="text-2xl font-bold">1,250 units</div>
            <p className="text-xs text-gray-500">Value: Rs. 875,000</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fertilizers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">178 units</div>
            <p className="text-xs text-gray-500">Value: Rs. 532,400</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 items</div>
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
                  <Input type="search" placeholder="Search tea packets..." className="w-full pl-8" />
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

              <div className="rounded-md border">
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
                    {teaPackets.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.weight}</TableCell>
                        <TableCell>{item.price.toLocaleString()}</TableCell>
                        <TableCell>{item.quantity.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="fertilizer" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input type="search" placeholder="Search fertilizers..." className="w-full pl-8" />
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

              <div className="rounded-md border">
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
                    {fertilizers.map((item) => (
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
