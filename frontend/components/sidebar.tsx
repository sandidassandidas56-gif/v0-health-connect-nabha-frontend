"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Sidebar({ user }: { user: any }) {
  // You can fetch user info from context or props
  return (
    <aside className="w-72 bg-card border-r border-border min-h-screen flex flex-col">
      <Card className="m-4">
        <CardHeader>
          <CardTitle>Account Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div><span className="font-semibold">Name:</span> {user?.address?.fullName || user?.name || "-"}</div>
            <div><span className="font-semibold">Father's Name:</span> {user?.address?.fatherName || "-"}</div>
            <div><span className="font-semibold">Email:</span> {user?.email || "-"}</div>
            <div><span className="font-semibold">Role:</span> {user?.role || "-"}</div>
            <div><span className="font-semibold">Phone:</span> {user?.phone || "-"}</div>
            <div><span className="font-semibold">Age:</span> {user?.age || "-"}</div>
            <div><span className="font-semibold">Gender:</span> {user?.gender || "-"}</div>
            <div><span className="font-semibold">Adhaar:</span> {user?.adhaar || "-"}</div>
            <div><span className="font-semibold">At/PO:</span> {user?.address?.atpo || "-"}</div>
            <div><span className="font-semibold">District:</span> {user?.address?.dist || "-"}</div>
            <div><span className="font-semibold">State:</span> {user?.address?.state || "-"}</div>
            <div><span className="font-semibold">PIN Code:</span> {user?.address?.pin || "-"}</div>
            <div><span className="font-semibold">Landmark:</span> {user?.address?.landmark || "-"}</div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-auto p-4">
        <Button variant="outline" className="w-full">Logout</Button>
      </div>
    </aside>
  )
}
