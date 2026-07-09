"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/dashboard/AuthGuard";
import { LeaveBalance } from "@/components/leave/LeaveBalance";
import { LeaveForm } from "@/components/leave/LeaveForm";
import { LeaveHistory } from "@/components/leave/LeaveHistory";
import { TeamRequests } from "@/components/leave/TeamRequests";
import { LeaveCalendar } from "@/components/reports/LeaveCalendar";

export default function ManagerDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  return (
    <AuthGuard allowedRoles={["Manager"]}>
      <div className="space-y-8">
        <h1 className="text-xl font-semibold text-gray-900">
          Manager Dashboard
        </h1>

        <section>
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Team Requests
          </h2>
          <TeamRequests refreshKey={refreshKey} onActionSuccess={refresh} />
        </section>

        <section>
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Team Calendar
          </h2>
          <LeaveCalendar />
        </section>

        <section className="border-t border-gray-200 pt-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            My Leave
          </h2>
          <div className="space-y-6">
            <LeaveBalance />
            <LeaveForm onSuccess={refresh} />
            <LeaveHistory refreshKey={refreshKey} />
          </div>
        </section>
      </div>
    </AuthGuard>
  );
}
