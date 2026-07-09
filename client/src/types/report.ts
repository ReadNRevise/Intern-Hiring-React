export interface LeaveSummary {
  byType: Record<string, number>;
  byDepartment: Record<string, number>;
  byEmployee: Record<string, number>;
}

export interface LeaveBalanceReportEntry {
  userId: string;
  name: string;
  department: string | null;
  balances: {
    leaveType: string;
    remaining: number;
  }[];
}

export interface CalendarEntry {
  userId: string;
  name: string;
  startDate: string;
  endDate: string;
  leaveType: string;
}
