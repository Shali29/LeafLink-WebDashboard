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
          <p className="text-gray-500">Welcome, Admin</p>
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
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Drivers</CardTitle>
            <Truck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tea Collection</CardTitle>
            <Leaf className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284 kg</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Inventory Value</CardTitle>
            <Warehouse className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. 4M</div>
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
                <div className="text-sm font-medium">Fertilizer Sales</div>
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
      </div>
    </div>
  )
}
