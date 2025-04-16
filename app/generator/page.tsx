"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { generatePasscode, storePasscode } from "@/lib/passcode"

export default function GeneratorPage() {
  const [passcode, setPasscode] = useState("")
  const [timeLeft, setTimeLeft] = useState(10)
  const [error, setError] = useState("")

  // Generate a new passcode and reset the timer
  async function refreshPasscode() {
    try {
      const newPasscode = generatePasscode()
      setPasscode(newPasscode)
      setTimeLeft(10)

      // Store the passcode with an expiration time
      const expiresAt = Date.now() + 10000 // 10 seconds
      await storePasscode(newPasscode, expiresAt)
    } catch (err) {
      setError("Failed to generate passcode")
    }
  }

  // Initial passcode generation
  useEffect(() => {
    refreshPasscode()

    // Set up the timer
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          refreshPasscode()
          return 10
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Passcode Generator</CardTitle>
            <CardDescription>Current passcode for employee check-in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-6xl font-bold tracking-wider">{passcode}</div>
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-secondary-foreground text-2xl font-bold">
                {timeLeft}
              </div>
              <p className="text-sm text-muted-foreground">Passcode refreshes in {timeLeft} seconds</p>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={refreshPasscode}>
              Refresh Now
            </Button>
            <Button variant="ghost" onClick={() => (window.location.href = "/passcode")}>
              Go to Check-In
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
