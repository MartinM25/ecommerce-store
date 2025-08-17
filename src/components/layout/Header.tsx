"use client"

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";

export default function Header() {
  const { user, profile, signOut, loading } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Store
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/products"
              className="text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Categories
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 animate-pulse bg-secondary-200 rounded-full"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-secondary-600">
                  Hello, {profile?.full_name || user.email}
                </span>
                
                {profile?.is_admin && (
                  <Link
                    href="/admin"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
                
                <Link
                  href="/account"
                  className="text-secondary-600 hover:text-secondary-900 text-sm font-medium"
                >
                  Account
                </Link>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}