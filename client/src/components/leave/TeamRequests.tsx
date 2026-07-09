"use client";

import { useEffect, useState, useCallback } from "react";
import { leaveService } from "@/services/leave.service";
import { useToast } from "@/components/ui/Toast";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ButtonSpinner } from "@/components/ui/ButtonSpinner";
import type { LeaveRequest } from "@/types/leave";

interface TeamRequestsProps {
  refreshKey?: number;
  onActionSuccess?: () => void;
}

export function TeamRequests({
  refreshKey,
  onActionSuccess,
}: TeamRequestsProps) {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<LeaveRequest | null>(null);
  const [rejectComment, setRejectComment] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const fetchTeamRequests = useCallback(() => {
    setLoading(true);
    leaveService
      .getHistory()
      .then(setRequests)
      .catch((err) => {
        showToast(
          err instanceof Error ? err.message : "Failed to load team requests",
          "error"
        );
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  useEffect(() => {
    fetchTeamRequests();
  }, [fetchTeamRequests, refreshKey]);

  async function handleApprove(id: string) {
    setApprovingId(id);
    try {
      await leaveService.approve(id);
      showToast("Leave request approved");
      fetchTeamRequests();
      onActionSuccess?.();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to approve",
        "error"
      );
    } finally {
      setApprovingId(null);
    }
  }

  async function handleRejectConfirm() {
    if (!rejectTarget) return;
    setRejecting(true);
    try {
      await leaveService.reject(
        rejectTarget.id,
        rejectComment.trim() || undefined
      );
      showToast("Leave request rejected");
      setRejectTarget(null);
      setRejectComment("");
      fetchTeamRequests();
      onActionSuccess?.();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to reject",
        "error"
      );
    } finally {
      setRejecting(false);
    }
  }

  const pendingRequests = requests.filter((r) => r.status === "Pending");

  if (loading) return <TableSkeleton rows={3} cols={6} />;

  if (pendingRequests.length === 0) {
    return <EmptyState message="No pending team requests." />;
  }

  return (
    <section>
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((r) => (
              <tr key={r.id} className="border-t border-gray-100">
                <td className="px-4 py-2 font-medium text-gray-900">
                  {r.user?.name || "Employee"}
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
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(r.id)}
                      disabled={approvingId === r.id}
                      className="text-xs font-semibold text-green-600 hover:text-green-800 disabled:opacity-50"
                    >
                      {approvingId === r.id ? <ButtonSpinner /> : "Approve"}
                    </button>
                    <button
                      onClick={() => setRejectTarget(r)}
                      className="text-xs font-semibold text-red-600 hover:text-red-800"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={rejectTarget !== null}
        title="Reject Leave Request"
        message={`Are you sure you want to reject ${rejectTarget?.user?.name || "this employee"}'s leave request?`}
        confirmLabel={rejecting ? "Rejecting…" : "Reject"}
        onConfirm={handleRejectConfirm}
        onCancel={() => {
          setRejectTarget(null);
          setRejectComment("");
        }}
      >
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">
            Comment (optional)
          </label>
          <textarea
            value={rejectComment}
            onChange={(e) => setRejectComment(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-xs focus:border-gray-500 focus:outline-none"
            rows={2}
            placeholder="Reason for rejection"
          />
        </div>
      </ConfirmDialog>
    </section>
  );
}
