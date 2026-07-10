"use client";

import { useEffect, useState, useCallback } from "react";
import { leaveService } from "@/services/leave.service";
import { useToast } from "@/components/ui/Toast";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ButtonSpinner } from "@/components/ui/ButtonSpinner";
import type { LeaveRequest } from "@/types/leave";

interface LeaveHistoryProps {
  refreshKey?: number;
}

const statusClasses: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Cancelled: "bg-gray-100 text-gray-600",
};

export function LeaveHistory({ refreshKey }: LeaveHistoryProps) {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchRequests = useCallback(() => {
    setLoading(true);
    leaveService
      .getHistory()
      .then(setRequests)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests, refreshKey]);

  async function handleCancel() {
    if (!cancelId) return;
    setCancelling(true);
    try {
      await leaveService.cancel(cancelId);
      showToast("Leave request cancelled");
      fetchRequests();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to cancel",
        "error"
      );
    } finally {
      setCancelling(false);
      setCancelId(null);
    }
  }

  if (loading) return <TableSkeleton rows={4} cols={6} />;

  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-gray-900">
        Leave History
      </h2>
      {requests.length === 0 ? (
        <EmptyState message="No leave requests found." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t border-gray-100">
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
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        statusClasses[r.status] || ""
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {r.status === "Pending" && (
                      <button
                        onClick={() => setCancelId(r.id)}
                        disabled={cancelling}
                        className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        {cancelling && cancelId === r.id ? (
                          <ButtonSpinner />
                        ) : (
                          "Cancel"
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={cancelId !== null}
        title="Cancel Leave Request"
        message="Are you sure you want to cancel this leave request?"
        confirmLabel="Yes, Cancel"
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
      />
    </section>
  );
}
