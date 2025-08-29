"use client"

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Real data interfaces
interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  activeUsers: number
}

interface RecentOrder {
  id: string
  order_number: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
  profiles: {
    full_name: string
    email: string
  }
  order_items: {
    products: {
      name: string
    }
    quantity: number
  }[]
}

interface TopProduct {
  id: string
  name: string
  price: number
  sales_count: number
  total_revenue: number
}

type StatCardProps = {
  title: string;
  value: number | string;
  change: number;
  icon: React.ElementType;
  prefix?: string;
  loading?: boolean;
};

function StatCard({ title, value, change, icon: Icon, prefix = "", loading = false }: StatCardProps) {
  const isPositive = change >= 0
  
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
          <div className="text-xs animate-pulse bg-gray-200 h-4 w-32 rounded mt-2"></div>
        </CardContent>
      </Card>
    )
  }
  
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
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    activeUsers: 0
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all data in parallel
      const [
        productsResponse,
        ordersResponse,
        usersResponse,
        recentOrdersResponse,
        topProductsResponse
      ] = await Promise.all([
        // Total products
        supabase.from('products').select('id', { count: 'exact' }),
        
        // Total orders and revenue
        supabase.from('orders').select('id, total_amount', { count: 'exact' }),
        
        // Total users
        supabase.from('profiles').select('id', { count: 'exact' }),
        
        // Recent orders with user info and products
        supabase
          .from('orders')
          .select(`
            id,
            order_number,
            total_amount,
            status,
            payment_status,
            created_at,
            profiles!orders_user_id_fkey(full_name, email),
            order_items(
              quantity,
              products(name)
            )
          `)
          .order('created_at', { ascending: false })
          .limit(10),

        // Top products by sales (you'll need to create a view or function for this)
        supabase
          .from('products')
          .select(`
            id,
            name,
            price,
            order_items(quantity)
          `)
          .limit(5)
      ])

      // Calculate stats
      const totalProducts = productsResponse.count || 0
      const totalOrders = ordersResponse.count || 0
      const totalUsers = usersResponse.count || 0
      
      // Calculate total revenue
      const totalRevenue = ordersResponse.data?.reduce(
        (sum, order) => sum + (order.total_amount || 0), 0
      ) || 0

      // Process top products (calculate sales from order_items)
      const processedTopProducts = topProductsResponse.data?.map(product => {
        const salesCount = product.order_items?.reduce(
          (sum, item) => sum + (item.quantity || 0), 0
        ) || 0
        
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          sales_count: salesCount,
          total_revenue: salesCount * product.price
        }
      }).sort((a, b) => b.sales_count - a.sales_count) || []

      setStats({
        totalRevenue,
        totalOrders,
        totalProducts,
        activeUsers: totalUsers
      })

      setRecentOrders(
        (recentOrdersResponse.data || []).map((order: any) => ({
          ...order,
          profiles: Array.isArray(order.profiles) ? order.profiles[0] : order.profiles,
          order_items: (order.order_items || []).map((item: any) => ({
            ...item,
            products: Array.isArray(item.products) ? item.products[0] : item.products,
          })),
        }))
      )
      setTopProducts(processedTopProducts)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

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
          value={stats.totalRevenue}
          change={12.5} // You can calculate this based on previous month data
          icon={DollarSign}
          prefix="$"
          loading={loading}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change={8.2}
          icon={ShoppingCart}
          loading={loading}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          change={3.1}
          icon={Package}
          loading={loading}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          change={15.3}
          icon={Users}
          loading={loading}
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
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between space-x-4">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-sm font-medium leading-none">{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.profiles?.full_name || 'Unknown Customer'} • {order.order_items?.[0]?.products?.name || 'No items'}
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
                ) : (
                  <p className="text-muted-foreground">No orders yet</p>
                )}
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best performing products</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : topProducts.length > 0 ? (
                  <div className="space-y-4">
                    {topProducts.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sales_count} sales</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">${product.total_revenue.toLocaleString()}</p>
                          <p className="text-xs text-green-600">Active</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No product data available</p>
                )}
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
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div></TableCell>
                      </TableRow>
                    ))
                  ) : recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.order_number}</TableCell>
                      <TableCell>{order.profiles?.full_name || 'Unknown'}</TableCell>
                      <TableCell>{order.order_items?.[0]?.products?.name || 'No items'}</TableCell>
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
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div></TableCell>
                      </TableRow>
                    ))
                  ) : topProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sales_count}</TableCell>
                      <TableCell>${product.total_revenue.toLocaleString()}</TableCell>
                      <TableCell>${product.price}</TableCell>
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