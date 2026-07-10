import { api } from "@/lib/api";
import type {
  LeaveSummary,
  LeaveBalanceReportEntry,
  CalendarEntry,
} from "@/types/report";

export const reportService = {
  async getSummary(filters?: {
    department?: string;
    from?: string;
    to?: string;
  }): Promise<LeaveSummary> {
    const params = new URLSearchParams();
    if (filters?.department) params.set("department", filters.department);
    if (filters?.from) params.set("from", filters.from);
    if (filters?.to) params.set("to", filters.to);
    const query = params.toString();
    return api.get<LeaveSummary>(
      `/reports/leave-summary${query ? `?${query}` : ""}`
    );
  },

  async getBalances(): Promise<LeaveBalanceReportEntry[]> {
    return api.get<LeaveBalanceReportEntry[]>("/reports/leave-balance");
  },

  async getCalendar(teamId?: string): Promise<CalendarEntry[]> {
    const query = teamId ? `?teamId=${teamId}` : "";
    return api.get<CalendarEntry[]>(`/reports/leave-calendar${query}`);
  },
};
