import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { pool } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const favorite = searchParams.get("favorite")

    let query = "SELECT * FROM notes WHERE user_id = $1"
    const params: any[] = [session.user.id]

    if (search) {
      query += " AND (title ILIKE $2 OR content ILIKE $2)"
      params.push(`%${search}%`)
    }

    if (favorite === "true") {
      query += ` AND is_favorite = true`
    }

    query += " ORDER BY updated_at DESC"

    const result = await pool.query(query, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching notes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const result = await pool.query("INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *", [
      session.user.id,
      title,
      content || "",
    ])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating note:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
