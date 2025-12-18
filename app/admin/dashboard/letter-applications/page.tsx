import { Metadata } from "next";

import LetterApplicationsPage from "@/components/pages/letter-applications-page";

export const metadata: Metadata = {
  title: "Pengajuan Surat | Signal",
};

export default function Page() {
  return <LetterApplicationsPage />;
}
