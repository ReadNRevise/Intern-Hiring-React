"use client";

import { useEffect, useState, useCallback } from "react";
import { reportService } from "@/services/report.service";
import { userService } from "@/services/user.service";
import { useToast } from "@/components/ui/Toast";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { CalendarEntry } from "@/types/report";
import type { User } from "@/types/user";

interface LeaveCalendarProps {
  teamId?: string; // If passed, restricted to this manager's team
  isAdminView?: boolean;
}

export function LeaveCalendar({ teamId, isAdminView = false }: LeaveCalendarProps) {
  const { showToast } = useToast();
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // For Admin view, let them select a manager/team to filter
  const [managers, setManagers] = useState<User[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState(teamId || "");

  const fetchCalendar = useCallback(() => {
    setLoading(true);
    reportService
      .getCalendar(selectedManagerId || undefined)
      .then(setEntries)
      .catch((err) => {
        showToast(err instanceof Error ? err.message : "Failed to load leave calendar", "error");
      })
      .finally(() => setLoading(false));
  }, [selectedManagerId, showToast]);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  useEffect(() => {
    if (isAdminView) {
      userService
        .getUsers({ role: "Manager", limit: 100 })
        .then((data) => setManagers(data.users))
        .catch(() => {});
    }
  }, [isAdminView]);

  return (
    <div className="space-y-4">
      {isAdminView && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <label className="mb-1 block text-xs font-medium text-gray-700">Filter by Manager/Team</label>
          <select
            value={selectedManagerId}
            onChange={(e) => setSelectedManagerId(e.target.value)}
            className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-1.5 text-xs focus:border-gray-500 focus:outline-none"
          >
            <option value="">All Teams (Company-wide)</option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <TableSkeleton rows={4} cols={4} />
      ) : entries.length === 0 ? (
        <EmptyState message="No approved leaves found on the calendar." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Employee</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Leave Type</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Start Date</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">End Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="px-4 py-2.5 font-medium text-gray-900">{entry.name}</td>
                  <td className="px-4 py-2.5 text-gray-600">{entry.leaveType}</td>
                  <td className="px-4 py-2.5 text-gray-500">{new Date(entry.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2.5 text-gray-500">{new Date(entry.endDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
