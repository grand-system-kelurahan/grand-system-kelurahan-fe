import { Metadata } from "next";

import AssetsPage from "@/components/pages/assets-page";

export const metadata: Metadata = {
  title: "Aset | Signal",
};

export default function Page() {
  return <AssetsPage />;
}
