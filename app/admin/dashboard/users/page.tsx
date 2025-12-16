import { Metadata } from "next";

import ResidentsPage from "@/components/pages/residents-page";

export const metadata: Metadata = {
  title: "Penduduk | Signal",
};

export default function Page() {
  return <ResidentsPage />;
}
