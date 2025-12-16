import { Metadata } from "next";

import EditResidentPage from "@/components/pages/edit-resident-page";

export const metadata: Metadata = {
  title: "Detail Penduduk | Signal",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditResidentPage id={Number(id)} />;
}
