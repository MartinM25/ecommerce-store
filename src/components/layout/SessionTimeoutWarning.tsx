"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Clock } from "lucide-react";

interface SessionTimeoutWarningProps {
  isOpen: boolean
  timeRemaining: number
  onExtendSession: () => void
  onLogout: () => void
}

export function SessionTimeoutWarning({
  isOpen,
  timeRemaining,
  onExtendSession,
  onLogout
}: SessionTimeoutWarningProps) {
  const [countdown, setCountdown] = useState(timeRemaining)

  useEffect(() => {
    if (!isOpen) return

    setCountdown(timeRemaining)

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          onLogout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen, timeRemaining, onLogout])

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <DialogTitle>Session Expiring Soon</DialogTitle>
              <DialogDescription>
                Your session will expire due to inactivity
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-center justify-center py-6">
          <div className="flex items-center gap-2 text-2xl font-bold text-red-600">
            <Clock className="h-6 w-6" />
            {formatTime(countdown)}
          </div>
        </div>

        <div className="text-sm text-muted-foreground text-center">
          You will be automatically logged out in {formatTime(countdown)} for security reasons.
          Click "Stay Logged In" to extend your session.
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onLogout}
            className="flex-1"
          >
            Logout Now
          </Button>
          <Button
            onClick={onExtendSession}
            className="flex-1"
          >
            Stay Logged In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}