import { Metadata } from "next";

import AssetsLoanPage from "@/components/pages/asset-loan-page";

export const metadata: Metadata = {
  title: "Aset Loan | Signal",
};

export default function Page() {
  return <AssetsLoanPage />;
}
