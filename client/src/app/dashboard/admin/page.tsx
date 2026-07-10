"use client";

import { useState, useCallback } from "react";
import { AuthGuard } from "@/components/dashboard/AuthGuard";
import { UserList } from "@/components/users/UserList";
import { CreateUserForm } from "@/components/users/CreateUserForm";
import { EditUserModal } from "@/components/users/EditUserModal";
import { LeaveTypeManagement } from "@/components/leave/LeaveTypeManagement";
import { AllLeaveRequests } from "@/components/leave/AllLeaveRequests";
import { LeaveSummary } from "@/components/reports/LeaveSummary";
import { LeaveBalanceReport } from "@/components/reports/LeaveBalanceReport";
import { LeaveCalendar } from "@/components/reports/LeaveCalendar";
import type { User } from "@/types/user";

type Tab = "users" | "leave-types" | "requests" | "reports";

const tabs: { id: Tab; label: string }[] = [
  { id: "users", label: "Users" },
  { id: "leave-types", label: "Leave Types" },
  { id: "requests", label: "Requests" },
  { id: "reports", label: "Reports" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [userRefreshKey, setUserRefreshKey] = useState(0);

  const refreshUsers = useCallback(() => {
    setUserRefreshKey((k) => k + 1);
  }, []);

  return (
    <AuthGuard allowedRoles={["Admin"]}>
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>

        <div className="border-b border-gray-200">
          <nav className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`border-b-2 pb-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === "users" && (
          <div className="space-y-6">
            <CreateUserForm onSuccess={refreshUsers} />
            <h2 className="text-base font-semibold text-gray-900">
              All Users
            </h2>
            <UserList refreshKey={userRefreshKey} onEdit={setEditUser} />
            <EditUserModal
              user={editUser}
              onClose={() => setEditUser(null)}
              onSuccess={refreshUsers}
            />
          </div>
        )}

        {activeTab === "leave-types" && <LeaveTypeManagement />}

        {activeTab === "requests" && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">
              All Leave Requests
            </h2>
            <AllLeaveRequests />
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-8">
            <section>
              <h2 className="mb-4 text-base font-semibold text-gray-900">
                Leave Summary
              </h2>
              <LeaveSummary />
            </section>
            <section>
              <h2 className="mb-4 text-base font-semibold text-gray-900">
                Leave Balances
              </h2>
              <LeaveBalanceReport />
            </section>
            <section>
              <h2 className="mb-4 text-base font-semibold text-gray-900">
                Leave Calendar
              </h2>
              <LeaveCalendar isAdminView />
            </section>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
