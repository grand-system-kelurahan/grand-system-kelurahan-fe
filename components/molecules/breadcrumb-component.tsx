"use client";

import Link from "next/link";

import { sidebarData } from "@/consts/sidebar-data";
import { usePathSegments } from "@/hooks/use-path-segment";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export default function BreadcrumbComponent() {
  const { fullPath } = usePathSegments();

  // Flatten semua item dari sidebarData
  const allMenuItems = sidebarData.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      groupTitle: group.title,
    }))
  );

  // Cari menu item yang sesuai dengan current path
  const findMatchingMenuItem = () => {
    // Urutkan dari URL terpanjang ke terpendek untuk exact match
    const sortedItems = [...allMenuItems].sort(
      (a, b) => b.url.length - a.url.length
    );

    for (const item of sortedItems) {
      if (fullPath.startsWith(item.url)) {
        return item;
      }
    }
    return null;
  };

  const currentMenuItem = findMatchingMenuItem();

  // Bangun breadcrumb items
  const breadcrumbItems = [];

  // Selalu tambahkan Home
  breadcrumbItems.push({
    title: "Dashboard",
    url: "/admin/dashboard",
    isActive: fullPath === "/admin/dashboard",
  });

  // Jika ada menu item yang cocok, tambahkan group dan item
  if (currentMenuItem) {
    // Hanya tambahkan group jika bukan di halaman dashboard utama
    if (fullPath !== "/admin/dashboard") {
      breadcrumbItems.push({
        title: currentMenuItem.groupTitle,
        url: "#", // Group biasanya tidak punya URL langsung
        isActive: false,
      });

      breadcrumbItems.push({
        title: currentMenuItem.title,
        url: currentMenuItem.url,
        isActive: true,
      });
    }
  } else if (fullPath !== "/admin/dashboard") {
    // Fallback untuk halaman yang tidak terdaftar di sidebar
    const pathParts = fullPath.split("/").filter((part) => part);
    if (pathParts.length > 2) {
      const pageTitle = pathParts[pathParts.length - 1]
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbItems.push({
        title: pageTitle,
        url: fullPath,
        isActive: true,
      });
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div className="flex items-center" key={index}>
            <BreadcrumbItem key={`item-${index}`}>
              {item.isActive || item.url === "#" ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <Link href={item.url}>{item.title}</Link>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator
                key={`separator-${index}`}
                className="mt-1 ml-2"
              />
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
