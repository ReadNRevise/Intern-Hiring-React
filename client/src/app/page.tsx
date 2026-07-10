"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/lib/auth";
import { Spinner } from "@/components/ui/Spinner";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace(getDashboardPath(user.role));
    } else {
      router.replace("/login");
    }
  }, [user, loading, router]);

  return <Spinner />;
}
