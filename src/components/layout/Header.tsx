"use client"

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { ShoppingCart, User, Search, LogOut } from "lucide-react";

export default function Header() {
  const { user, profile, signOut, loading } = useAuth()

  console.log("Header Debug:", { 
    user: !!user, 
    profile: !!profile, 
    loading,
    userEmail: user?.email,
    profileName: profile?.full_name 
  })

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-2xl font-bold text-primary-600"
            >
              TheGrowthClub
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-secondary-500 rounded-md leading-5 bg-secondary-500 text-white placeholder-white placeholder-opacity-80 focus:outline-none focus:placeholder-white focus:placeholder-opacity-60 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 focus:bg-secondary-600 text-sm"
              />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link 
              href="/cart"
              className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-full transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
            </Link>

            {/* Profile/Auth Section */}
            {loading ? (
              <div className="w-10 h-10 animate-pulse bg-secondary-200 rounded-full"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    <User className="h-6 w-6 fill-current" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{profile?.full_name || 'User'}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  {profile?.is_admin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer text-primary-600">
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={signOut}
                    className="cursor-pointer text-red-600 focus:text-red-700"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Unfilled User Icon for non-logged in users */
              <Link 
                href="/login"
                className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-full transition-colors"
              >
                <User className="h-6 w-6" />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Top row - Logo and Icons */}
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link 
                href="/" 
                className="text-xl font-bold text-primary-600"
              >
                TheGrowthClub
              </Link>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              <Link 
                href="/cart"
                className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-full transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
              </Link>

              {/* Profile/Auth Section */}
              {loading ? (
                <div className="w-10 h-10 animate-pulse bg-secondary-200 rounded-full"></div>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                      <User className="h-6 w-6 fill-current" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end">
                    <DropdownMenuLabel>
                      <div>
                        <p className="font-medium">{profile?.full_name || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer">
                        Account Settings
                      </Link>
                    </DropdownMenuItem>
                    {profile?.is_admin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer text-primary-600">
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={signOut}
                      className="cursor-pointer text-red-600 focus:text-red-700"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                /* Unfilled User Icon for non-logged in users */
                <Link 
                  href="/login"
                  className="p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-full transition-colors"
                >
                  <User className="h-6 w-6" />
                </Link>
              )}
            </div>
          </div>

          {/* Bottom row - Search Bar */}
          <div className="pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-secondary-500 rounded-md leading-5 bg-secondary-500 placeholder-opacity-80 focus:outline-none focus:placeholder-white focus:placeholder-opacity-60 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 focus:bg-secondary-600 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}