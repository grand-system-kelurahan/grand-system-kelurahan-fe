"use client";

import { PlusCircle, Users } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Description, Heading1 } from "@/components/atoms/typography";
import { Button } from "@/components/ui/button";
import { useLetterTypes } from "@/hooks/use-letter-types";
import { usePathSegments } from "@/hooks/use-path-segment";
import { TLetterType } from "@/schemas/letter-type-schema";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useLetterTypeStore } from "@/stores/use-letter-type-store";

import { letterTypeColumns } from "../data-table/columns/letter-type-columns";
import { DataTable } from "../data-table/data-table";
import CodeEditorDialog from "../molecules/code-editor-dialog";
import DialogTemplate from "../molecules/dialog-template";
import { StatCard } from "../molecules/stat-card";
import TableSkeleton from "../molecules/table-skeleton";
import AddLetterTypeForm from "../organisms/add-letter-type-form";
import DeleteLetterTypeForm from "../organisms/delete-letter-type-form";
import EditLetterTypeForm from "../organisms/edit-letter-type-form";

export default function LetterTypesPage() {
  const { dialogType } = useIsDialogOpenStore();
  const { selectedData } = useLetterTypeStore();
  const { openDialog } = useIsDialogOpenStore();
  const { data, isLoading, refetch } = useLetterTypes();

  const letterTypesData: TLetterType[] = useMemo(
    () => data?.data?.letterType || [],
    [data]
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Data Jenis Surat" />
          <Description text="Data jenis surat yang tersedia" />
        </div>
        <Button onClick={() => openDialog("add")}>
          <PlusCircle />
          Tambah Data Jenis Surat
        </Button>
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
            title="Total Jenis Surat"
            value={letterTypesData.length || 0}
            description="Total jenis surat di Kelurahan"
            icon={Users}
          />
          <DataTable
            columns={letterTypeColumns}
            data={letterTypesData}
            filteringKey="letter_name"
            refetch={refetch}
          />
        </div>
      )}

      {dialogType == "add" && (
        <DialogTemplate
          title="Tambah Data Jenis Surat"
          description={`Silahkan isi form berikut untuk menambahkan data jenis surat baru`}>
          <AddLetterTypeForm />
        </DialogTemplate>
      )}
      {dialogType == "edit" && selectedData && (
        <DialogTemplate
          title="Edit Data Jenis Surat"
          description={`Silahkan isi form berikut untuk mengedit data jenis surat baru`}>
          <EditLetterTypeForm letterType={selectedData} />
        </DialogTemplate>
      )}
      {dialogType == "delete" && selectedData && (
        <DialogTemplate
          title="Hapus Data Jenis Surat"
          description={`Aksi ini akan menghapus data jenis surat ${selectedData.letter_name}. Apakah anda yakin?`}>
          <DeleteLetterTypeForm letterType={selectedData} />
        </DialogTemplate>
      )}
    </div>
  );
}
