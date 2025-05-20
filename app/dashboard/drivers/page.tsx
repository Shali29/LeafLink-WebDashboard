"use client"

import Link from "next/link"
import React, { useEffect, useState } from "react"
import {
  Download,
  FileText,
  Filter,
  MapPin,
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
import { Badge } from "@/components/ui/badge"

function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className="bg-white rounded-md shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto relative p-6"
        role="dialog"
        aria-modal="true"
      >
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
        >
          &#x2715;
        </button>
        {children}
      </div>
    </div>
  )
}

interface Driver {
  D_RegisterID: string
  D_FullName: string
  D_ContactNumber: string
  Email: string
  VehicalNumber: string
  Route: string
  Serial_Code: string
  // OTP ignored as per your note
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)

  // Modal open state
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Form state for adding driver
  const [formData, setFormData] = useState({
    D_RegisterID: "",
    D_FullName: "",
    D_ContactNumber: "",
    Email: "",
    VehicalNumber: "",
    Route: "",
    Serial_Code: "",
  })

  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  // Fetch drivers from API
  async function fetchDrivers() {
    setLoading(true)
    try {
      const res = await fetch(
        "https://backend-production-f1ac.up.railway.app/api/driver/AllDrivers"
      )
      if (!res.ok) throw new Error("Failed to fetch drivers")
      const data: Driver[] = await res.json()
      setDrivers(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDrivers()
  }, [])

  // Input change handler
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Basic form validation
  function validateForm() {
    return (
      formData.D_RegisterID.trim() &&
      formData.D_FullName.trim() &&
      formData.D_ContactNumber.trim() &&
      formData.Email.trim() &&
      formData.VehicalNumber.trim() &&
      formData.Route.trim() &&
      formData.Serial_Code.trim()
    )
  }

  // Submit new driver
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError("")

    if (!validateForm()) {
      setFormError("Please fill in all required fields.")
      return
    }

    setFormLoading(true)

    try {
      const res = await fetch(
        "https://backend-production-f1ac.up.railway.app/api/driver/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to add driver")
      }
      await fetchDrivers()
      setIsModalOpen(false)
      setFormData({
        D_RegisterID: "",
        D_FullName: "",
        D_ContactNumber: "",
        Email: "",
        VehicalNumber: "",
        Route: "",
        Serial_Code: "",
      })
    } catch (error: any) {
      setFormError(error.message || "Something went wrong")
    } finally {
      setFormLoading(false)
    }
  }

  const totalDrivers = drivers.length
  const activeDrivers = totalDrivers
  const routesCovered = new Set(drivers.map((d) => d.Route)).size

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-green-800">
            Drivers
          </h2>
          <p className="text-gray-500">Manage driver information and routes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsModalOpen(true)}>
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
            <div className="text-2xl font-bold">{loading ? "..." : totalDrivers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : activeDrivers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Routes Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : routesCovered}</div>
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
                <Input
                  type="search"
                  placeholder="Search drivers..."
                  className="w-full pl-8"
                  disabled
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Advanced
                </Button>
                <Button variant="outline" size="sm" disabled>
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
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead className="hidden md:table-cell">Vehicle</TableHead>
                    <TableHead className="hidden lg:table-cell">Route</TableHead>
                    <TableHead className="hidden lg:table-cell">Serial Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        Loading drivers...
                      </TableCell>
                    </TableRow>
                  ) : drivers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No drivers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    drivers.map((driver) => (
                      <TableRow key={driver.D_RegisterID}>
                        <TableCell className="font-medium">{driver.D_RegisterID}</TableCell>
                        <TableCell>{driver.D_FullName}</TableCell>
                        <TableCell className="hidden md:table-cell">{driver.D_ContactNumber}</TableCell>
                        <TableCell className="hidden md:table-cell">{driver.VehicalNumber}</TableCell>
                        <TableCell className="hidden lg:table-cell">{driver.Route}</TableCell>
                        <TableCell className="hidden lg:table-cell">{driver.Serial_Code}</TableCell>
                        <TableCell>
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-800 hover:bg-green-100"
                          >
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              <span className="sr-only">Track location</span>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/dashboard/drivers/${driver.D_RegisterID}`}>
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">View details</span>
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{loading ? "..." : drivers.length}</span> of{" "}
                <span className="font-medium">{loading ? "..." : drivers.length}</span> drivers
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal for Add Driver */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-xl font-semibold mb-4">Add New Driver</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Driver Register ID*</label>
            <Input
              name="D_RegisterID"
              value={formData.D_RegisterID}
              onChange={onInputChange}
              required
              placeholder="e.g. 110"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Full Name*</label>
            <Input
              name="D_FullName"
              value={formData.D_FullName}
              onChange={onInputChange}
              required
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Contact Number*</label>
            <Input
              name="D_ContactNumber"
              value={formData.D_ContactNumber}
              onChange={onInputChange}
              required
              placeholder="Contact number"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email*</label>
            <Input
              name="Email"
              type="email"
              value={formData.Email}
              onChange={onInputChange}
              required
              placeholder="Email address"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Vehicle Number*</label>
            <Input
              name="VehicalNumber"
              value={formData.VehicalNumber}
              onChange={onInputChange}
              required
              placeholder="Vehicle number"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Route*</label>
            <Input
              name="Route"
              value={formData.Route}
              onChange={onInputChange}
              required
              placeholder="Route"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Serial Code*</label>
            <Input
              name="Serial_Code"
              value={formData.Serial_Code}
              onChange={onInputChange}
              required
              placeholder="Serial code"
            />
          </div>

          {formError && <p className="text-red-600">{formError}</p>}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
