export function getDashboardPath(role: string): string {
  switch (role) {
    case "Admin":
      return "/dashboard/admin";
    case "Manager":
      return "/dashboard/manager";
    default:
      return "/dashboard/employee";
  }
}
