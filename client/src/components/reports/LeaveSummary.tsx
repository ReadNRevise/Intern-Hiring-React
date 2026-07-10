"use client";

import { useEffect, useState, useCallback } from "react";
import { reportService } from "@/services/report.service";
import { useToast } from "@/components/ui/Toast";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { LeaveSummary as LeaveSummaryType } from "@/types/report";

export function LeaveSummary() {
  const { showToast } = useToast();
  const [summary, setSummary] = useState<LeaveSummaryType | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [department, setDepartment] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fetchSummary = useCallback(() => {
    setLoading(true);
    reportService
      .getSummary({
        department: department || undefined,
        from: from || undefined,
        to: to || undefined,
      })
      .then(setSummary)
      .catch((err) => {
        showToast(err instanceof Error ? err.message : "Failed to load summary report", "error");
      })
      .finally(() => setLoading(false));
  }, [department, from, to, showToast]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 text-xs font-semibold text-gray-900">Filters</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs focus:border-gray-500 focus:outline-none"
              placeholder="e.g. Engineering"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs focus:border-gray-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs focus:border-gray-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={3} cols={2} />
      ) : !summary ? (
        <EmptyState message="No summary data available." />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* By Leave Type */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h4 className="mb-3 text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">By Leave Type</h4>
            {Object.keys(summary.byType).length === 0 ? (
              <EmptyState message="No data." />
            ) : (
              <ul className="space-y-2 text-xs">
                {Object.entries(summary.byType).map(([type, days]) => (
                  <li key={type} className="flex justify-between text-gray-700">
                    <span>{type}</span>
                    <span className="font-semibold text-gray-900">{days} days</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* By Department */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h4 className="mb-3 text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">By Department</h4>
            {Object.keys(summary.byDepartment).length === 0 ? (
              <EmptyState message="No data." />
            ) : (
              <ul className="space-y-2 text-xs">
                {Object.entries(summary.byDepartment).map(([dept, days]) => (
                  <li key={dept} className="flex justify-between text-gray-700">
                    <span>{dept}</span>
                    <span className="font-semibold text-gray-900">{days} days</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* By Employee */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h4 className="mb-3 text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">By Employee</h4>
            {Object.keys(summary.byEmployee).length === 0 ? (
              <EmptyState message="No data." />
            ) : (
              <ul className="space-y-2 text-xs">
                {Object.entries(summary.byEmployee).map(([emp, days]) => (
                  <li key={emp} className="flex justify-between text-gray-700">
                    <span>{emp}</span>
                    <span className="font-semibold text-gray-900">{days} days</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
