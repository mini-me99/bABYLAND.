"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getLoggedInEmployee } from "@/lib/auth"
import { validatePasscode } from "@/lib/passcode"

export default function PasscodePage() {
  const router = useRouter()
  const [passcode, setPasscode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [employee, setEmployee] = useState<{ id: string; name: string; email: string } | null>(null)

  useEffect(() => {
    async function checkAuth() {
      const emp = await getLoggedInEmployee()
      if (!emp) {
        router.push("/login")
        return
      }
      setEmployee(emp)
    }

    checkAuth()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const isValid = await validatePasscode(passcode)

      if (isValid && employee) {
        router.push("/check-in")
      } else {
        setError("Invalid or expired passcode. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!employee) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Enter Passcode</CardTitle>
            <CardDescription>Enter the 6-digit passcode displayed at your workplace</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passcode">6-Digit Passcode</Label>
                <Input
                  id="passcode"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  The passcode is only available at your workplace and refreshes every 20 seconds
                </p>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify Passcode"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" onClick={() => router.push("/login")} size="sm">
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
