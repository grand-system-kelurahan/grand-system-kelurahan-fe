import { Metadata } from "next";

import ResidentDetailPage from "@/components/pages/resident-detail-page";

export const metadata: Metadata = {
  title: "Detail Penduduk | Signal",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ResidentDetailPage id={Number(id)} />;
}
