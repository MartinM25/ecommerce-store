// app/admin/page.tsx - Main Admin Dashboard
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  Download,
  MoreHorizontal
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data based on your types
const mockStats = {
  totalRevenue: 324690,
  totalOrders: 2340,
  totalProducts: 1245,
  activeUsers: 12458,
  monthlyGrowth: {
    revenue: 12.5,
    orders: 8.2,
    products: 3.1,
    users: 15.3
  }
}

const mockRecentOrders = [
  {
    id: 1,
    order_number: "ORD-12847",
    user_id: "user-1",
    subtotal: 129.99,
    total_amount: 129.99,
    status: "shipped" as const,
    payment_status: "paid" as const,
    created_at: "2024-08-27T10:00:00Z",
    order_items: [{ product_name: "Wireless Headphones", quantity: 1 }]
  },
  {
    id: 2,
    order_number: "ORD-12846",
    user_id: "user-2",
    subtotal: 299.99,
    total_amount: 299.99,
    status: "processing" as const,
    payment_status: "paid" as const,
    created_at: "2024-08-27T09:30:00Z",
    order_items: [{ product_name: "Smart Watch", quantity: 1 }]
  },
  {
    id: 3,
    order_number: "ORD-12845",
    user_id: "user-3",
    subtotal: 89.99,
    total_amount: 89.99,
    status: "delivered" as const,
    payment_status: "paid" as const,
    created_at: "2024-08-26T15:20:00Z",
    order_items: [{ product_name: "Running Shoes", quantity: 1 }]
  }
]

const mockTopProducts = [
  { name: "Wireless Headphones", sales: 1240, revenue: 161160, growth: 12 },
  { name: "Smart Watch", sales: 890, revenue: 266910, growth: 8 },
  { name: "Running Shoes", sales: 720, revenue: 64728, growth: 15 },
  { name: "Coffee Maker", sales: 560, revenue: 111944, growth: 5 },
  { name: "Laptop Stand", sales: 440, revenue: 21956, growth: 22 }
]

type StatCardProps = {
  title: string;
  value: number | string;
  change: number;
  icon: React.ElementType;
  prefix?: string;
};

function StatCard({ title, value, change, icon: Icon, prefix = "" }: StatCardProps) {
  const isPositive = change >= 0
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <p className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
          <TrendingUp className="h-3 w-3" />
          {isPositive ? '+' : ''}{change}% from last month
        </p>
      </CardContent>
    </Card>
  )
}

function getOrderStatusBadge(status: string) {
  const variants = {
    pending: "secondary",
    paid: "default", 
    processing: "default",
    shipped: "default",
    delivered: "default",
    cancelled: "destructive",
    refunded: "outline"
  } as const
  
  return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>
}

export default function AdminDashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={mockStats.totalRevenue}
          change={mockStats.monthlyGrowth.revenue}
          icon={DollarSign}
          prefix="$"
        />
        <StatCard
          title="Total Orders"
          value={mockStats.totalOrders}
          change={mockStats.monthlyGrowth.orders}
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Products"
          value={mockStats.totalProducts}
          change={mockStats.monthlyGrowth.products}
          icon={Package}
        />
        <StatCard
          title="Active Users"
          value={mockStats.activeUsers}
          change={mockStats.monthlyGrowth.users}
          icon={Users}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Orders */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders from your store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRecentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm font-medium leading-none">{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.order_items[0]?.product_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className="text-sm font-medium">${order.total_amount}</p>
                          {getOrderStatusBadge(order.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best performing products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTopProducts.slice(0, 5).map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">${product.revenue.toLocaleString()}</p>
                        <p className="text-xs text-green-600">+{product.growth}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Orders Management</CardTitle>
                  <CardDescription>Manage all orders from your store</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search orders..." className="pl-8 w-[300px]" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRecentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>Customer #{order.user_id}</TableCell>
                      <TableCell>{order.order_items[0]?.product_name}</TableCell>
                      <TableCell>${order.total_amount}</TableCell>
                      <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                      <TableCell>{getOrderStatusBadge(order.payment_status)}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit order
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Cancel order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Detailed breakdown of your best-selling products</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Sales Count</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Growth</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTopProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sales}</TableCell>
                      <TableCell>${product.revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="text-green-600">+{product.growth}%</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View product
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Analytics</CardTitle>
                <CardDescription>Revenue and sales trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Chart component would go here (Recharts/Chart.js)
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Sales distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Pie chart component would go here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}