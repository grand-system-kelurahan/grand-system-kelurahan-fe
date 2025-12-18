import Footer from "@/components/organisms/footer";
import { Navbar } from "@/components/organisms/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      <div className="mt-8 px-8 md:px-16 lg:px-24 pb-24">{children}</div>
      <Footer />
    </div>
  );
}
