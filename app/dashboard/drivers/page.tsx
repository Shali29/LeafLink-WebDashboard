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
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [formData, setFormData] = useState({
    D_RegisterID: "",
    D_FullName: "",
    D_ContactNumber: "",
    Email: "",
    VehicalNumber: "",
    Route: "",
    Serial_Code: "",
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const [formLoading, setFormLoading] = useState(false)

  // Generate 4-digit registration number string
  const generateRegisterID = () => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000) // 1000 to 9999
    return randomNumber.toString()
  }

  // Generate random serial code (6 chars alphanumeric)
  const generateSerialCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let code = ""
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

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

  useEffect(() => {
    if (isModalOpen) {
      setFormData({
        D_RegisterID: generateRegisterID(),
        D_FullName: "",
        D_ContactNumber: "",
        Email: "",
        VehicalNumber: "",
        Route: "",
        Serial_Code: generateSerialCode(),
      })
      setFormErrors({})
    }
  }, [isModalOpen])

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    // Prevent manual edit of register ID and serial code
    if (name === "D_RegisterID" || name === "Serial_Code") return
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormErrors((prev) => ({ ...prev, [name]: "" }))
  }

  function validateForm() {
    const errors: Record<string, string> = {}
    const {
      D_RegisterID,
      D_FullName,
      D_ContactNumber,
      Email,
      VehicalNumber,
      Route,
      Serial_Code,
    } = formData

    if (!D_FullName.trim()) errors.D_FullName = "Full Name is required."
    if (!D_ContactNumber.trim()) errors.D_ContactNumber = "Contact Number is required."
    if (!Email.trim()) errors.Email = "Email is required."
    if (!VehicalNumber.trim()) errors.VehicalNumber = "Vehicle Number is required."
    if (!Route.trim()) errors.Route = "Route is required."
    if (!Serial_Code.trim()) errors.Serial_Code = "Serial Code is required."

    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/
    if (Email && !emailRegex.test(Email)) errors.Email = "Invalid email format."

    const contactRegex = /^0\d{9}$/
    if (D_ContactNumber && !contactRegex.test(D_ContactNumber))
      errors.D_ContactNumber = "Contact Number must start with 0 and be exactly 10 digits."

    // Register ID exactly 4 digits numeric string
    if (D_RegisterID && !/^\d{4}$/.test(D_RegisterID))
      errors.D_RegisterID = "Register ID must be exactly 4 digits."

    // Check duplicates with null checks:
    if (
      Email &&
      drivers.some((d) => d.Email && d.Email.toLowerCase() === Email.toLowerCase())
    )
      errors.Email = "Email already exists."

    if (
      D_RegisterID &&
      drivers.some(
        (d) => d.D_RegisterID && d.D_RegisterID === D_RegisterID
      )
    )
      errors.D_RegisterID = "Register ID already exists."

    if (
      VehicalNumber &&
      drivers.some(
        (d) =>
          d.VehicalNumber &&
          d.VehicalNumber.toLowerCase() === VehicalNumber.toLowerCase()
      )
    )
      errors.VehicalNumber = "Vehicle Number already exists."

    if (
      Route &&
      drivers.some((d) => d.Route && d.Route.toLowerCase() === Route.toLowerCase())
    )
      errors.Route = "Route already exists."

    if (
      Serial_Code &&
      drivers.some(
        (d) => d.Serial_Code && d.Serial_Code.toUpperCase() === Serial_Code.toUpperCase()
      )
    )
      errors.Serial_Code = "Serial Code already exists."

    setFormErrors(errors)

    return Object.keys(errors).length === 0
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateForm()) return

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
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to add driver")
      }
      await fetchDrivers()
      setIsModalOpen(false)
      setFormLoading(false)
    } catch (error: any) {
      setFormErrors({ general: error.message || "Something went wrong" })
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
          <h2 className="text-3xl font-bold tracking-tight text-green-800">Drivers</h2>
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
              
                
              </div>
              <div className="flex gap-2">
                
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
              placeholder="Auto-generated"
              disabled
            />
            {formErrors.D_RegisterID && (
              <p className="text-red-600 mt-1">{formErrors.D_RegisterID}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Full Name*</label>
            <Input
              name="D_FullName"
              value={formData.D_FullName}
              onChange={onInputChange}
              placeholder="Full name"
              required
            />
            {formErrors.D_FullName && (
              <p className="text-red-600 mt-1">{formErrors.D_FullName}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Contact Number*</label>
            <Input
              name="D_ContactNumber"
              value={formData.D_ContactNumber}
              onChange={onInputChange}
              placeholder="Contact number"
              required
            />
            {formErrors.D_ContactNumber && (
              <p className="text-red-600 mt-1">{formErrors.D_ContactNumber}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Email*</label>
            <Input
              name="Email"
              type="email"
              value={formData.Email}
              onChange={onInputChange}
              placeholder="Email address"
              required
            />
            {formErrors.Email && (
              <p className="text-red-600 mt-1">{formErrors.Email}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Vehicle Number*</label>
            <Input
              name="VehicalNumber"
              value={formData.VehicalNumber}
              onChange={onInputChange}
              placeholder="Vehicle number"
              required
            />
            {formErrors.VehicalNumber && (
              <p className="text-red-600 mt-1">{formErrors.VehicalNumber}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Route*</label>
            <Input
              name="Route"
              value={formData.Route}
              onChange={onInputChange}
              placeholder="Route"
              required
            />
            {formErrors.Route && (
              <p className="text-red-600 mt-1">{formErrors.Route}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">Serial Code*</label>
            <Input
              name="Serial_Code"
              value={formData.Serial_Code}
              onChange={onInputChange}
              placeholder="Serial code"
              disabled
            />
            {formErrors.Serial_Code && (
              <p className="text-red-600 mt-1">{formErrors.Serial_Code}</p>
            )}
          </div>

          {formErrors.general && (
            <p className="text-red-600 font-semibold">{formErrors.general}</p>
          )}

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
