"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthSuccessPage() {
  const router = useRouter();
  // Optionally, fetch user details from localStorage or context
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;

  useEffect(() => {
    if (!user) {
      router.replace("/auth");
    }
  }, [user, router]);

  if (!user) return <div>Redirecting...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name || user.email}!</h1>
      <div className="space-y-2">
        <div><b>Email:</b> {user.email}</div>
        <div><b>Role:</b> {user.role}</div>
        {/* Add more fields as needed */}
      </div>
      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => router.push(`/dashboard/${user.role}`)}
      >
        Go to Dashboard
      </button>
    </div>
  );
}
