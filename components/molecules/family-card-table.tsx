import { Copy, Eye, Pencil } from "lucide-react";
import Link from "next/link";

import { ButtonOutlineGreen } from "@/consts/button-css";
import { StatusHubunganDalamKeluarga } from "@/consts/data-definitions";
import { usePathSegments } from "@/hooks/use-path-segment";
import {
  calculateAge,
  formatDate,
  handleCopy,
  handleCopyKKData,
} from "@/lib/utils";
import { TFamilyCardWithRelation } from "@/schemas/family-card-schema";
import { TFamilyMemberWithRelation } from "@/schemas/family-member-schema";
import { TResident } from "@/schemas/resident-schema";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { TRelationship } from "@/types/types";

import { Description, Heading2 } from "../atoms/typography";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import DialogDeleteResidentFromFamilyCard from "./dialog-delete-resident-from-family-card";
import DialogEditRelationship from "./dialog-edit-relationship";
import SheetAddResientToFamilyCard from "./sheet-add-resident-to-family-card";

interface Props {
  familyCardData: TFamilyCardWithRelation;
  includeAction?: boolean;
}

export default function FamilyCardTable({
  familyCardData,
  includeAction = true,
}: Props) {
  const pathSegments = usePathSegments();

  return (
    <div>
      {includeAction && (
        <>
          <div className="flex flex-wrap justify-between items-center gap-4">
            <Button
              variant={"outline"}
              onClick={() => handleCopyKKData(familyCardData)}>
              <Copy /> Copy Data
            </Button>

            <Link href={`${pathSegments.getPathWithoutLast()}/edit`}>
              <Button variant={"outline"} className={ButtonOutlineGreen}>
                <Pencil />
                Edit Data Kartu Keluarga
              </Button>
            </Link>
          </div>
          <hr className="my-4" />
        </>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Atribut</TableHead>
            <TableHead>Nilai</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Nama Kepala Keluarga</TableCell>
            <TableCell className="uppercase">
              {familyCardData?.head_of_family_name || "-"}
            </TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy(
                    (familyCardData?.head_of_family_name.toUpperCase() as string) ||
                      "-"
                  )
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Alamat</TableCell>
            <TableCell className="uppercase">
              {familyCardData?.address || "-"}
            </TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy(
                    (familyCardData?.address.toUpperCase() as string) || "-"
                  )
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Lingkungan</TableCell>
            <TableCell className="uppercase">
              {familyCardData?.region?.name}
            </TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy(
                    familyCardData?.region?.name.toUpperCase() as string
                  )
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Tanggal Penerbitan</TableCell>
            <TableCell>
              {formatDate(familyCardData?.publication_date.toString())}
            </TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy(
                    formatDate(familyCardData?.publication_date.toString())
                  )
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Terakhir Diperbarui</TableCell>
            <TableCell>
              {formatDate(familyCardData?.updated_at?.toString() as string)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <hr className="my-4" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <Heading2 text="Daftar Anggota Keluarga" />
            <Description text="Daftar anggota keluarga yang tersedia" />
          </div>
          {includeAction && (
            <SheetAddResientToFamilyCard
              familyCardId={familyCardData.id as number}
            />
          )}
        </div>

        <Table>
          <TableCaption>
            {familyCardData?.family_members?.length == 0
              ? "Belum ada anggota keluarga"
              : "Daftar Anggota Keluarga"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Status Hubungan Keluarga</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jenis Kelamin</TableHead>
              <TableHead>Tanggal Lahir</TableHead>
              <TableHead>Usia</TableHead>
              <TableHead>Nama Ayah</TableHead>
              <TableHead>Nama Ibu</TableHead>
              {includeAction && <TableHead>Aksi</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {familyCardData?.family_members
              ?.slice()
              .sort(
                (
                  a: TFamilyMemberWithRelation,
                  b: TFamilyMemberWithRelation
                ) => {
                  const indexA = StatusHubunganDalamKeluarga.indexOf(
                    a.relationship as TRelationship
                  );
                  const indexB = StatusHubunganDalamKeluarga.indexOf(
                    b.relationship as TRelationship
                  );

                  if (indexA !== indexB) {
                    return indexA - indexB;
                  }

                  const dateA = new Date(a.resident?.date_of_birth || "");
                  const dateB = new Date(b.resident?.date_of_birth || "");
                  return dateA.getTime() - dateB.getTime();
                }
              )
              .map((familyMember: TFamilyMemberWithRelation, index: number) => {
                const resident: TResident = familyMember.resident!;

                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="flex justify-between items-center uppercase">
                      <span>{familyMember.relationship}</span>
                      {includeAction && (
                        <DialogEditRelationship
                          relationship={
                            familyMember.relationship as TRelationship
                          }
                          familyCardId={familyCardData.id as number}
                          familyMember={familyMember}
                        />
                      )}
                    </TableCell>
                    <TableCell className="uppercase">{resident.name}</TableCell>
                    <TableCell className="uppercase">
                      {resident.gender}
                    </TableCell>
                    <TableCell className="uppercase">
                      {formatDate(resident.date_of_birth.toString())}
                    </TableCell>
                    <TableCell className="uppercase">
                      {calculateAge(resident.date_of_birth).years || 0}
                    </TableCell>
                    <TableCell className="uppercase">
                      {resident.father_name}
                    </TableCell>
                    <TableCell className="uppercase">
                      {resident.mother_name}
                    </TableCell>
                    {includeAction && (
                      <TableCell className="flex gap-2">
                        <Link
                          href={`/admin/dashboard/residents/${resident.id}/detail`}>
                          <Button variant={"outline"}>
                            <Eye />
                          </Button>
                        </Link>
                        <Link
                          href={`/admin/dashboard/residents/${resident.id}/edit`}>
                          <Button variant={"outline"}>
                            <Pencil />
                          </Button>
                        </Link>
                        {includeAction && (
                          <DialogDeleteResidentFromFamilyCard
                            familyCardId={familyCardData.id as number}
                            memberId={familyMember.id as number}
                          />
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
