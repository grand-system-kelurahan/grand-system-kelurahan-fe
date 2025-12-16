import { AppSidebar } from "@/components/app-sidebar";
import BreadcrumbComponent from "@/components/molecules/breadcrumb-component";
import { ModeToggle } from "@/components/molecules/mode-toggle";
import UserDropdown from "@/components/molecules/user-dropdown";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between items-center gap-2 px-4 border-b h-16 shrink-0">
          <div className="flex justify-between items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <BreadcrumbComponent />
          </div>
          <div className="flex justify-between gap-2">
            <UserDropdown />
            <ModeToggle />
          </div>
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
