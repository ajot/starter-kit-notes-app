import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { pool } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await pool.query(`
      SELECT 
        u.*,
        s.status as subscription_status,
        s.current_period_end,
        COUNT(n.id) as note_count
      FROM users u
      LEFT JOIN subscriptions s ON u.id = s.user_id
      LEFT JOIN notes n ON u.id = n.user_id
      GROUP BY u.id, s.status, s.current_period_end
      ORDER BY u.created_at DESC
    `)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
