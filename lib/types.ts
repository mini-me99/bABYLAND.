// Shared types between both applications
export interface Employee {
  id: string
  email: string
  name: string
  password: string // In a real app, this would be hashed
}

export interface CheckIn {
  employeeId: string
  employeeName: string
  timestamp: string
}

export interface PasscodeState {
  code: string
  expiresAt: number
}
