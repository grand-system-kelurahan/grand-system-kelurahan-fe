import { Metadata } from "next";

import ResidentVerificationDetailPage from "@/components/pages/resident-verification-detail-page";

export const metadata: Metadata = {
  title: "Detail Pengajuan Verifikasi Penduduk | Signal",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ResidentVerificationDetailPage id={Number(id)} />;
}
