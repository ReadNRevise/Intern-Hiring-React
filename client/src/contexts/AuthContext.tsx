"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api, registerUnauthorizedHandler } from "@/lib/api";
import type { AuthUser } from "@/types/user";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface MeResponse {
  id: string;
  name: string;
  role: "Employee" | "Manager" | "Admin";
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // On mount, check if user is authenticated via the httpOnly cookie
  useEffect(() => {
    api
      .get<MeResponse>("/users/me")
      .then((data) =>
        setUser({ id: data.id, name: data.name, role: data.role })
      )
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Register 401 handler so mid-session token expiry clears auth state
  useEffect(() => {
    registerUnauthorizedHandler(() => {
      setUser(null);
    });
    return () => registerUnauthorizedHandler(null);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthUser> => {
      const data = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      setUser(data.user);
      return data.user;
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Even if server call fails, clear local state
    }
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
