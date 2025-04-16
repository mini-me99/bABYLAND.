import { getCurrentPasscode } from "@/lib/passcode"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const passcode = getCurrentPasscode()

    if (!passcode) {
      return NextResponse.json({ success: false, error: "No passcode available" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      passcode: passcode.code,
      expiresAt: passcode.expiresAt,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 })
  }
}
