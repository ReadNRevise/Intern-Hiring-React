"use client";

import { useEffect, useState, useCallback } from "react";
import { userService } from "@/services/user.service";
import { useToast } from "@/components/ui/Toast";
import { TableSkeleton } from "@/components/ui/TableSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { User } from "@/types/user";

interface UserListProps {
  refreshKey?: number;
  onEdit: (user: User) => void;
}

export function UserList({ refreshKey, onEdit }: UserListProps) {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchUsers = useCallback(() => {
    setLoading(true);
    userService
      .getUsers({ page, limit })
      .then((data) => {
        setUsers(data.users);
        setTotal(data.total);
      })
      .catch((err) => {
        showToast(
          err instanceof Error ? err.message : "Failed to load users",
          "error"
        );
      })
      .finally(() => setLoading(false));
  }, [page, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refreshKey]);

  const totalPages = Math.ceil(total / limit);

  if (loading) return <TableSkeleton rows={5} cols={6} />;

  if (users.length === 0) return <EmptyState message="No users found." />;

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-600">
                Name
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">
                Email
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">
                Role
              </th>
              <th className="px-4 py-2 text-left font-medium text-gray-600">
                Department
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
            {users.map((u) => (
              <tr key={u.id} className="border-t border-gray-100">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2 text-gray-500">{u.email}</td>
                <td className="px-4 py-2">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-500">
                  {u.department || "—"}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`text-xs font-medium ${
                      u.active ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {u.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => onEdit(u)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Page {page} of {totalPages} ({total} users)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-40"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
