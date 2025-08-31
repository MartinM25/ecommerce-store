"use client"

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface SessionManagerOptions {
  timeoutMinutes?: number
  warningMinutes?: number
  checkIntervalSeconds?: number
}

interface SessionState {
  isActive: boolean
  timeRemaining: number
  showWarning: boolean
}

export function useSessionManager({
  timeoutMinutes = 30,
  warningMinutes = 5,
  checkIntervalSeconds = 60
}: SessionManagerOptions = {}) {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  
  const [sessionState, setSessionState] = useState<SessionState>({
    isActive: true,
    timeRemaining: timeoutMinutes * 60,
    showWarning: false
  })

  const lastActivityRef = useRef<number>(Date.now())
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update last activity time
  const updateActivity = () => {
    lastActivityRef.current = Date.now()
    setSessionState(prev => ({
      ...prev,
      isActive: true,
      showWarning: false,
      timeRemaining: timeoutMinutes * 60
    }))
  }

  // Handle session timeout
  const handleTimeout = async () => {
    console.log('Session timed out, logging out...')
    setSessionState(prev => ({ ...prev, isActive: false }))
    await signOut()
    router.push('/login?reason=session-timeout')
  }

  // Show warning before timeout
  const showTimeoutWarning = () => {
    setSessionState(prev => ({ ...prev, showWarning: true }))
  }

  // Extend session
  const extendSession = () => {
    updateActivity()
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current)
      warningTimeoutRef.current = null
    }
  }

  // Check session validity and handle stuck loading states
  const checkSessionHealth = async () => {
    // If we've been loading for more than 10 seconds, something's wrong
    if (loading) {
      const loadingDuration = Date.now() - lastActivityRef.current
      if (loadingDuration > 10000) { // 10 seconds
        console.warn('Session appears stuck in loading state, forcing logout')
        await signOut()
        router.push('/login?reason=session-error')
        return
      }
    }

    if (!user) return

    const now = Date.now()
    const timeSinceLastActivity = (now - lastActivityRef.current) / 1000 // in seconds
    const timeRemaining = (timeoutMinutes * 60) - timeSinceLastActivity

    setSessionState(prev => ({
      ...prev,
      timeRemaining: Math.max(0, timeRemaining)
    }))

    // Check if session should timeout
    if (timeSinceLastActivity >= timeoutMinutes * 60) {
      await handleTimeout()
      return
    }

    // Check if we should show warning
    if (timeSinceLastActivity >= (timeoutMinutes - warningMinutes) * 60 && !sessionState.showWarning) {
      showTimeoutWarning()
      
      // Set timeout to auto-logout at the end of warning period
      warningTimeoutRef.current = setTimeout(handleTimeout, warningMinutes * 60 * 1000)
    }
  }

  // Set up activity listeners
  useEffect(() => {
    if (!user) return

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    const handleActivity = () => {
      updateActivity()
    }

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Set up session check interval
    timerRef.current = setInterval(checkSessionHealth, checkIntervalSeconds * 1000)

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current)
      }
    }
  }, [user, timeoutMinutes, warningMinutes, checkIntervalSeconds])

  // Initialize activity timestamp when user logs in
  useEffect(() => {
    if (user && !loading) {
      updateActivity()
    }
  }, [user, loading])

  return {
    ...sessionState,
    extendSession,
    forceLogout: handleTimeout,
    timeRemainingFormatted: formatTime(sessionState.timeRemaining)
  }
}

// Helper function to format time
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}