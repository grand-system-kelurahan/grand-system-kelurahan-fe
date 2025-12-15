import { Metadata } from "next";

import AddAssetPage from "@/components/pages/add-asset-page";

export const metadata: Metadata = {
  title: "Tambah Aset | Signal",
};

export default function Page() {
  return <AddAssetPage />;
}
