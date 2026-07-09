import { describe, it, expect } from "vitest";
import { getDashboardPath } from "../src/lib/auth";

describe("Frontend Auth Helpers", () => {
  it("should return the correct dashboard path for Admin role", () => {
    expect(getDashboardPath("Admin")).toBe("/dashboard/admin");
  });

  it("should return the correct dashboard path for Manager role", () => {
    expect(getDashboardPath("Manager")).toBe("/dashboard/manager");
  });

  it("should return the default dashboard path for Employee or unknown roles", () => {
    expect(getDashboardPath("Employee")).toBe("/dashboard/employee");
    expect(getDashboardPath("Visitor")).toBe("/dashboard/employee");
  });
});
