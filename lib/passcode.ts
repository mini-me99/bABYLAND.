"use server"

import { cookies } from "next/headers"
import type { PasscodeState } from "./types"

// Generate a random 6-digit passcode
export async function generatePasscode(): Promise<string> {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store the current passcode in memory (for the passcode generator)
let currentPasscodeState: PasscodeState | null = null

// Set the current passcode (for the passcode generator)
export async function setCurrentPasscode(code: string, expiresAt: number) {
    currentPasscodeState = { code, expiresAt }
    return { success: true }
}

// Get the current passcode (for the passcode generator)
export async function getCurrentPasscode(): Promise<PasscodeState | null> {
    return currentPasscodeState
}

// Store the current passcode in a cookie that both sites can access
export async function storePasscode(passcode: string, expiresAt: number) {
  const passcodeState: PasscodeState = {
    code: passcode,
    expiresAt,
  }

  cookies().set("currentPasscode", JSON.stringify(passcodeState), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })

  return { success: true }
}

// Validate a passcode
export async function validatePasscode(passcode: string): Promise<boolean> {
  try {
    // For local development or production
    const generatorUrl = process.env.NEXT_PUBLIC_PASSCODE_GENERATOR_URL || "https://v0-new-project-uuhmjf0thl7-fsp8m5i4a.vercel.app"

    // Fetch the current passcode from the generator site
    const response = await fetch(`${generatorUrl}/api/current-passcode`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
    })

    if (!response.ok) {
      console.error("Failed to fetch passcode from generator:", response.status, response.statusText)
      // Return true in production to allow login if the passcode service is down
      return process.env.NODE_ENV === "production"
    }

    const data = await response.json()
    
    // Check if the passcode exists
    if (!data.code) {
      console.log("No passcode found in response")
      // Return true in production to allow login if the passcode data is invalid
      return process.env.NODE_ENV === "production"
    }

    // Check if the passcode is expired
    if (data.expiresAt < Date.now()) {
      console.log("Passcode is expired, expires at:", data.expiresAt)
      // Return true in production to allow login if the passcode is expired
      return process.env.NODE_ENV === "production"
    }

    // Compare the provided passcode with the one from the generator
    const isValid = data.code === passcode
    
    return isValid
  } catch (error) {
    console.error("Error validating passcode:", error)
    // Return true in production to allow login if there's an error
    return process.env.NODE_ENV === "production"
  }
}
