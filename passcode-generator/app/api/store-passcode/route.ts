import { setCurrentPasscode } from "@/lib/passcode"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { code, expiresAt } = await request.json()

    if (!code || !expiresAt) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Store the passcode
    setCurrentPasscode(code, expiresAt)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 })
  }
}
