"use client";

import { useEffect, useState, type FormEvent } from "react";
import { leaveService } from "@/services/leave.service";
import { useToast } from "@/components/ui/Toast";
import { ButtonSpinner } from "@/components/ui/ButtonSpinner";
import type { LeaveType } from "@/types/leave";

interface LeaveFormProps {
  onSuccess?: () => void;
}

export function LeaveForm({ onSuccess }: LeaveFormProps) {
  const { showToast } = useToast();
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(false);

  const [leaveTypeId, setLeaveTypeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    leaveService.getLeaveTypes().then(setLeaveTypes).catch(() => {});
  }, []);

  function validate(): boolean {
    const errs: Record<string, string> = {};

    if (!leaveTypeId) errs.leaveTypeId = "Please select a leave type";
    if (!startDate) errs.startDate = "Start date is required";
    if (!endDate) errs.endDate = "End date is required";

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) errs.startDate = "Start date cannot be in the past";
      if (end < start) errs.endDate = "End date must be on or after start date";

      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays < 1) errs.endDate = "Leave duration must be at least 1 day";
    }

    if (!reason.trim()) {
      errs.reason = "Reason is required";
    } else if (reason.length > 500) {
      errs.reason = "Reason must be under 500 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await leaveService.apply({ leaveTypeId, startDate, endDate, reason });
      showToast("Leave request submitted successfully");
      setLeaveTypeId("");
      setStartDate("");
      setEndDate("");
      setReason("");
      setErrors({});
      onSuccess?.();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to submit request",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-gray-900">
        Apply for Leave
      </h2>
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-gray-200 bg-white p-4"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Leave Type
            </label>
            <select
              value={leaveTypeId}
              onChange={(e) => setLeaveTypeId(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            >
              <option value="">Select type</option>
              {leaveTypes.map((lt) => (
                <option key={lt.id} value={lt.id}>
                  {lt.name} ({lt.maxDays} days max)
                </option>
              ))}
            </select>
            {errors.leaveTypeId && (
              <p className="mt-1 text-xs text-red-600">{errors.leaveTypeId}</p>
            )}
          </div>

          <div />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
            {errors.startDate && (
              <p className="mt-1 text-xs text-red-600">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
            {errors.endDate && (
              <p className="mt-1 text-xs text-red-600">{errors.endDate}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            placeholder="Briefly describe why you need leave"
          />
          {errors.reason && (
            <p className="mt-1 text-xs text-red-600">{errors.reason}</p>
          )}
        </div>

        <div className="mt-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? <ButtonSpinner /> : "Submit Request"}
          </button>
        </div>
      </form>
    </section>
  );
}
