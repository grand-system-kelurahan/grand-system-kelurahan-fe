import { Metadata } from "next";

import LetterApplicationPage from "@/components/pages/letter-application-page";

export const metadata: Metadata = {
  title: "Pengajuan Surat | Signal",
};

export default function Page() {
  return <LetterApplicationPage />;
}
