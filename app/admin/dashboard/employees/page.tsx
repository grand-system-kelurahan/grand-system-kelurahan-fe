import EmployeeDashboardPage from "@/components/pages/employee/dashboard-page";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Penduduk | Signal",
};

export default function Page() {
  return <EmployeeDashboardPage />;
}
