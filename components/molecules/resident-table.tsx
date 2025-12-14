import { Copy, Pencil } from "lucide-react";
import Link from "next/link";

import { usePathSegments } from "@/hooks/use-path-segment";
import {
  calculateAge,
  formatDate,
  handleCopy,
  handleCopyPendudukData,
} from "@/lib/utils";
import { TResidentWithRelation } from "@/schemas/resident-schema";

import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

interface Props {
  residentData: TResidentWithRelation;
}

export default function ResidentTable({ residentData }: Props) {
  const pathSegments = usePathSegments();
  const ageInit = calculateAge(residentData.date_of_birth.toString());
  const age = `${ageInit.years} Tahun, ${ageInit.months} Bulan, ${ageInit.days} Hari`;
  return (
    <div>
      <>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <Button
            variant={"outline"}
            onClick={() => handleCopyPendudukData(residentData)}>
            <Copy /> Copy Data
          </Button>
          <div className="flex gap-2">
            {/* {residentData.kkRef && (
                <Link
                  href={`/dashboard/${pathSegments.all[1]}/kartu-keluarga/${residentData.kkRef}/detail`}>
                  <Button variant={"outline"}>
                    <Eye />
                    Kartu Keluarga
                  </Button>
                </Link>
              )} */}
            <Link href={`${pathSegments.getPathWithoutLast()}/edit`}>
              <Button variant={"outline"}>
                <Pencil />
                Edit Data Penduduk
              </Button>
            </Link>
          </div>
        </div>
        <hr className="my-4" />
      </>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">NIK</TableCell>
            <TableCell className="uppercase">
              {(residentData?.national_number_id as string) || "-"}
            </TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy(
                    (residentData?.national_number_id.toUpperCase() as string) ||
                      "-"
                  )
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Nama Lengkap</TableCell>
            <TableCell className="uppercase">
              {(residentData?.name as string) || "-"}
            </TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy(
                    (residentData?.name.toUpperCase() as string) || "-"
                  )
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          {/* <TableRow>
            <TableCell className="font-medium">Lingkungan</TableCell>
            <TableCell className="uppercase">
              {residentData?.lingkungan}
            </TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy(
                    (residentData?.lingkungan.toUpperCase() as string) || "-"
                  )
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow> */}
          <TableRow>
            <TableCell className="font-medium">Jenis Kelamin</TableCell>
            <TableCell className="uppercase">{residentData?.gender}</TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy(residentData?.gender.toUpperCase() as string)
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Tempat Lahir</TableCell>
            <TableCell className="uppercase">
              {residentData?.place_of_birth || "-"}
            </TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy(
                    (residentData?.place_of_birth.toUpperCase() as string) ||
                      "-"
                  )
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Tanggal Lahir</TableCell>
            <TableCell>
              {formatDate(residentData?.date_of_birth.toString()) || "-"}
            </TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy(
                    formatDate(residentData?.date_of_birth.toString()) as string
                  ) || "-"
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Usia</TableCell>
            <TableCell className="uppercase">{age || "-"}</TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() => handleCopy(age?.toUpperCase() || "-")}>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Agama</TableCell>
            <TableCell className="uppercase">
              {residentData?.religion || "-"}
            </TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy(
                    (residentData?.religion.toUpperCase() as string) || "-"
                  )
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Pendidikan</TableCell>
            <TableCell className="uppercase">
              {residentData?.education || "-"}
            </TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy(
                    (residentData?.education.toUpperCase() as string) || "-"
                  )
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Jenis Pekerjaan</TableCell>
            <TableCell className="uppercase">
              {residentData?.occupation || "-"}
            </TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy(
                    (residentData?.occupation.toUpperCase() as string) || "-"
                  )
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Status Perkawinan</TableCell>
            <TableCell className="uppercase">
              {residentData?.marital_status || "-"}
            </TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy(
                    (residentData?.marital_status.toUpperCase() as string) ||
                      "-"
                  )
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Kewarganegaraan</TableCell>
            <TableCell className="uppercase">
              {residentData?.citizenship || "-"}
            </TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy(
                    (residentData?.citizenship.toUpperCase() as string) || "-"
                  )
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Golongan Darah</TableCell>
            <TableCell className="uppercase">
              {residentData?.blood_type || "-"}
            </TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy((residentData?.blood_type as string) || "-")
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Penyandang Cacat</TableCell>
            <TableCell className="uppercase">
              {residentData?.disabilities || "-"}
            </TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy(
                    (residentData?.disabilities.toUpperCase() as string) || "-"
                  )
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Nama Ayah</TableCell>
            <TableCell className="uppercase">
              {residentData?.father_name || "-"}
            </TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy(
                    (residentData?.father_name.toUpperCase() as string) || "-"
                  )
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Nama Ibu</TableCell>
            <TableCell className="uppercase">
              {residentData?.mother_name.toUpperCase() || "-"}
            </TableCell>
            <TableCell>
              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() =>
                  handleCopy(
                    (residentData?.mother_name.toUpperCase() as string) || "-"
                  )
                }>
                <Copy />
              </Button>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Terakhir Diperbarui</TableCell>
            <TableCell className="flex flex-col gap-2">
              {formatDate(residentData?.updated_at?.toString()).toUpperCase() ||
                "-"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
