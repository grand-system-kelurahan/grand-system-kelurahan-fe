"use client";

import { Users } from "lucide-react";
import { useMemo } from "react";

import { Description, Heading1 } from "@/components/atoms/typography";
import { useResidentById } from "@/hooks/use-residents";
import { TResident, TResidentWithRelation } from "@/schemas/resident-schema";

import ButtonBack from "../atoms/button-back";
import CodeEditorDialog from "../molecules/code-editor-dialog";
import { EmptyOutline } from "../molecules/empty-outline";
import PendudukTable from "../molecules/resident-table";
import TableSkeleton from "../molecules/table-skeleton";

interface Props {
  id: number;
}

export default function ResidentDetailPage({ id }: Props) {
  const { data, isLoading, error } = useResidentById(id);
  const residentsData: TResidentWithRelation = useMemo(
    () => data?.data.resident,
    [data]
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Detail Data Penduduk" />
          <Description text="Detail informasi penduduk yang tersedia" />
        </div>
        <ButtonBack />
      </div>
      <hr className="my-4" />
      {data && (
        <div className="mb-4">
          <CodeEditorDialog content={data} />
        </div>
      )}

      {isLoading ? (
        <TableSkeleton columnCount={3} rowCount={10} />
      ) : residentsData ? (
        <PendudukTable residentData={residentsData} />
      ) : (
        <EmptyOutline
          title="Data Tidak Ditemukan"
          description="Data penduduk yang Anda cari tidak ditemukan."
          icon={Users}
        />
      )}
    </div>
  );
}
