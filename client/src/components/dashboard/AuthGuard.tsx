"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardPath } from "@/lib/auth";
import { Spinner } from "@/components/ui/Spinner";
import type { Role } from "@/types/user";

interface AuthGuardProps {
  allowedRoles: Role[];
  children: ReactNode;
}

export function AuthGuard({ allowedRoles, children }: AuthGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!allowedRoles.includes(user.role)) {
      router.replace(getDashboardPath(user.role));
    }
  }, [allowedRoles, router, user, loading]);

  if (loading || !user || !allowedRoles.includes(user.role)) {
    return <Spinner />;
  }

  return <>{children}</>;
}
