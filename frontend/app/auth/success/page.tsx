"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthSuccessPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        router.replace("/auth");
        return;
      }
      try {
        const userObj = JSON.parse(userStr);
        setUser(userObj);
        if (userObj.role === "patient" || userObj.role === "doctor" || userObj.role === "asha") {
          router.replace(`/dashboard/${userObj.role}`);
        } else {
          router.replace("/auth");
        }
      } catch {
        router.replace("/auth");
      }
    }
    setLoading(false);
  }, [router]);

  if (loading || !user) return <div>Redirecting...</div>;
  return null;
}
