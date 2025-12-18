import type { Metadata } from "next";
import AttendanceUpsertPage from "@/components/pages/attendance/form/attendance-upsert-page";

export const metadata: Metadata = {
  title: "Detail Absensi | Signal",
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AttendanceUpsertPage idParam={id} />;
}
