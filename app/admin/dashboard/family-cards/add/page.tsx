import { Metadata } from "next";

import AddFamilyCardPage from "@/components/pages/add-family-card-page";

export const metadata: Metadata = {
  title: "Tambah Kartu Keluarga | Signal",
};

export default function Page() {
  return <AddFamilyCardPage />;
}
