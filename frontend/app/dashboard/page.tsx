"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        router.replace("/auth");
        return;
      }
      try {
        const user = JSON.parse(userStr);
        if (user.role === "patient" || user.role === "doctor" || user.role === "asha") {
          router.replace(`/dashboard/${user.role}`);
        } else {
          router.replace("/auth");
        }
      } catch {
        router.replace("/auth");
      }
    }
  }, [router]);
  return <div className="p-8 text-center">Redirecting to your dashboard...</div>;
}
