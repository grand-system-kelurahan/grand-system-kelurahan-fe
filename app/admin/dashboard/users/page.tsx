import { Metadata } from "next";

import UsersPage from "@/components/pages/users-page";

export const metadata: Metadata = {
  title: "Pengguna | Signal",
};

export default function Page() {
  return <UsersPage />;
}
