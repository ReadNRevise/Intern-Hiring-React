import { api } from "@/lib/api";
import type { LeaveRequest, LeaveType, ApplyLeavePayload } from "@/types/leave";

export const leaveService = {
  async apply(payload: ApplyLeavePayload): Promise<LeaveRequest> {
    return api.post<LeaveRequest>("/leave-requests", payload);
  },

  async getHistory(): Promise<LeaveRequest[]> {
    return api.get<LeaveRequest[]>("/leave-requests");
  },

  async cancel(id: string): Promise<LeaveRequest> {
    return api.put<LeaveRequest>(`/leave-requests/${id}`, {
      status: "Cancelled",
    });
  },

  async approve(id: string): Promise<LeaveRequest> {
    return api.put<LeaveRequest>(`/leave-requests/${id}`, {
      status: "Approved",
    });
  },

  async reject(id: string, comment?: string): Promise<LeaveRequest> {
    return api.put<LeaveRequest>(`/leave-requests/${id}`, {
      status: "Rejected",
      comment,
    });
  },

  async getLeaveTypes(): Promise<LeaveType[]> {
    return api.get<LeaveType[]>("/leave-types");
  },

  async createLeaveType(payload: {
    name: string;
    maxDays: number;
  }): Promise<LeaveType> {
    return api.post<LeaveType>("/leave-types", payload);
  },
};
