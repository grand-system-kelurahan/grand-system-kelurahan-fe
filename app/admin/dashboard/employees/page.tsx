import { Metadata } from "next";

import EmployeeDashboardPage from "@/components/pages/employee/dashboard-page";

export const metadata: Metadata = {
  title: "Pegawai | Signal",
};

export default function Page() {
  return <EmployeeDashboardPage />;
}
