import { Metadata } from "next";

import RegionsPage from "@/components/pages/regions-page";

export const metadata: Metadata = {
  title: "Master Lingkungan | Signal",
};

export default function Page() {
  return <RegionsPage />;
}
