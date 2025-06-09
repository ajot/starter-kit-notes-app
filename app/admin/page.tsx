"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session || session.user.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <AdminDashboard />
    </div>
  )
}
