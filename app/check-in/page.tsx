"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getLoggedInEmployee, logoutEmployee } from "@/lib/auth"
import type { CheckIn } from "@/lib/types"

export default function CheckInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
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

  async function handleCheckIn() {
    if (!employee) return

    setIsSubmitting(true)
    setError("")

    try {
      const checkInData: CheckIn = {
        employeeId: employee.id,
        employeeName: employee.name,
        timestamp: new Date().toISOString(),
      }

      // Send data to Formspree
      const response = await fetch("https://formspree.io/f/xqapknen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkInData),
      })

      if (response.ok) {
        setSuccess(true)
      } else {
        setError("Failed to submit check-in. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleLogout() {
    setIsLoading(true)
    await logoutEmployee()
    router.push("/login")
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
            <CardTitle>Employee Check-In</CardTitle>
            <CardDescription>Record your attendance for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="font-medium">Employee: {employee.name}</p>
              <p className="text-sm text-muted-foreground">Email: {employee.email}</p>
              <p className="text-sm text-muted-foreground">Current Time: {new Date().toLocaleTimeString()}</p>
              <p className="text-sm text-muted-foreground">Date: {new Date().toLocaleDateString()}</p>
            </div>

            {success ? (
              <div className="rounded-lg bg-green-50 p-4 text-green-700">
                <p className="font-medium">Check-in successful!</p>
                <p className="text-sm">Your attendance has been recorded.</p>
              </div>
            ) : (
              <>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button onClick={handleCheckIn} className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Check In Now"}
                </Button>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/passcode")} size="sm">
              Back
            </Button>
            <Button variant="ghost" onClick={handleLogout} size="sm" disabled={isLoading}>
              Logout
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
