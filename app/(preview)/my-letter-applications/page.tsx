import { Metadata } from "next";

import MyLetterApplicationPage from "@/components/pages/my-letter-application-page";

export const metadata: Metadata = {
  title: "Pengajuan Surat Saya | Signal",
};

export default function Page() {
  return <MyLetterApplicationPage />;
}
