import {
  ArrowUpRight,
  Leaf,
  Package,
  Truck,
  Users,
  Warehouse,
  TrendingUp,
  AlertTriangle,
  Calendar,
  MapPin,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-green-800">Dashboard</h2>
          <p className="text-gray-500">Welcome back, Admin</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Suppliers</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-gray-500">
              <span className="text-green-500 inline-flex items-center">
                +6% <TrendingUp className="ml-1 h-3 w-3" />
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Drivers</CardTitle>
            <Truck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500">
              <span className="text-green-500 inline-flex items-center">
                +2 <TrendingUp className="ml-1 h-3 w-3" />
              </span>{" "}
              new this week
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tea Collection</CardTitle>
            <Leaf className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284 kg</div>
            <p className="text-xs text-gray-500">
              <span className="text-green-500 inline-flex items-center">
                +12% <TrendingUp className="ml-1 h-3 w-3" />
              </span>{" "}
              from yesterday
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Inventory Value</CardTitle>
            <Warehouse className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. 4.2M</div>
            <p className="text-xs text-gray-500">
              <span className="text-amber-500 inline-flex items-center">
                -2% <TrendingUp className="ml-1 h-3 w-3 rotate-180" />
              </span>{" "}
              from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Tea Collection Overview</CardTitle>
            <CardDescription>Daily collection amounts for the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-end justify-between gap-2">
              {[65, 72, 84, 78, 90, 86, 95].map((value, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  <div className="w-12 bg-green-600 rounded-t-md" style={{ height: `${value * 2}px` }}></div>
                  <span className="text-xs mt-2">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</span>
                  <span className="text-xs text-gray-500">{value}kg</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
            <CardDescription>Recent system alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-lg border p-3">
                <AlertTriangle className="mt-1 h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Low Fertilizer Stock</p>
                  <p className="text-xs text-gray-500">NPK Fertilizer is running low (15 units left)</p>
                  <div className="mt-2">
                    <Button variant="outline" size="sm">
                      Order More
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border p-3">
                <AlertTriangle className="mt-1 h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Loan Payment Due</p>
                  <p className="text-xs text-gray-500">5 suppliers have loan payments due this week</p>
                  <div className="mt-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg border p-3">
                <AlertTriangle className="mt-1 h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Advance Payment Reminder</p>
                  <p className="text-xs text-gray-500">Supplier advances due on 25th (3 days remaining)</p>
                  <div className="mt-2">
                    <Button variant="outline" size="sm">
                      Prepare Advances
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <Tabs defaultValue="suppliers">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <TabsList>
                  <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
                  <TabsTrigger value="drivers">Drivers</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="suppliers" className="space-y-4 mt-4">
                <div className="grid gap-2">
                  {[
                    { name: "Kamal Perera", action: "Added 45kg of tea leaves", time: "2 hours ago" },
                    { name: "Nimal Silva", action: "Requested a loan of Rs. 25,000", time: "4 hours ago" },
                    { name: "Sunil Fernando", action: "Received advance payment of Rs. 10,000", time: "Yesterday" },
                    { name: "Amal Jayawardena", action: "Updated contact information", time: "Yesterday" },
                    { name: "Saman Kumara", action: "Added 62kg of tea leaves", time: "2 days ago" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
                          <Users className="h-5 w-5 text-green-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.action}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{item.time}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="drivers" className="space-y-4 mt-4">
                <div className="grid gap-2">
                  {[
                    { name: "Ranjith Kumara", action: "Completed Route A collection", time: "1 hour ago" },
                    { name: "Lasith Malinga", action: "Started Route B collection", time: "3 hours ago" },
                    { name: "Chaminda Vaas", action: "Delivered 200kg of tea leaves", time: "Yesterday" },
                    { name: "Sanath Jayasuriya", action: "Vehicle maintenance scheduled", time: "Yesterday" },
                    { name: "Muttiah Muralitharan", action: "Updated contact information", time: "2 days ago" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                          <Truck className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.action}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{item.time}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="inventory" className="space-y-4 mt-4">
                <div className="grid gap-2">
                  {[
                    { name: "Tea Packets", action: "200 units added to inventory", time: "5 hours ago" },
                    { name: "NPK Fertilizer", action: "50 units distributed to suppliers", time: "Yesterday" },
                    { name: "Organic Fertilizer", action: "New stock of 500kg received", time: "Yesterday" },
                    { name: "Tea Packets", action: "Price updated to Rs. 700", time: "3 days ago" },
                    { name: "Urea Fertilizer", action: "30 units distributed to suppliers", time: "4 days ago" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
                          <Package className="h-5 w-5 text-amber-700" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.action}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{item.time}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Monthly Targets</CardTitle>
            <CardDescription>Progress towards monthly goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Tea Collection</div>
                <div className="text-sm text-gray-500">18,500 / 25,000 kg</div>
              </div>
              <Progress value={74} className="h-2" />
              <div className="text-xs text-gray-500">74% of monthly target</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Supplier Payments</div>
                <div className="text-sm text-gray-500">Rs. 3.2M / Rs. 4.5M</div>
              </div>
              <Progress value={71} className="h-2" />
              <div className="text-xs text-gray-500">71% of monthly budget</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Tea Packet Sales</div>
                <div className="text-sm text-gray-500">8,200 / 10,000 units</div>
              </div>
              <Progress value={82} className="h-2" />
              <div className="text-xs text-gray-500">82% of monthly target</div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Fertilizer Distribution</div>
                <div className="text-sm text-gray-500">450 / 600 units</div>
              </div>
              <Progress value={75} className="h-2" />
              <div className="text-xs text-gray-500">75% of monthly target</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Users className="h-5 w-5 mb-1" />
                <span className="text-xs">Add Supplier</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Truck className="h-5 w-5 mb-1" />
                <span className="text-xs">Add Driver</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Package className="h-5 w-5 mb-1" />
                <span className="text-xs">Update Inventory</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <ArrowUpRight className="h-5 w-5 mb-1" />
                <span className="text-xs">Generate Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Drivers Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border h-[200px] bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Map view of active drivers</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Open Full Map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
