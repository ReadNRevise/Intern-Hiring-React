"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ButtonSpinner } from "@/components/ui/ButtonSpinner";

export function Navbar() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  return (
    <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
      <h1 className="text-lg font-semibold text-gray-900">Leave Manager</h1>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm text-gray-600">{user.name}</span>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
              {user.role}
            </span>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {loggingOut ? <ButtonSpinner /> : "Logout"}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
