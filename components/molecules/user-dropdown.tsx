"use client";

import axios from "axios";
import { LogOut, UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

import { useLogout } from "@/hooks/use-auth";
import { useUserLogin } from "@/hooks/use-users";
import { getInitials } from "@/lib/utils";
import { TUser } from "@/schemas/user-schema";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";

export default function UserDropdown() {
  const { data, isLoading } = useUserLogin();
  const { mutateAsync, isPending } = useLogout();
  const router = useRouter();

  const userData: TUser = useMemo(() => data?.data, [data?.data]);

  const role = userData?.role;
  const urlDashboard =
    role == "admin"
      ? `/admin/dashboard`
      : role == "pegawai"
      ? `/pegawai/dashboard`
      : `/`;

  const urlProfile = urlDashboard + "/profile";

  const logout = async () => {
    try {
      await mutateAsync();
    } catch (error) {
      toast.error("Gagal logout");
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {isLoading ? (
        <Skeleton className="rounded-full w-8 h-8" />
      ) : (
        <div>
          {data && userData ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="rounded-lg w-8 h-8">
                  <AvatarFallback className="rounded-lg">
                    {getInitials(userData.name || "U")}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={"bottom"}
                align="end"
                sideOffset={4}>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 text-sm text-left">
                    <Avatar className="rounded-lg w-8 h-8">
                      <AvatarFallback className="rounded-lg">
                        {getInitials(userData.name || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1 grid text-sm text-left leading-tight">
                      <span className="font-medium truncate">
                        {userData.name || "-"}
                      </span>
                      <span className="text-xs truncate">
                        {userData?.email || "-"}
                      </span>
                      <span className="text-xs truncate">
                        {userData?.role || "-"}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {userData.role == "admin" && (
                  <DropdownMenuItem onClick={() => router.push(urlDashboard)}>
                    <UserIcon />
                    Dashboard
                  </DropdownMenuItem>
                )}
                {userData.role == "pegawai" && (
                  <DropdownMenuItem onClick={() => router.push(urlDashboard)}>
                    <UserIcon />
                    Dashboard
                  </DropdownMenuItem>
                )}
                {userData.role == "user" && (
                  <DropdownMenuItem onClick={() => router.push(urlDashboard)}>
                    <UserIcon />
                    Data Saya
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => router.push(urlProfile)}>
                  <UserIcon />
                  Profil Saya
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant={"default"} size={"sm"}>
                  Masuk
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant={"outline"} size={"sm"}>
                  Daftar
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
