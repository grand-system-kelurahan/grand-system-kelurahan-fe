import { Metadata } from "next";

import AddResidentPage from "@/components/pages/add-resident-page";

export const metadata: Metadata = {
  title: "Tambah Penduduk | Signal",
};

export default function Page() {
  return <AddResidentPage />;
}
