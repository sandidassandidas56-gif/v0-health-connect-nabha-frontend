"use client"

import { useEffect, useState } from "react";

export default function AshaDashboard() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    fetch("http://localhost:5001/api/asha/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);
  if (!user) return <div>Loading...</div>;
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">ASHA Worker Profile</h1>
      <div className="space-y-2">
        <div><b>Name:</b> {user.name}</div>
        <div><b>Email:</b> {user.email}</div>
        <div><b>Phone:</b> {user.phone}</div>
        <div><b>Worker ID:</b> {user.workerId}</div>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
}
