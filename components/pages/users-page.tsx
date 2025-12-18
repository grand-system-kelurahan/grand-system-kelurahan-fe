"use client";

import { PlusCircle, Users } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Description, Heading1 } from "@/components/atoms/typography";
import { Button } from "@/components/ui/button";
import { usePathSegments } from "@/hooks/use-path-segment";
import { useUsers } from "@/hooks/use-users";
import { TUser } from "@/schemas/user-schema";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useUserStore } from "@/stores/use-user-store";

import { userColumns } from "../data-table/columns/user-columns";
import { DataTable } from "../data-table/data-table";
import CodeEditorDialog from "../molecules/code-editor-dialog";
import DialogTemplate from "../molecules/dialog-template";
import { StatCard } from "../molecules/stat-card";
import TableSkeleton from "../molecules/table-skeleton";
import DeleteUserForm from "../organisms/delete-user-form";
import EditUserForm from "../organisms/edit-user-form";

export default function UsersPage() {
  const pathSegments = usePathSegments();
  const { dialogType } = useIsDialogOpenStore();
  const { selectedData } = useUserStore();
  const { data, isLoading, refetch } = useUsers();

  const userData: TUser[] = useMemo(() => data?.data || [], [data]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Data Pengguna" />
          <Description text="Data pengguna yang tersedia" />
        </div>
        <Link href={`${pathSegments.raw}/add`}>
          <Button>
            <PlusCircle />
            Tambah Data Pengguna
          </Button>
        </Link>
      </div>
      <hr className="my-4" />
      {data && (
        <div className="mb-4">
          <CodeEditorDialog content={data} />
        </div>
      )}
      {isLoading ? (
        <TableSkeleton rowCount={10} columnCount={3} />
      ) : (
        <div className="space-y-4">
          <StatCard
            title="Total Pengguna"
            value={userData.length || 0}
            description="Total Pengguna di Kelurahan"
            icon={Users}
          />
          <DataTable
            columns={userColumns}
            data={userData}
            filteringKey="name"
            refetch={refetch}
          />
        </div>
      )}

      {dialogType == "delete" && selectedData && (
        <DialogTemplate
          title="Hapus Data Pengguna"
          description={`Aksi ini akan menghapus data pengguna ${selectedData.name}. Apakah anda yakin?`}>
          <DeleteUserForm user={selectedData} />
        </DialogTemplate>
      )}
      {dialogType == "edit" && selectedData && (
        <DialogTemplate
          title="Perbarui Data Pengguna"
          description={`Aksi ini akan mengperbarui data pengguna ${selectedData.name}. `}>
          <EditUserForm user={selectedData} />
        </DialogTemplate>
      )}
    </div>
  );
}
