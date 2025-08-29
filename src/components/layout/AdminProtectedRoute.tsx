"use client"

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If not loading and either no user or not admin, redirect
    if (!loading) {
      if (!user) {
        // Not logged in - redirect to login
        router.push("/login?redirect=/admin")
      } else if (!profile?.is_admin) {
        // Logged in but not admin - redirect to home with error
        router.push("/?error=unauthorized")
      }
    }
  }, [user, profile, loading, router])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (!user || !profile?.is_admin) {
    return null
  }

  // User is admin, show the protected content
  return <>{children}</>
}