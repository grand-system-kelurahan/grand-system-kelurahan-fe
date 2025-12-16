import { Metadata } from "next";

import LetterTypesPage from "@/components/pages/letter-types-page";

export const metadata: Metadata = {
  title: "Jenis Surat | Signal",
};

export default function Page() {
  return <LetterTypesPage />;
}
