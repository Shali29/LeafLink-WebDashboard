import Link from "next/link"
import { Download, FileText, Filter, MapPin, Plus, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function DriversPage() {
  // Mock data for drivers
  const drivers = [
    {
      id: "DRV001",
      name: "Ranjith Kumara",
      contact: "+94 77 987 6543",
      email: "ranjith@example.com",
      vehicle: "WP-KA-1234",
      route: "Route A - Nuwara Eliya",
      status: "active",
    },
    {
      id: "DRV002",
      name: "Lasith Malinga",
      contact: "+94 76 876 5432",
      email: "lasith@example.com",
      vehicle: "WP-KB-2345",
      route: "Route B - Hatton",
      status: "active",
    },
    {
      id: "DRV003",
      name: "Chaminda Vaas",
      contact: "+94 75 765 4321",
      email: "chaminda@example.com",
      vehicle: "WP-KC-3456",
      route: "Route C - Kandy",
      status: "inactive",
    },
    {
      id: "DRV004",
      name: "Sanath Jayasuriya",
      contact: "+94 71 654 3210",
      email: "sanath@example.com",
      vehicle: "WP-KD-4567",
      route: "Route D - Badulla",
      status: "active",
    },
    {
      id: "DRV005",
      name: "Muttiah Muralitharan",
      contact: "+94 70 543 2109",
      email: "muttiah@example.com",
      vehicle: "WP-KE-5678",
      route: "Route E - Ella",
      status: "active",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-green-800">Drivers</h2>
          <p className="text-gray-500">Manage driver information and routes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Driver
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">20</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Routes Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Driver Management</CardTitle>
          <CardDescription>View and manage all registered drivers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Search drivers..." className="w-full pl-8" />
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
                    <TableHead className="hidden md:table-cell">Vehicle</TableHead>
                    <TableHead className="hidden lg:table-cell">Route</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell className="font-medium">{driver.id}</TableCell>
                      <TableCell>{driver.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{driver.contact}</TableCell>
                      <TableCell className="hidden md:table-cell">{driver.vehicle}</TableCell>
                      <TableCell className="hidden lg:table-cell">{driver.route}</TableCell>
                      <TableCell>
                        <Badge
                          variant={driver.status === "active" ? "default" : "secondary"}
                          className={
                            driver.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }
                        >
                          {driver.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <span className="sr-only">Track location</span>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/drivers/${driver.id}`}>
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{" "}
                <span className="font-medium">24</span> drivers
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
