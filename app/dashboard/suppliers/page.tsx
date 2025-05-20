"use client"

import Link from "next/link"
import React, { useEffect, useState } from "react"
import {
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

interface Supplier {
  S_RegisterID: string
  S_FullName: string
  S_Address: string
  S_ContactNo: string
  AccountNumber: string
  BankName: string
  Branch: string
  Email: string
  Username: string
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    S_RegisterID: "",
    S_FullName: "",
    S_Address: "",
    S_ContactNo: "",
    AccountNumber: "",
    BankName: "",
    Branch: "",
    Email: "",
    Username: "",
    password: "",
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState("")

  async function fetchSuppliers() {
    setLoading(true)
    try {
      const res = await fetch(
        "https://backend-production-f1ac.up.railway.app/api/supplier/all"
      )
      if (!res.ok) throw new Error("Failed to fetch suppliers")
      const data: Supplier[] = await res.json()
      setSuppliers(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function validateForm() {
    return (
      formData.S_RegisterID.trim() &&
      formData.S_FullName.trim() &&
      formData.S_Address.trim() &&
      formData.S_ContactNo.trim() &&
      formData.AccountNumber.trim() &&
      formData.BankName.trim() &&
      formData.Branch.trim() &&
      formData.Email.trim() &&
      formData.Username.trim() &&
      formData.password.trim()
    )
  }

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
        "https://backend-production-f1ac.up.railway.app/api/supplier/create",
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
        throw new Error(errorData.message || "Failed to add supplier")
      }
      await fetchSuppliers()
      setIsModalOpen(false)
      setFormData({
        S_RegisterID: "",
        S_FullName: "",
        S_Address: "",
        S_ContactNo: "",
        AccountNumber: "",
        BankName: "",
        Branch: "",
        Email: "",
        Username: "",
        password: "",
      })
    } catch (error: any) {
      setFormError(error.message || "Something went wrong")
    } finally {
      setFormLoading(false)
    }
  }

  // DELETE supplier handler
  async function deleteSupplier(id: string) {
  if (!confirm("Are you sure you want to delete this supplier?")) return;

  try {
    setLoading(true);
    const res = await fetch(
      `https://backend-production-f1ac.up.railway.app/api/supplier/delete/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) {
      const errorData = await res.json();
      if (errorData.error && errorData.error.includes("REFERENCE constraint")) {
        alert(
          "Cannot delete supplier because related collections or data exist. Please remove related data first."
        );
      } else {
        throw new Error(errorData.message || "Failed to delete supplier");
      }
      return;
    }
    await fetchSuppliers();
  } catch (error: any) {
    alert(error.message || "Error deleting supplier");
  } finally {
    setLoading(false);
  }
}


  const totalSuppliers = suppliers.length
  const activeSuppliers = suppliers.length
  const inactiveSuppliers = 0

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-green-800">
            Suppliers
          </h2>
          <p className="text-gray-500">Manage supplier information and details</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsModalOpen(true)}>
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
            <div className="text-2xl font-bold">{loading ? "..." : totalSuppliers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : activeSuppliers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inactive Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : inactiveSuppliers}</div>
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
            

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead className="hidden lg:table-cell">Account Number</TableHead>
                    <TableHead className="hidden lg:table-cell">Bank Name</TableHead>
                    <TableHead className="hidden lg:table-cell">Branch</TableHead>
                    <TableHead className="hidden lg:table-cell">Username</TableHead>
                    <TableHead className="hidden lg:table-cell">Email</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">
                        Loading suppliers...
                      </TableCell>
                    </TableRow>
                  ) : suppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">
                        No suppliers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    suppliers.map((supplier) => (
                      <TableRow key={supplier.S_RegisterID}>
                        <TableCell className="font-medium">
                          {supplier.S_RegisterID}
                        </TableCell>
                        <TableCell>{supplier.S_FullName}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {supplier.S_ContactNo}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {supplier.AccountNumber}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {supplier.BankName}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {supplier.Branch}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {supplier.Username}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {supplier.Email}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">


                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteSupplier(supplier.S_RegisterID)}
                              aria-label={`Delete supplier ${supplier.S_FullName}`}
                              title="Delete supplier"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-red-600 hover:text-red-800"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
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
                <span className="font-medium">{loading ? "..." : suppliers.length}</span> of{" "}
                <span className="font-medium">{loading ? "..." : suppliers.length}</span> suppliers
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

      {/* Modal for Add Supplier */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-xl font-semibold mb-4">Add New Supplier</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Supplier Register ID*</label>
            <Input
              name="S_RegisterID"
              value={formData.S_RegisterID}
              onChange={onInputChange}
              required
              placeholder="e.g. SUP12345"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Full Name*</label>
            <Input
              name="S_FullName"
              value={formData.S_FullName}
              onChange={onInputChange}
              required
              placeholder="Supplier full name"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Address*</label>
            <Input
              name="S_Address"
              value={formData.S_Address}
              onChange={onInputChange}
              required
              placeholder="Supplier address"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Contact Number*</label>
            <Input
              name="S_ContactNo"
              value={formData.S_ContactNo}
              onChange={onInputChange}
              required
              placeholder="Contact number"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Account Number*</label>
            <Input
              name="AccountNumber"
              value={formData.AccountNumber}
              onChange={onInputChange}
              required
              placeholder="Bank account number"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Bank Name*</label>
            <Input
              name="BankName"
              value={formData.BankName}
              onChange={onInputChange}
              required
              placeholder="Bank name"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Branch*</label>
            <Input
              name="Branch"
              value={formData.Branch}
              onChange={onInputChange}
              required
              placeholder="Bank branch"
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
            <label className="block mb-1 font-medium">Username*</label>
            <Input
              name="Username"
              value={formData.Username}
              onChange={onInputChange}
              required
              placeholder="Username for login"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password*</label>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={onInputChange}
              required
              placeholder="Password"
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
