import { Clock, MapPin, MoreHorizontal, RefreshCw, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function TrackingPage() {
  // Mock data for active drivers
  const activeDrivers = [
    {
      id: "DRV001",
      name: "Ranjith Kumara",
      vehicle: "WP-KA-1234",
      route: "Route A - Nuwara Eliya",
      status: "Collecting",
      lastUpdate: "10 minutes ago",
      location: "Nuwara Eliya Central",
      collectionProgress: 65,
    },
    {
      id: "DRV002",
      name: "Lasith Malinga",
      vehicle: "WP-KB-2345",
      route: "Route B - Hatton",
      status: "Collecting",
      lastUpdate: "5 minutes ago",
      location: "Hatton East",
      collectionProgress: 42,
    },
    {
      id: "DRV004",
      name: "Sanath Jayasuriya",
      vehicle: "WP-KD-4567",
      route: "Route D - Badulla",
      status: "Returning",
      lastUpdate: "15 minutes ago",
      location: "Badulla Highway",
      collectionProgress: 100,
    },
    {
      id: "DRV005",
      name: "Muttiah Muralitharan",
      vehicle: "WP-KE-5678",
      route: "Route E - Ella",
      status: "Starting",
      lastUpdate: "2 minutes ago",
      location: "Factory Premises",
      collectionProgress: 0,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-green-800">Driver Tracking</h2>
          <p className="text-gray-500">Track driver locations and collection progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-gray-500">Currently on routes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Collecting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-gray-500">Drivers collecting leaves</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Returning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-gray-500">Drivers returning to factory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Starting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-gray-500">Drivers starting routes</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Live Tracking Map</CardTitle>
          <CardDescription>Real-time location of all active drivers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border h-[400px] bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Interactive map view of active drivers</p>
              <p className="text-xs text-gray-400 mb-2">
                In a real implementation, this would be an interactive map showing driver locations
              </p>
              <Button variant="outline" size="sm">
                Open Full Map
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Drivers</CardTitle>
          <CardDescription>Current status and location of drivers on routes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list">
            <TabsList className="mb-4">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left text-sm font-medium">Driver</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Vehicle</th>
                      <th className="py-3 px-4 text-left text-sm font-medium hidden md:table-cell">Route</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                      <th className="py-3 px-4 text-left text-sm font-medium hidden lg:table-cell">Last Update</th>
                      <th className="py-3 px-4 text-left text-sm font-medium">Progress</th>
                      <th className="py-3 px-4 text-right text-sm font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeDrivers.map((driver) => (
                      <tr key={driver.id} className="border-b">
                        <td className="py-3 px-4 text-sm">{driver.name}</td>
                        <td className="py-3 px-4 text-sm">{driver.vehicle}</td>
                        <td className="py-3 px-4 text-sm hidden md:table-cell">{driver.route}</td>
                        <td className="py-3 px-4 text-sm">
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
                        </td>
                        <td className="py-3 px-4 text-sm hidden lg:table-cell">
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3 text-gray-500" />
                            {driver.lastUpdate}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div
                                className="bg-green-600 h-2.5 rounded-full"
                                style={{ width: `${driver.collectionProgress}%` }}
                              ></div>
                            </div>
                            <span>{driver.collectionProgress}%</span>
                          </div>
                        </td>
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
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="grid" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {activeDrivers.map((driver) => (
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
                      <div className="pt-2">
                        <div className="text-sm mb-1">Collection Progress</div>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                              className="bg-green-600 h-2.5 rounded-full"
                              style={{ width: `${driver.collectionProgress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{driver.collectionProgress}%</span>
                        </div>
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
