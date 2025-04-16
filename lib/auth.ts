"use server"

import { cookies } from "next/headers"
import type { Employee } from "./types"
import fs from "fs"
import path from "path"

// File path for storing employee data
const EMPLOYEES_FILE = path.join(process.cwd(), "data", "employees.json")

// Ensure the data directory exists
function ensureDataDirectoryExists() {
  const dataDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Load employees from file
function loadEmployees(): Employee[] {
  ensureDataDirectoryExists()

  if (!fs.existsSync(EMPLOYEES_FILE)) {
    // Create initial employees file with demo accounts
    const initialEmployees: Employee[] = [
      {
        id: "1",
        email: "john@babylandkids.com",
        name: "John Doe",
        password: "password123",
      },
      {
        id: "2",
        email: "jane@babylandkids.com",
        name: "Jane Smith",
        password: "password123",
      },
    ]
    fs.writeFileSync(EMPLOYEES_FILE, JSON.stringify(initialEmployees, null, 2))
    return initialEmployees
  }

  const data = fs.readFileSync(EMPLOYEES_FILE, "utf8")
  return JSON.parse(data)
}

// Save employees to file
function saveEmployees(employees: Employee[]) {
  ensureDataDirectoryExists()
  fs.writeFileSync(EMPLOYEES_FILE, JSON.stringify(employees, null, 2))
}

// Get all employees
export async function getEmployees(): Promise<Employee[]> {
  return loadEmployees()
}

export async function authenticateEmployee(email: string, password: string) {
  const employees = loadEmployees()

  // In a real app, you would hash the password and compare with the stored hash
  const employee = employees.find((e) => e.email === email && e.password === password)

  if (employee) {
    // Set a cookie to maintain the session
    cookies().set("employeeId", employee.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return { success: true, employee: { id: employee.id, name: employee.name, email: employee.email } }
  }

  return { success: false, error: "Invalid email or password" }
}

export async function registerEmployee(name: string, email: string, password: string) {
  const employees = loadEmployees()

  // Check if email already exists
  if (employees.some((e) => e.email === email)) {
    return { success: false, error: "Email already registered" }
  }

  // Create new employee
  const newEmployee: Employee = {
    id: (employees.length + 1).toString(),
    email,
    name,
    password, // In a real app, this would be hashed
  }

  // Add to our "database"
  employees.push(newEmployee)
  saveEmployees(employees)

  return { success: true, employee: { id: newEmployee.id, name: newEmployee.name, email: newEmployee.email } }
}

export async function getLoggedInEmployee() {
  const employeeId = cookies().get("employeeId")?.value

  if (!employeeId) {
    return null
  }

  const employees = loadEmployees()
  const employee = employees.find((e) => e.id === employeeId)

  if (!employee) {
    return null
  }

  return { id: employee.id, name: employee.name, email: employee.email }
}

export async function logoutEmployee() {
  cookies().delete("employeeId")
  return { success: true }
}
