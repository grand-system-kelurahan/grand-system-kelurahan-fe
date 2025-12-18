"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { LetterTextIcon } from "lucide-react";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useMyLetterApplications } from "@/hooks/use-letter-applications";
import { TLetterApplicationWithRelation } from "@/schemas/letter-application-schema";

import { Description, Heading1 } from "../atoms/typography";
import CodeEditorDialog from "../molecules/code-editor-dialog";
import { EmptyOutline } from "../molecules/empty-outline";

export default function MyLetterApplicationPage() {
  const { data, isLoading } = useMyLetterApplications();
  const letterApplicationsData: TLetterApplicationWithRelation[] = useMemo(
    () => data?.data?.letter_applications || [],
    [data]
  );

  // Fungsi untuk menentukan warna badge berdasarkan status
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "new":
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "processed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  // Format tanggal Indonesia
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: id });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Heading1 text="Pengajuan Surat Saya" />
        <Description text="Daftar pengajuan surat yang telah diajukan" />
      </div>

      <Separator />

      {/* Debug JSON Dialog */}
      {data && <CodeEditorDialog content={data} />}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="border-gray-900 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : letterApplicationsData.length === 0 ? (
        <EmptyOutline
          title="Data Tidak Ditemukan"
          description="Data pengajuan surat tidak ditemukan, silahkan ajukan surat jika diperlukan"
          icon={LetterTextIcon}
        />
      ) : (
        <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-2">
          {letterApplicationsData.map((application) => (
            <Card key={application.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {application.letter_type?.letter_name ||
                        "Surat Tidak Diketahui"}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Kode: {application.letter_type?.letter_code || "-"}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(application.status || "")}>
                    {application.status?.toUpperCase() || "UNKNOWN"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                {/* Informasi Warga */}
                <div className="mb-4 rounded-md">
                  <h4 className="mb-2 font-semibold text-sm">Data Pemohon</h4>
                  <div className="gap-2 grid grid-cols-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Nama:</span>
                      <p className="font-medium">
                        {application.resident?.name || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">NIK:</span>
                      <p className="font-medium">
                        {application.resident?.national_number_id || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">TTL:</span>
                      <p className="font-medium">
                        {application.resident?.place_of_birth || "-"},{" "}
                        {formatDate(
                          application.resident?.date_of_birth.toString()
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Jenis Kelamin:
                      </span>
                      <p className="font-medium">
                        {application.resident?.gender || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informasi Pengajuan */}
                <div className="space-y-3">
                  <div className="gap-4 grid grid-cols-2">
                    <div>
                      <h4 className="font-medium text-muted-foreground text-sm">
                        No. Surat
                      </h4>
                      <p className="text-sm">
                        {application.letter_number || "-"}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-muted-foreground text-sm">
                        Tanggal Pengajuan
                      </h4>
                      <p className="text-sm">
                        {formatDate(
                          application.submission_date?.toString() as string
                        )}
                      </p>
                    </div>
                  </div>

                  {application.approval_date && (
                    <div>
                      <h4 className="font-medium text-muted-foreground text-sm">
                        Tanggal Disetujui
                      </h4>
                      <p className="text-sm">
                        {formatDate(
                          application.approval_date.toString() as string
                        )}
                      </p>
                    </div>
                  )}

                  {application.description && (
                    <div>
                      <h4 className="font-medium text-muted-foreground text-sm">
                        Keterangan
                      </h4>
                      <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                        {application.description}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
