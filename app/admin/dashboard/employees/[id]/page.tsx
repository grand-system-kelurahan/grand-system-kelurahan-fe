import type { Metadata } from "next";
import EmployeeUpsertPage from "@/components/pages/employee/form/upsert-employee";

export const metadata: Metadata = {
  title: "Detail Pegawai | Signal",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EmployeeUpsertPage idParam={id} />;
}
