"use client";

import { useEffect, useState, useCallback } from "react";
import { leaveService } from "@/services/leave.service";
import { useToast } from "@/components/ui/Toast";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { LeaveRequest } from "@/types/leave";

const statusClasses: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Cancelled: "bg-gray-100 text-gray-600",
};

export function AllLeaveRequests() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchRequests = useCallback(() => {
    setLoading(true);
    leaveService
      .getHistory()
      .then(setRequests)
      .catch((err) => {
        showToast(
          err instanceof Error ? err.message : "Failed to load requests",
          "error"
        );
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filtered = statusFilter
    ? requests.filter((r) => r.status === statusFilter)
    : requests;

  return (
    <div className="space-y-4">
      <div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs focus:border-gray-500 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={7} />
      ) : filtered.length === 0 ? (
        <EmptyState message="No leave requests found." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  Employee
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  Type
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  From
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  To
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  Reason
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {r.user?.name || "—"}
                  </td>
                  <td className="px-4 py-2">
                    {r.leaveType?.name || r.leaveTypeId}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(r.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(r.endDate).toLocaleDateString()}
                  </td>
                  <td className="max-w-xs truncate px-4 py-2">{r.reason}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusClasses[r.status] || ""}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
