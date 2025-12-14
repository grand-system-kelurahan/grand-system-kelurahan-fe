import { Metadata } from "next";

import FamilyCardDetailPage from "@/components/pages/family-card-detail-page";

export const metadata: Metadata = {
  title: "Detail Kartu Keluarga | Signal",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <FamilyCardDetailPage id={Number(id)} />;
}
