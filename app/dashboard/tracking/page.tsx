"use client"

import React, { useEffect, useState, useRef, useCallback } from "react"
import Pusher from "pusher-js"
import {
  Clock,
  MapPin,
  MoreHorizontal,
  Truck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"

import "leaflet/dist/leaflet.css"

// Fix leaflet icon paths for marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
})

interface Driver {
  id: string
  name: string
  vehicle: string
  route: string
  status: string
  lastUpdate: string
  location: string
}

const defaultCenter: [number, number] = [7.8731, 80.7718] // Sri Lanka center

export default function TrackingPage() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)

  const pusherRef = useRef<Pusher | null>(null)

  useEffect(() => {
    async function fetchDrivers() {
      setLoading(true)
      try {
        const res = await fetch(
          "https://backend-production-f1ac.up.railway.app/api/driver/AllDrivers"
        )
        if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`)
        const data = await res.json()

        const initializedDrivers: Driver[] = data.map((d: any) => ({
          id: String(d.D_RegisterID || d.id || ""),
          name: d.D_FullName || d.name || "Unknown",
          vehicle: d.VehicalNumber || d.vehicle || "Unknown",
          route: d.Route || d.route || "Unknown",
          status: d.Status || d.status || "Unknown",
          location:
            d.Latitude != null && d.Longitude != null
              ? `Lat: ${Number(d.Latitude).toFixed(5)}, Lon: ${Number(d.Longitude).toFixed(5)}`
              : "Unknown",
          lastUpdate: d.LastUpdated || "Never",
        }))

        setDrivers(initializedDrivers)
        if (initializedDrivers.length > 0) {
          setSelectedDriverId(initializedDrivers[0].id)
        }
      } catch (error) {
        console.error("Error fetching drivers:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDrivers()
  }, [])

  useEffect(() => {
    if (!pusherRef.current) {
      pusherRef.current = new Pusher("04b459376799d9c622c3", {
        cluster: "ap2",
        authEndpoint: "https://backend-production-f1ac.up.railway.app/pusher/auth",
      })
    }

    const pusher = pusherRef.current
    const channel = pusher.subscribe("private-drivers")

    channel.bind(
      "driver-location-update",
      (data: { driverId: string; latitude: number; longitude: number }) => {
        setDrivers((prev) =>
          prev.map((d) => {
            if (String(d.id) === String(data.driverId)) {
              return {
                ...d,
                location: `Lat: ${data.latitude.toFixed(5)}, Lon: ${data.longitude.toFixed(5)}`,
                lastUpdate: new Date().toLocaleTimeString(),
                status: "Collecting",
              }
            }
            return d
          })
        )
      }
    )

    return () => {
      channel.unbind_all()
      pusher.unsubscribe("private-drivers")
    }
  }, [])

  useEffect(() => {
    if (!selectedDriverId) {
      setSelectedDriver(null)
      return
    }
    const driver = drivers.find((d) => d.id === selectedDriverId) || null
    setSelectedDriver(driver)
  }, [drivers, selectedDriverId])

  const handleDriverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDriverId(e.target.value)
  }

  const parseLocation = useCallback((locStr: string): [number, number] | null => {
    if (!locStr || locStr === "Unknown") return null
    const regex = /Lat:\s*([-\d.]+),\s*Lon:\s*([-\d.]+)/
    const match = locStr.match(regex)
    if (!match) return null
    return [parseFloat(match[1]), parseFloat(match[2])]
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-green-800">Driver Tracking</h2>
      </div>

      <div className="mb-4">
        <label htmlFor="driverSelect" className="block mb-2 font-semibold">Select Driver:</label>
        <select
          id="driverSelect"
          className="p-2 border rounded w-full max-w-xs"
          onChange={handleDriverChange}
          value={selectedDriverId || ""}
          disabled={loading || drivers.length === 0}
        >
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.name} ({driver.vehicle}) - {driver.route}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Location</CardTitle>
          <CardDescription>
            {selectedDriver
              ? `Showing live location for ${selectedDriver.name}`
              : "Select a driver to see location"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDriver ? (() => {
            const coords = parseLocation(selectedDriver.location) ?? defaultCenter
            return (
              <MapContainer
                key={selectedDriver.id}
                center={coords}
                zoom={12}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {coords && (
                  <Marker position={coords}>
                    <Popup>
                      <strong>{selectedDriver.name}</strong>
                      <br />
                      Route: {selectedDriver.route}
                      <br />
                      Last update: {selectedDriver.lastUpdate}
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            )
          })() : (
            <p>Please select a driver to see live location.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Drivers</CardTitle>
          <CardDescription>Current status and location of all drivers</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list">
            <TabsList className="mb-4">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left text-sm font-medium">Driver</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Vehicle</th>
                      <th className="py-3 px-4 text-left text-sm font-medium hidden md:table-cell">Route</th>
                      {/* <th className="py-3 px-4 text-left text-sm font-medium">Status</th> */}
                      <th className="py-3 px-4 text-left text-sm font-medium hidden lg:table-cell">Last Update</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Location</th>
                      <th className="py-3 px-4 text-right text-sm font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8">Loading drivers...</td>
                      </tr>
                    ) : drivers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8">No drivers found.</td>
                      </tr>
                    ) : (
                      drivers.map((driver) => (
                        <tr key={driver.id} className="border-b">
                          <td className="py-3 px-4 text-sm">{driver.name}</td>
                          <td className="py-3 px-4 text-sm">{driver.vehicle}</td>
                          <td className="py-3 px-4 text-sm hidden md:table-cell">{driver.route}</td>
                          {/* <td className="py-3 px-4 text-sm">
                            <Badge
                              variant="secondary"
                              className={
                                driver.status === "Collecting"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : driver.status === "Returning"
                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                  : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                              }
                            >
                              {driver.status}
                            </Badge>
                          </td> */}
                          <td className="py-3 px-4 text-sm hidden lg:table-cell">
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3 text-gray-500" />
                              {driver.lastUpdate}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{driver.location}</td>
                          <td className="py-3 px-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Contact Driver</DropdownMenuItem>
                                <DropdownMenuItem>View Route</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="grid" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {drivers.map((driver) => (
                  <Card key={driver.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{driver.name}</CardTitle>
                          <CardDescription>{driver.vehicle}</CardDescription>
                        </div>
                        <Badge
                          variant="secondary"
                          className={
                            driver.status === "Collecting"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : driver.status === "Returning"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          }
                        >
                          {driver.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Truck className="mr-2 h-4 w-4 text-gray-500" />
                        <span>{driver.route}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                        <span>{driver.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-gray-500" />
                        <span>Last update: {driver.lastUpdate}</span>
                      </div>
                      <div className="pt-2 flex justify-end">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
