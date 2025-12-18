"use client";

import Link from "next/link";
import * as React from "react";

import { SearchForm } from "@/components/search-form";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { sidebarData } from "@/consts/sidebar-data";
import { usePathSegments } from "@/hooks/use-path-segment";

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathSegments = usePathSegments();
  const currentPath = pathSegments.fullPath;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href="/">
          <div className="p-2">
            <p className="font-bold text-xl">Signal</p>
            <p className="text-muted-foreground text-sm">
              Sistem Kelurahan Digital
            </p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="pb-24">
        {sidebarData.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => {
                  const isActive = (() => {
                    if (item.url === "/admin/dashboard") {
                      return (
                        currentPath === "/admin/dashboard" ||
                        currentPath === "/admin/dashboard/"
                      );
                    }

                    return (
                      currentPath.startsWith(item.url) &&
                      !(
                        item.url.startsWith("/admin/dashboard/") &&
                        currentPath === "/admin/dashboard"
                      )
                    );
                  })();

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url}>{item.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
