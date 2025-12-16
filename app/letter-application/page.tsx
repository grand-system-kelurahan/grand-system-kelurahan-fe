import { Metadata } from "next";

import { Navbar } from "@/components/organisms/navbar";
import LetterApplicationPage from "@/components/pages/letter-application-page";

export const metadata: Metadata = {
  title: "Pengajuan Surat | Signal",
};

export default function Page() {
  return (
    <div>
      <Navbar />
      <div className="mt-8 px-8 md:px-16 lg:px-24">
        <LetterApplicationPage />
      </div>
    </div>
  );
}
