import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Baby Land Employee Attendance System
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Track employee attendance with our secure check-in system
                </p>
              </div>
              <div className="w-full max-w-sm space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Employee Portal</CardTitle>
                    <CardDescription>Log in to check in for your shift</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Image
                      src="/logo.png"
                      alt="Baby Land Logo"
                      width={150}
                      height={150}
                      className="mx-auto rounded-full"
                    />
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href="/login">Employee Login</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
