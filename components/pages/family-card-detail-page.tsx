"use client";

import { Users } from "lucide-react";
import { useMemo } from "react";

import { Description, Heading1 } from "@/components/atoms/typography";
import { useFamilyCardById } from "@/hooks/use-family-cards";
import { TFamilyCardWithRelation } from "@/schemas/family-card-schema";

import ButtonBack from "../atoms/button-back";
import CodeEditorDialog from "../molecules/code-editor-dialog";
import { EmptyOutline } from "../molecules/empty-outline";
import FamilyCardTable from "../molecules/family-card-table";
import TableSkeleton from "../molecules/table-skeleton";

interface Props {
  id: number;
}

export default function FamilyCardDetailPage({ id }: Props) {
  const { data, isLoading } = useFamilyCardById(id);
  const kartuKeluargaData: TFamilyCardWithRelation = useMemo(
    () => data?.data?.family_card,
    [data]
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Detail Data Kartu Keluarga" />
          <Description text="Detail informasi kartu keluarga yang tersedia" />
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
        <TableSkeleton columnCount={3} rowCount={6} />
      ) : kartuKeluargaData ? (
        <FamilyCardTable familyCardData={kartuKeluargaData} />
      ) : (
        <EmptyOutline
          title="Data Tidak Ditemukan"
          description="Data kartu keluarga yang Anda cari tidak ditemukan."
          icon={Users}
        />
      )}
    </div>
  );
}
