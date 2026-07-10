export type Role = "Employee" | "Manager" | "Admin";

export interface AuthUser {
  id: string;
  name: string;
  role: Role;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  managerId: string | null;
  department: string | null;
  active: boolean;
  createdAt: string;
}

export interface UserWithBalances extends User {
  leaveBalances: {
    id: string;
    userId: string;
    leaveTypeId: string;
    balance: number;
    leaveType: {
      id: string;
      name: string;
      maxDays: number;
    };
  }[];
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
  managerId?: string | null;
  department?: string;
}

export interface UpdateUserPayload {
  role?: Role;
  managerId?: string | null;
  active?: boolean;
  department?: string;
}
