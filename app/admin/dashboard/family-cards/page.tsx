import { Metadata } from "next";

import FamilyCardsPage from "@/components/pages/family-cards-page";

export const metadata: Metadata = {
  title: "Kartu Keluarga | Signal",
};

export default function Page() {
  return <FamilyCardsPage />;
}
