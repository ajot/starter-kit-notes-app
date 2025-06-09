import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if user already exists
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email])
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10)

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role`,
      [name, email, password_hash, "user"]
    )
    const user = result.rows[0]

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 