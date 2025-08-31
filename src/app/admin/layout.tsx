"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useSessionManager } from "@/hooks/useSessionManager";
import { SessionTimeoutWarning } from "@/components/layout/SessionTimeoutWarning";
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  Tags,
  FileText,
  CreditCard,
  Truck,
  Shield,
  Home,
  Clock
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode
}

interface NavigationCounts {
  pendingOrders: number
  totalProducts: number
  totalCustomers: number
  pendingPayments: number
}

const getNavigation = (counts: NavigationCounts) => [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: Home,
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
    badge: counts.pendingOrders > 0 ? counts.pendingOrders.toString() : undefined
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: Package,
    badge: counts.totalProducts > 0 ? counts.totalProducts.toString() : undefined
  },
  {
    name: 'Categories',
    href: '/admin/categories',
    icon: Tags,
  },
  {
    name: 'Customers',
    href: '/admin/customers',
    icon: Users,
    badge: counts.totalCustomers > 0 ? counts.totalCustomers.toString() : undefined
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: FileText,
  },
  {
    name: 'Payments',
    href: '/admin/payments',
    icon: CreditCard,
    badge: counts.pendingPayments > 0 ? counts.pendingPayments.toString() : undefined
  },
  {
    name: 'Shipping',
    href: '/admin/shipping',
    icon: Truck,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

function Sidebar({ className = "", navigationCounts }: { className?: string, navigationCounts: NavigationCounts }) {
  const pathname = usePathname()
  const navigation = getNavigation(navigationCounts)

  return (
    <div className={`pb-12 ${className}`}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Admin Panel
          </div>
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                    {item.badge && (
                      <Badge className="ml-auto h-5 w-5 shrink-0 items-center justify-center rounded-full p-0 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminHeader({ notificationCount, sessionTimeRemaining }: {
  notificationCount: number
  sessionTimeRemaining: string
}) {
  const { profile, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <div className="flex items-center space-x-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <div className="pb-12">
                  <div className="space-y-4 py-4">
                    <div className="px-3 py-2">
                      <div className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Admin Panel
                      </div>
                      <div className="space-y-1">
                        {getNavigation({
                          pendingOrders: 0,
                          totalProducts: 0,
                          totalCustomers: 0,
                          pendingPayments: 0
                        }).map((item) => {
                          const pathname = usePathname()
                          const isActive = pathname === item.href
                          return (
                            <Link key={item.href} href={item.href}>
                              <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className="w-full justify-start"
                              >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.name}
                              </Button>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div className="hidden md:flex">
              <Link href="/admin" className="flex items-center space-x-2">
                <Shield className="h-6 w-6" />
                <span className="hidden font-bold sm:inline-block">
                  Store Admin
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products, orders..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              />
            </div>
          </div>

          {/* Session Timer */}
          <div className="hidden sm:flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {sessionTimeRemaining}
          </div>

          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
                {notificationCount > 99 ? '99+' : notificationCount}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <User className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {profile?.full_name || 'Admin Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

// Admin Protection Component
function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [protectionTimeout, setProtectionTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Clear existing timeout
    if (protectionTimeout) {
      clearTimeout(protectionTimeout)
    }

    // Set a maximum loading time of 15 seconds
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('Admin protection timed out, redirecting to login')
        router.push('/login?reason=protection-timeout')
      }
    }, 15000)

    setProtectionTimeout(timeout)

    // Handle protection logic
    if (!loading) {
      if (protectionTimeout) {
        clearTimeout(protectionTimeout)
        setProtectionTimeout(null)
      }

      if (!user) {
        router.push("/login?redirect=/admin")
      } else if (!profile?.is_admin) {
        router.push("/?error=unauthorized")
      }
    }

    return () => {
      if (protectionTimeout) {
        clearTimeout(protectionTimeout)
      }
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">
            Verifying admin access...
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            This shouldn't take more than a few seconds
          </p>
        </div>
      </div>
    )
  }

  if (!user || !profile?.is_admin) {
    return null
  }

  return <>{children}</>
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [navigationCounts, setNavigationCounts] = useState<NavigationCounts>({
    pendingOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingPayments: 0
  })
  const [notificationCount, setNotificationCount] = useState(0)
  const supabase = createClient()

  // Session management with 30-minute timeout, 5-minute warning
  const {
    showWarning,
    timeRemainingFormatted,
    extendSession,
    forceLogout
  } = useSessionManager({
    timeoutMinutes: 30,
    warningMinutes: 5,
    checkIntervalSeconds: 30
  })

  useEffect(() => {
    fetchNavigationCounts()

    // Refresh counts every 5 minutes
    const interval = setInterval(fetchNavigationCounts, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchNavigationCounts = async () => {
    try {
      // Fetch counts for navigation badges
      const [
        pendingOrdersResponse,
        productsResponse,
        customersResponse,
        pendingPaymentsResponse
      ] = await Promise.all([
        // Pending orders count
        supabase
          .from('orders')
          .select('id', { count: 'exact' })
          .in('status', ['pending', 'processing']),

        // Total products count
        supabase
          .from('products')
          .select('id', { count: 'exact' }),

        // Total customers count
        supabase
          .from('profiles')
          .select('id', { count: 'exact' })
          .eq('is_admin', false),

        // Pending payments count
        supabase
          .from('orders')
          .select('id', { count: 'exact' })
          .eq('payment_status', 'pending')
      ])

      const pendingOrders = pendingOrdersResponse.count || 0
      const totalProducts = productsResponse.count || 0
      const totalCustomers = customersResponse.count || 0
      const pendingPayments = pendingPaymentsResponse.count || 0

      setNavigationCounts({
        pendingOrders,
        totalProducts,
        totalCustomers,
        pendingPayments
      })

      // Calculate total notifications (pending orders + pending payments + low stock items)
      const totalNotifications = pendingOrders + pendingPayments

      // You can add low stock products to notifications
      const { count: lowStockCount } = await supabase
        .from('products')
        .select('id', { count: 'exact' })
        .lte('stock_quantity', 10)

      setNotificationCount(totalNotifications + (lowStockCount || 0))

    } catch (error) {
      console.error('Error fetching navigation counts:', error)
    }
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-background">
        <AdminHeader 
          notificationCount={notificationCount} 
          sessionTimeRemaining={timeRemainingFormatted}
        />
        <div className="container mx-auto flex">
          <aside className="hidden w-64 shrink-0 border-r md:block">
            <Sidebar navigationCounts={navigationCounts} />
          </aside>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>

      {/* Session Timeout Warning Modal */}
      <SessionTimeoutWarning
        isOpen={showWarning}
        timeRemaining={300} // 5 minutes in seconds
        onExtendSession={extendSession}
        onLogout={forceLogout}
      />
    </AdminProtectedRoute>
  )
}