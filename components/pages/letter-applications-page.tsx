"use client";

import { PlusCircle, Users } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Description, Heading1 } from "@/components/atoms/typography";
import { Button } from "@/components/ui/button";
import { useLetterApplications } from "@/hooks/use-letter-applications";
import { usePathSegments } from "@/hooks/use-path-segment";
import { useUserLogin } from "@/hooks/use-users";
import {
  TLetterApplication,
  TLetterApplicationWithRelation,
} from "@/schemas/letter-application-schema";
import { TUser } from "@/schemas/user-schema";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { useLetterApplicationStore } from "@/stores/use-letter-application-store";

import { letterApplicationColumns } from "../data-table/columns/letter-application-columns";
import { DataTable } from "../data-table/data-table";
import CodeEditorDialog from "../molecules/code-editor-dialog";
import DialogTemplate from "../molecules/dialog-template";
import LetterApplicationDetail from "../molecules/letter-application-detail";
import { StatCard } from "../molecules/stat-card";
import TableSkeleton from "../molecules/table-skeleton";
import ApproveLetterApplicationForm from "../organisms/approve-letter-application-form";

export default function LetterApplicationsPage() {
  const pathSegments = usePathSegments();
  const { dialogType } = useIsDialogOpenStore();
  const { selectedData } = useLetterApplicationStore();
  const { data, isLoading, refetch } = useLetterApplications();
  const { data: user, isLoading: isLoadingUser } = useUserLogin();

  const letterApplicationsData: TLetterApplicationWithRelation[] = useMemo(
    () => data?.data?.letter_applications || [],
    [data]
  );

  const userData: TUser = useMemo(() => user?.data, [user]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Data Pengajuan Surat" />
          <Description text="Data pengajuan surat yang tersedia" />
        </div>
        <Link href={pathSegments.fullPath + "/new"}>
          <Button>
            <PlusCircle />
            Tambah Data Pengajuan
          </Button>
        </Link>
      </div>

      <hr className="my-4" />
      {data && (
        <div className="mb-4">
          <CodeEditorDialog content={data} />
        </div>
      )}
      {isLoading || isLoadingUser ? (
        <TableSkeleton rowCount={10} columnCount={3} />
      ) : (
        <div className="space-y-4">
          <StatCard
            title="Total Pengajuan Surat"
            value={letterApplicationsData.length || 0}
            description="Total pengajuan surat di Kelurahan"
            icon={Users}
          />
          <DataTable
            columns={letterApplicationColumns}
            data={letterApplicationsData}
            filteringKey="resident_name"
            refetch={refetch}
          />
        </div>
      )}

      {dialogType == "view" && selectedData && userData && (
        <DialogTemplate
          title="Terima Pengajuan Surat"
          description={`Anda akan menerima pengajuan surat dengan nomor ${selectedData.resident?.name}`}>
          <LetterApplicationDetail
            letterApplication={selectedData}
            approvedBy={userData}
          />
        </DialogTemplate>
      )}
    </div>
  );
}
