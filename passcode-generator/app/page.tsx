"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { generatePasscode } from "@/lib/passcode"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function GeneratorPage() {
  const [passcode, setPasscode] = useState("")
  const [timeLeft, setTimeLeft] = useState(20)
  const [error, setError] = useState("")

  // Generate a new passcode and reset the timer
  async function refreshPasscode() {
    try {
      const newPasscode = generatePasscode()
      setPasscode(newPasscode)
      setTimeLeft(20)

      // Store the passcode with an expiration time
      const expiresAt = Date.now() + 20000 // 20 seconds

      // Store locally
      await fetch("/api/store-passcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: newPasscode, expiresAt }),
      })
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
          return 20
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
        <div className="w-full max-w-md space-y-4">
          <Alert variant="default" className="bg-yellow-50 border-yellow-200">
            <InfoIcon className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Workplace Display Only</AlertTitle>
            <AlertDescription className="text-yellow-700">
              This screen should only be displayed at your workplace. Employees must be physically present to see the
              passcode.
            </AlertDescription>
          </Alert>

          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Image src="/logo.png" alt="Baby Land Logo" width={80} height={80} className="rounded-full" />
              </CardTitle>
              <CardTitle className="text-center">Passcode Generator</CardTitle>
              <CardDescription className="text-center">Current passcode for employee check-in</CardDescription>
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

              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Instructions:</p>
                <ol className="text-xs text-muted-foreground list-decimal pl-4 space-y-1">
                  <li>Display this screen in a visible location at your workplace</li>
                  <li>Employees must use the current passcode to check in</li>
                  <li>The passcode changes every 20 seconds</li>
                  <li>Employees must be physically present to see the passcode</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={refreshPasscode}>
                Refresh Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
