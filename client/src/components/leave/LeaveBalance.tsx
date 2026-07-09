"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import { Spinner } from "@/components/ui/Spinner";
import type { LeaveBalance as LeaveBalanceType } from "@/types/leave";

export function LeaveBalance() {
  const [balances, setBalances] = useState<LeaveBalanceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService
      .getMe()
      .then((user) => setBalances(user.leaveBalances))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <section>
      <h2 className="mb-3 text-base font-semibold text-gray-900">
        Leave Balances
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {balances.map((b) => (
          <div
            key={b.id}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <p className="text-sm text-gray-500">{b.leaveType.name}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {b.balance}
              <span className="text-sm font-normal text-gray-400">
                {" "}
                / {b.leaveType.maxDays}
              </span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
