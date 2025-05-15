"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Leaf,
  LogOut,
  Menu,
  Package,
  Settings,
  Truck,
  Users,
  Warehouse,
  CreditCard,
  Calculator,
  MapPin,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"

interface NavItemProps {
  href: string
  icon: React.ElementType
  title: string
  isActive: boolean
}

function NavItem({ href, icon: Icon, title, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
        isActive ? "bg-green-100 text-green-900" : "text-gray-500 hover:text-green-900 hover:bg-green-50"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{title}</span>
    </Link>
  )
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const { toast } = useToast()

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    })
    // In a real app, handle logout logic and redirect to login
    window.location.href = "/login"
  }

  const navItems = [
    { href: "/dashboard", icon: BarChart3, title: "Dashboard" },
    { href: "/dashboard/suppliers", icon: Users, title: "Suppliers" },
    { href: "/dashboard/drivers", icon: Truck, title: "Drivers" },
    { href: "/dashboard/inventory", icon: Warehouse, title: "Inventory" },
    { href: "/dashboard/distribution", icon: Package, title: "Distribution" },
    { href: "/dashboard/finances", icon: CreditCard, title: "Finances" },
    { href: "/dashboard/calculations", icon: Calculator, title: "Calculations" },
    { href: "/dashboard/tracking", icon: MapPin, title: "Tracking" },
    { href: "/dashboard/profile", icon: User, title: "Profile" },
  ]

  const sidebar = (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-green-800">
          <Leaf className="h-6 w-6 text-green-600" />
          <span>Falcon Tea Factory</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={item.title}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isMobile ? (
        <>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="left" className="w-64 p-0 bg-white">
              {sidebar}
            </SheetContent>
          </Sheet>
          <div className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px]">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Menu"
              className="lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center gap-2 font-semibold text-green-800">
              <Leaf className="h-6 w-6 text-green-600" />
              <span>Falcon Tea Factory</span>
            </div>
          </div>
        </>
      ) : (
        <div className="hidden lg:block lg:w-64 border-r bg-white">{sidebar}</div>
      )}
      <main className="flex-1">{children}</main>
    </div>
  )
}
