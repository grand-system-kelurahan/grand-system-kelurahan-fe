import { Metadata } from "next";

import AddResidentVerificationPage from "@/components/pages/add-resident-verification-page";

export const metadata: Metadata = {
  title: "Tambah Verifikasi Penduduk | Signal",
};

export default function Page() {
  return <AddResidentVerificationPage />;
}
