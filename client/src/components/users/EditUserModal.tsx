"use client";

import { useEffect, useState, type FormEvent } from "react";
import { userService } from "@/services/user.service";
import { useToast } from "@/components/ui/Toast";
import { ButtonSpinner } from "@/components/ui/ButtonSpinner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { User, Role } from "@/types/user";

interface EditUserModalProps {
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditUserModal({ user, onClose, onSuccess }: EditUserModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState<User[]>([]);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  const [role, setRole] = useState<Role>("Employee");
  const [managerId, setManagerId] = useState("");
  const [department, setDepartment] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (user) {
      setRole(user.role);
      setManagerId(user.managerId || "");
      setDepartment(user.department || "");
      setActive(user.active);
    }
  }, [user]);

  useEffect(() => {
    userService
      .getUsers({ role: "Manager", limit: 100 })
      .then((data) => setManagers(data.users))
      .catch(() => {});
  }, []);

  if (!user) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    // If deactivating, show confirmation first
    if (user.active && !active) {
      setShowDeactivateConfirm(true);
      return;
    }

    await saveUser();
  }

  async function saveUser() {
    if (!user) return;
    setLoading(true);
    try {
      await userService.updateUser(user.id, {
        role,
        managerId: managerId || null,
        department: department || undefined,
        active,
      });
      showToast("User updated successfully");
      onSuccess();
      onClose();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to update user",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Edit User: {user.name}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Manager
                </label>
                <select
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                >
                  <option value="">None</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active-toggle"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label
                  htmlFor="active-toggle"
                  className="text-sm font-medium text-gray-700"
                >
                  Active
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? <ButtonSpinner /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDialog
        open={showDeactivateConfirm}
        title="Deactivate User"
        message={`Are you sure you want to deactivate ${user.name}?`}
        confirmLabel="Yes, Deactivate"
        onConfirm={() => {
          setShowDeactivateConfirm(false);
          saveUser();
        }}
        onCancel={() => {
          setShowDeactivateConfirm(false);
          setActive(true);
        }}
      />
    </>
  );
}
