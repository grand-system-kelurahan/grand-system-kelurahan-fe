/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TUser } from "@/schemas/user-schema";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useUserStore } from "@/stores/use-user-store";
import { ColumnDef } from "@tanstack/react-table";

export const userColumns: ColumnDef<TUser>[] = [
  {
    accessorKey: "name",
    header: "Nama Pengguna",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Peran",
    cell: ({ row }) => {
      const user = row.original;

      return user.role == "admin" ? (
        <Badge
          variant={"outline"}
          className="bg-green-100 dark:bg-green-800 border-none text-green-600 dark:text-green-100">
          Admin
        </Badge>
      ) : user.role == "pegawai" ? (
        <Badge
          variant={"outline"}
          className="bg-blue-100 dark:bg-blue-800 border-none text-blue-600 dark:text-blue-100">
          Pegawai
        </Badge>
      ) : (
        <Badge
          variant={"outline"}
          className="bg-amber-100 dark:bg-amber-800 border-none text-amber-600 dark:text-amber-100">
          Masyarakat
        </Badge>
      );
    },
  },
  {
    id: "Aksi",
    header: "Aksi",
    cell: ({ row }) => {
      const user = row.original;
      const { openDialog } = useIsDialogOpenStore();
      const { setSelectedData } = useUserStore();
      const handleEdit = () => {
        openDialog("edit");
        setSelectedData(user as TUser);
      };
      const handleDelete = () => {
        openDialog("delete");
        setSelectedData(user);
      };
      return (
        <Button size={"sm"} variant={"outline"} onClick={handleEdit}>
          <Pencil />
        </Button>
      );
    },
  },
];
