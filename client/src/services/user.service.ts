import { api } from "@/lib/api";
import type {
  User,
  UserWithBalances,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/types/user";

interface GetUsersResponse {
  users: User[];
  total: number;
}

export const userService = {
  async getMe(): Promise<UserWithBalances> {
    return api.get<UserWithBalances>("/users/me");
  },

  async getUsers(filters?: {
    role?: string;
    managerId?: string;
    page?: number;
    limit?: number;
  }): Promise<GetUsersResponse> {
    const params = new URLSearchParams();
    if (filters?.role) params.set("role", filters.role);
    if (filters?.managerId) params.set("managerId", filters.managerId);
    if (filters?.page) params.set("page", String(filters.page));
    if (filters?.limit) params.set("limit", String(filters.limit));
    const query = params.toString();
    return api.get<GetUsersResponse>(`/users${query ? `?${query}` : ""}`);
  },

  async createUser(payload: CreateUserPayload): Promise<User> {
    return api.post<User>("/users", payload);
  },

  async updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
    return api.put<User>(`/users/${id}`, payload);
  },
};
