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
  checkIntervalSeconds = 30 // Changed from 60 to 30 for more responsive updates
}: SessionManagerOptions = {}) {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  
  const [sessionState, setSessionState] = useState<SessionState>({
    isActive: true,
    timeRemaining: timeoutMinutes * 60,
    showWarning: false
  })

  const lastActivityRef = useRef<number>(0) // Initialize to 0
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const sessionInitializedRef = useRef<boolean>(false) // Track if session was properly initialized

  // Update last activity time
  const updateActivity = () => {
    const now = Date.now()
    lastActivityRef.current = now
    
    // Clear any existing warning timeout
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current)
      warningTimeoutRef.current = null
    }
    
    setSessionState(prev => ({
      ...prev,
      isActive: true,
      showWarning: false,
      timeRemaining: timeoutMinutes * 60
    }))

    console.log('Activity updated:', new Date(now).toISOString())
  }

  // Handle session timeout
  const handleTimeout = async () => {
    console.log('Session timed out, logging out...')
    setSessionState(prev => ({ ...prev, isActive: false }))
    
    // Clear timers
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current)
      warningTimeoutRef.current = null
    }
    
    await signOut()
    router.push('/login?reason=session-timeout')
  }

  // Show warning before timeout
  const showTimeoutWarning = () => {
    console.log('Showing session timeout warning')
    setSessionState(prev => ({ ...prev, showWarning: true }))
    
    // Set timeout to auto-logout at the end of warning period
    warningTimeoutRef.current = setTimeout(handleTimeout, warningMinutes * 60 * 1000)
  }

  // Extend session
  const extendSession = () => {
    console.log('Session extended by user')
    updateActivity()
  }

  // Check session validity
  const checkSessionHealth = async () => {
    // Skip if no user or session not initialized
    if (!user || !sessionInitializedRef.current || lastActivityRef.current === 0) {
      return
    }

    // If we've been loading for more than 10 seconds, something's wrong
    if (loading) {
      const loadingDuration = Date.now() - lastActivityRef.current
      if (loadingDuration > 10000) { // 10 seconds
        console.warn('Session appears stuck in loading state, forcing logout')
        await handleTimeout()
        return
      }
    }

    const now = Date.now()
    const timeSinceLastActivity = (now - lastActivityRef.current) / 1000 // in seconds
    const timeRemaining = Math.max(0, (timeoutMinutes * 60) - timeSinceLastActivity)

    console.log('Session check:', {
      timeSinceLastActivity: Math.floor(timeSinceLastActivity),
      timeRemaining: Math.floor(timeRemaining),
      timeoutMinutes,
      warningMinutes,
      shouldShowWarning: timeSinceLastActivity >= (timeoutMinutes - warningMinutes) * 60,
      currentlyShowingWarning: sessionState.showWarning
    })

    setSessionState(prev => ({
      ...prev,
      timeRemaining: Math.floor(timeRemaining)
    }))

    // Check if session should timeout
    if (timeSinceLastActivity >= timeoutMinutes * 60) {
      console.log('Session timeout threshold reached')
      await handleTimeout()
      return
    }

    // Check if we should show warning
    const shouldShowWarning = timeSinceLastActivity >= (timeoutMinutes - warningMinutes) * 60
    if (shouldShowWarning && !sessionState.showWarning) {
      showTimeoutWarning()
    }
  }

  // Initialize session when user logs in
  useEffect(() => {
    if (user && !loading && !sessionInitializedRef.current) {
      console.log('Initializing session for user:', user.id)
      sessionInitializedRef.current = true
      updateActivity() // This sets lastActivityRef.current to current time
    } else if (!user) {
      // Reset session state when user logs out
      sessionInitializedRef.current = false
      lastActivityRef.current = 0
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current)
        warningTimeoutRef.current = null
      }
    }
  }, [user, loading])

  // Set up activity listeners and session checking
  useEffect(() => {
    if (!user || !sessionInitializedRef.current) return

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

    console.log('Session manager initialized with:', {
      timeoutMinutes,
      warningMinutes,
      checkIntervalSeconds,
      userId: user.id
    })

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current)
        warningTimeoutRef.current = null
      }
    }
  }, [user, sessionInitializedRef.current, timeoutMinutes, warningMinutes, checkIntervalSeconds])

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