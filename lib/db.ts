import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export { pool }

export interface User {
  id: string
  email: string
  name?: string
  role: "user" | "admin"
  email_verified?: Date
  created_at: Date
  updated_at: Date
}

export interface Note {
  id: string
  user_id: string
  title: string
  content?: string
  is_favorite: boolean
  created_at: Date
  updated_at: Date
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  stripe_customer_id: string
  status: "active" | "canceled" | "past_due" | "incomplete"
  price_id: string
  current_period_start: Date
  current_period_end: Date
  created_at: Date
  updated_at: Date
}
