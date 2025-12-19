import { Metadata } from "next";

import ResidentVerificationPage from "@/components/pages/resident-verification-page";

export const metadata: Metadata = {
  title: "Verifikasi Penduduk | Signal",
};

export default function Page() {
  return <ResidentVerificationPage />;
}
