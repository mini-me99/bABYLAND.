// Generate a random 6-digit passcode
export function generatePasscode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store the current passcode in memory
let currentPasscode: { code: string; expiresAt: number } | null = null

// Get the current passcode
export function getCurrentPasscode() {
  return currentPasscode
}

// Set the current passcode
export function setCurrentPasscode(code: string, expiresAt: number) {
  currentPasscode = { code, expiresAt }
}

// Store the passcode (for compatibility)
export function storePasscode(code: string, expiresAt: number) {
  setCurrentPasscode(code, expiresAt)
  return { success: true }
}
