"use client";

import { useEffect, useState } from "react";
import { reportService } from "@/services/report.service";
import { useToast } from "@/components/ui/Toast";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { LeaveBalanceReportEntry } from "@/types/report";

export function LeaveBalanceReport() {
  const { showToast } = useToast();
  const [data, setData] = useState<LeaveBalanceReportEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService
      .getBalances()
      .then(setData)
      .catch((err) => {
        showToast(err instanceof Error ? err.message : "Failed to load leave balances", "error");
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  if (loading) return <TableSkeleton rows={5} cols={4} />;

  if (data.length === 0) return <EmptyState message="No leave balance reports found." />;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2.5 text-left font-medium text-gray-600">Employee Name</th>
            <th className="px-4 py-2.5 text-left font-medium text-gray-600">Department</th>
            <th className="px-4 py-2.5 text-left font-medium text-gray-600">Leave Type Balances</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.userId} className="border-t border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-900">{entry.name}</td>
              <td className="px-4 py-3 text-gray-500">{entry.department || "—"}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {entry.balances.map((b, i) => (
                    <span
                      key={i}
                      className="inline-block rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                    >
                      {b.leaveType}: <span className="font-semibold">{b.remaining} days</span>
                    </span>
                  ))}
                  {entry.balances.length === 0 && <span className="text-xs text-gray-400">No balances configured</span>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
