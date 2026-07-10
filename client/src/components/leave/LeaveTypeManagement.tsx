"use client";

import { useEffect, useState, type FormEvent } from "react";
import { leaveService } from "@/services/leave.service";
import { useToast } from "@/components/ui/Toast";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonSpinner } from "@/components/ui/ButtonSpinner";
import type { LeaveType } from "@/types/leave";

export function LeaveTypeManagement() {
  const { showToast } = useToast();
  const [types, setTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [maxDays, setMaxDays] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchLeaveTypes = () => {
    setLoading(true);
    leaveService
      .getLeaveTypes()
      .then(setTypes)
      .catch((err) => {
        showToast(err instanceof Error ? err.message : "Failed to load leave types", "error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    const days = parseInt(maxDays, 10);
    if (isNaN(days) || days <= 0) {
      errs.maxDays = "maxDays must be a positive integer";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitLoading(true);
    try {
      await leaveService.createLeaveType({
        name: name.trim(),
        maxDays: parseInt(maxDays, 10),
      });
      showToast("Leave type created successfully");
      setName("");
      setMaxDays("");
      setErrors({});
      fetchLeaveTypes();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to create leave type", "error");
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* List */}
      <div className="md:col-span-2 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Configured Leave Policies</h3>
        {loading ? (
          <TableSkeleton rows={3} cols={2} />
        ) : types.length === 0 ? (
          <EmptyState message="No leave types configured." />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Leave Type Name</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Max Days Policy</th>
                </tr>
              </thead>
              <tbody>
                {types.map((type) => (
                  <tr key={type.id} className="border-t border-gray-100">
                    <td className="px-4 py-2.5 font-medium text-gray-900">{type.name}</td>
                    <td className="px-4 py-2.5 text-gray-500">{type.maxDays} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form */}
      <div>
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-gray-200 bg-white p-4 space-y-4"
        >
          <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">
            Create Leave Type
          </h3>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Leave Type Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs focus:border-gray-500 focus:outline-none"
              placeholder="e.g. Parental Leave"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">Max Days</label>
            <input
              type="number"
              value={maxDays}
              onChange={(e) => setMaxDays(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-xs focus:border-gray-500 focus:outline-none"
              placeholder="e.g. 15"
            />
            {errors.maxDays && <p className="mt-1 text-xs text-red-600">{errors.maxDays}</p>}
          </div>
          <button
            type="submit"
            disabled={submitLoading}
            className="w-full rounded-md bg-gray-900 py-2 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {submitLoading ? <ButtonSpinner /> : "Create Policy"}
          </button>
        </form>
      </div>
    </div>
  );
}
