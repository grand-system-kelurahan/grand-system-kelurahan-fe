import { Metadata } from "next";

import EditAssetPage from "@/components/pages/edit-asset-page";

export const metadata: Metadata = {
  title: "Detail Aset | Signal",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditAssetPage id={Number(id)} />;
}
