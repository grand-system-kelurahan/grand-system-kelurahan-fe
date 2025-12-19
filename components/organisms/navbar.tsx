"use client";

import React, { useMemo, useState } from "react";
import { AlertCircle, Book, Laptop, Menu } from "lucide-react";
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

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEmployees } from "@/hooks/use-employees";
import { useClockIn, useClockOut } from "@/hooks/use-attendance";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
  onClick?: () => void;
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

function nowTimeHHMM() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
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
    {
      title: "Absensi",
      url: "/attendances",
      items: [
        {
          title: "Check-in",
          description: "Clock-in absensi pegawai",
          icon: <AlertCircle className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Check-out",
          description: "Clock-out absensi pegawai",
          icon: <AlertCircle className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
  ],
  auth = {
    login: { title: "Login", url: "#" },
    signup: { title: "Sign up", url: "#" },
  },
}: Navbar1Props) => {
  const [openClockIn, setOpenClockIn] = useState(false);
  const [openClockOut, setOpenClockOut] = useState(false);

  const menuWithAbsensiActions = useMemo(() => {
    return (menu ?? []).map((m) => {
      if (m.title !== "Absensi" || !m.items) return m;
      return {
        ...m,
        items: m.items.map((it) => {
          if (it.title === "Check-in")
            return { ...it, onClick: () => setOpenClockIn(true) };
          if (it.title === "Check-out")
            return { ...it, onClick: () => setOpenClockOut(true) };
          return it;
        }),
      };
    });
  }, [menu]);

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
                {menuWithAbsensiActions.map((item) => renderMenuItem(item))}
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
                    className="flex flex-col gap-4 w-full"
                  >
                    {menuWithAbsensiActions.map((item) =>
                      renderMobileMenuItem(item)
                    )}
                  </Accordion>
                  <UserDropdown />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <ClockDialog open={openClockIn} onOpenChange={setOpenClockIn} type="in" />
      <ClockDialog
        open={openClockOut}
        onOpenChange={setOpenClockOut}
        type="out"
      />
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
  if (item.onClick) {
    return (
      <button
        type="button"
        onClick={item.onClick}
        className="flex w-full text-left flex-row gap-4 hover:bg-muted p-3 rounded-md outline-none min-w-80 no-underline leading-none transition-colors hover:text-accent-foreground select-none"
      >
        <div className="text-foreground">{item.icon}</div>
        <div>
          <div className="font-semibold text-sm">{item.title}</div>
          {item.description && (
            <p className="text-muted-foreground text-sm leading-snug">
              {item.description}
            </p>
          )}
        </div>
      </button>
    );
  }

  return (
    <Link
      className="flex flex-row gap-4 hover:bg-muted p-3 rounded-md outline-none min-w-80 no-underline leading-none transition-colors hover:text-accent-foreground select-none"
      href={item.url}
    >
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

function ClockDialog({
  open,
  onOpenChange,
  type,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  type: "in" | "out";
}) {
  const { data } = useEmployees();
  const clockIn = useClockIn();
  const clockOut = useClockOut();

  const employees = useMemo(() => {
    if (Array.isArray(data)) return data as any[];
    const list =
      (data as any)?.data?.employees ??
      (data as any)?.employees ??
      (data as any)?.data ??
      [];
    return Array.isArray(list) ? list : [];
  }, [data]);

  const [employeeId, setEmployeeId] = useState<string>("");
  const [time, setTime] = useState(nowTimeHHMM());

  const saving =
    (type === "in"
      ? (clockIn as any).isPending ?? (clockIn as any).isLoading ?? false
      : (clockOut as any).isPending ?? (clockOut as any).isLoading ?? false) ||
    false;

  const submit = () => {
    if (!employeeId) return;
    const payload = { employee_id: Number(employeeId), time };
    const mutation = type === "in" ? clockIn : clockOut;
    mutation.mutate(
      payload as any,
      { onSuccess: () => onOpenChange(false) } as any
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === "in" ? "Check-in" : "Check-out"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <div className="text-sm font-medium">Pegawai</div>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih pegawai" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((e: any) => (
                  <SelectItem key={e.id} value={String(e.id)}>
                    {e.name ?? `#${e.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Waktu</div>
            <Input
              type="time"
              value={time}
              onChange={(ev) => setTime(ev.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Batal
          </Button>
          <Button onClick={submit} disabled={saving || !employeeId || !time}>
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { Navbar };
