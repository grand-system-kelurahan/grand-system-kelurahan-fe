"use client";

import { PlusCircle, Users } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Description, Heading1 } from "@/components/atoms/typography";
import { Button } from "@/components/ui/button";
import { useFamilyCards } from "@/hooks/use-family-cards";
import { usePathSegments } from "@/hooks/use-path-segment";
import { TFamilyCardWithRelation } from "@/schemas/family-card-schema";
import { useFamilyCardStore } from "@/stores/use-family-card-store";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";

import { familyCardColumns } from "../data-table/columns/family-card-columns";
import { DataTable } from "../data-table/data-table";
import CodeEditorDialog from "../molecules/code-editor-dialog";
import DialogTemplate from "../molecules/dialog-template";
import { StatCard } from "../molecules/stat-card";
import TableSkeleton from "../molecules/table-skeleton";
import DeleteFamilyCardForm from "../organisms/delete-family-card-form";

export default function FamilyCardsPage() {
  const pathSegments = usePathSegments();
  const { dialogType } = useIsDialogOpenStore();
  const { selectedData } = useFamilyCardStore();
  const { data, isLoading, refetch } = useFamilyCards();

  const familyCardsData: TFamilyCardWithRelation[] = useMemo(
    () => data?.data?.family_cards || [],
    [data]
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Data Kartu Keluarga" />
          <Description text="Data kartu keluarga yang tersedia" />
        </div>
        <Link href={`${pathSegments.raw}/add`}>
          <Button>
            <PlusCircle />
            Tambah Data Kartu Keluarga
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
            title="Total Kartu Keluarga"
            value={familyCardsData.length || 0}
            description="Total kartu keluarga di Kelurahan"
            icon={Users}
          />
          <DataTable
            columns={familyCardColumns}
            data={familyCardsData}
            filteringKey="head_of_family_name"
            refetch={refetch}
          />
        </div>
      )}
      {dialogType == "delete" && selectedData && (
        <DialogTemplate
          title="Hapus Data Penduduk"
          description={`Aksi ini akan menghapus data penduduk ${selectedData.head_of_family_name}. Apakah anda yakin?`}>
          <DeleteFamilyCardForm familyCard={selectedData} />
        </DialogTemplate>
      )}
    </div>
  );
}
