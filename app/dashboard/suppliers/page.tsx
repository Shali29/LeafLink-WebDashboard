import Link from "next/link"
import { Download, FileText, Filter, Plus, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function SuppliersPage() {
  // Mock data for suppliers
  const suppliers = [
    {
      id: "SUP001",
      name: "Kamal Perera",
      address: "123 Tea Garden Rd, Nuwara Eliya",
      contact: "+94 77 123 4567",
      account: "1234567890",
      bank: "Bank of Ceylon",
      branch: "Nuwara Eliya",
      email: "kamal@example.com",
      status: "active",
      created: "2022-05-15",
    },
    {
      id: "SUP002",
      name: "Nimal Silva",
      address: "456 Hill View, Hatton",
      contact: "+94 76 234 5678",
      account: "2345678901",
      bank: "People's Bank",
      branch: "Hatton",
      email: "nimal@example.com",
      status: "active",
      created: "2022-06-20",
    },
    {
      id: "SUP003",
      name: "Sunil Fernando",
      address: "789 Valley Road, Kandy",
      contact: "+94 75 345 6789",
      account: "3456789012",
      bank: "Commercial Bank",
      branch: "Kandy",
      email: "sunil@example.com",
      status: "inactive",
      created: "2022-07-10",
    },
    {
      id: "SUP004",
      name: "Amal Jayawardena",
      address: "234 Mountain View, Badulla",
      contact: "+94 71 456 7890",
      account: "4567890123",
      bank: "Sampath Bank",
      branch: "Badulla",
      email: "amal@example.com",
      status: "active",
      created: "2022-08-05",
    },
    {
      id: "SUP005",
      name: "Saman Kumara",
      address: "567 Green Hills, Ella",
      contact: "+94 70 567 8901",
      account: "5678901234",
      bank: "Nations Trust Bank",
      branch: "Ella",
      email: "saman@example.com",
      status: "active",
      created: "2022-09-15",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-green-800">Suppliers</h2>
          <p className="text-gray-500">Manage supplier information and details</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">112</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inactive Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Supplier Management</CardTitle>
          <CardDescription>View and manage all registered suppliers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search suppliers..." className="w-full pl-8" />
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
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead className="hidden md:table-cell">Bank Account</TableHead>
                    <TableHead className="hidden lg:table-cell">Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.id}</TableCell>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{supplier.contact}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {supplier.account} ({supplier.bank})
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{supplier.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={supplier.status === "active" ? "default" : "secondary"}
                          className={
                            supplier.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {supplier.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/suppliers/${supplier.id}`}>
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

            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{" "}
                <span className="font-medium">128</span> suppliers
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
