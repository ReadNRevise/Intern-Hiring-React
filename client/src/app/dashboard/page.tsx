"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/lib/auth";
import { Spinner } from "@/components/ui/Spinner";

export default function DashboardIndex() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    router.replace(getDashboardPath(user.role));
  }, [user, loading, router]);

  return <Spinner />;
}
