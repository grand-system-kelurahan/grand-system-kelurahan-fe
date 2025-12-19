"use client";

import {
  AlertCircle,
  Book,
  Laptop,
  Menu,
  Sunset,
  Trees,
  Zap,
} from "lucide-react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ModeToggle } from "../molecules/mode-toggle";
import UserDropdown from "../molecules/user-dropdown";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "Shadcnblocks.com",
  },
  menu = [
    { title: "Home", url: "/" },
    {
      title: "Pengajuan Surat",
      url: "/letter-application",
      items: [
        {
          title: "Ajukan surat",
          description: "Isi data untuk mengajukan surat ke kantor kelurahan",
          icon: <Book className="size-5 shrink-0" />,
          url: "/letter-application",
        },
        {
          title: "Pengajuan Saya",
          description: "Cek status pengajuan surat",
          icon: <AlertCircle className="size-5 shrink-0" />,
          url: "/my-letter-applications",
        },
      ],
    },
    {
      title: "Peminjaman Aset",
      url: "/asset-loans",
      items: [
        {
          title: "Peminjaman Aset",
          description:
            "Isi data untuk mengajukan peminjaman Aset ke kantor kelurahan",
          icon: <Laptop className="size-5 shrink-0" />,
          url: "/asset-loans",
        },
        {
          title: "Pengajuan Aset Saya",
          description: "Cek status pengajuan aset",
          icon: <AlertCircle className="size-5 shrink-0" />,
          url: "/my-asset-loans",
        },
      ],
    },
  ],
  auth = {
    login: { title: "Login", url: "#" },
    signup: { title: "Sign up", url: "#" },
  },
}: Navbar1Props) => {
  return (
    <section className="px-4 md:px-16 lg:px-24 py-4">
      <div className="container">
        <nav className="hidden lg:flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href={"/"} className="flex items-center gap-2">
              <span className="font-semibold text-lg">
                Signal | Sistem Kelurahan Digital
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => renderMenuItem(item))}
              </NavigationMenuList>
            </NavigationMenu>
            <UserDropdown />
            <ModeToggle />
          </div>
        </nav>

        <div className="lg:hidden block">
          <div className="flex justify-between items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href={"/"} className="flex items-center gap-2">
                      <span className="font-semibold text-lg">
                        Signal | Sistem Kelurahan Digital
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex flex-col gap-4 w-full">
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <UserDropdown />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <Link href={item.url}>
        <div className="group inline-flex justify-center items-center bg-background hover:bg-muted px-4 py-2 rounded-md w-max h-10 font-medium text-sm transition-colors hover:text-accent-foreground">
          {item.title}
        </div>
      </Link>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-0 font-semibold text-md hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <Link key={item.title} href={item.url} className="font-semibold text-md">
      {item.title}
    </Link>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <Link
      className="flex flex-row gap-4 hover:bg-muted p-3 rounded-md outline-none min-w-80 no-underline leading-none transition-colors hover:text-accent-foreground select-none"
      href={item.url}>
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="font-semibold text-sm">{item.title}</div>
        {item.description && (
          <p className="text-muted-foreground text-sm leading-snug">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export { Navbar };
