"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/dashboard/AuthGuard";
import { LeaveBalance } from "@/components/leave/LeaveBalance";
import { LeaveForm } from "@/components/leave/LeaveForm";
import { LeaveHistory } from "@/components/leave/LeaveHistory";

export default function EmployeeDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  return (
    <AuthGuard allowedRoles={["Employee"]}>
      <div className="space-y-8">
        <h1 className="text-xl font-semibold text-gray-900">
          Employee Dashboard
        </h1>
        <LeaveBalance />
        <LeaveForm onSuccess={refresh} />
        <LeaveHistory refreshKey={refreshKey} />
      </div>
    </AuthGuard>
  );
}
