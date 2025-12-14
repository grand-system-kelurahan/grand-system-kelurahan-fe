import { Metadata } from "next";

import EditFamilyCardPage from "@/components/pages/edit-family-card-page";

export const metadata: Metadata = {
  title: "Detail Kartu Keluarga | Signal",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditFamilyCardPage id={Number(id)} />;
}
