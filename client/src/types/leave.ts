export type LeaveStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export interface LeaveType {
  id: string;
  name: string;
  maxDays: number;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  approvedById: string | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    department: string | null;
  };
  leaveType?: LeaveType;
}

export interface LeaveBalance {
  id: string;
  userId: string;
  leaveTypeId: string;
  balance: number;
  leaveType: LeaveType;
}

export interface ApplyLeavePayload {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
}
