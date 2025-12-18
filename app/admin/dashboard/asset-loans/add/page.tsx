import { Metadata } from "next";

import CreateAssetLoanPage from "@/components/pages/create-asset-loan-page";

export const metadata: Metadata = {
  title: "Peminjaman Aset | Signal",
};

export default function Page() {
  return <CreateAssetLoanPage />;
}
