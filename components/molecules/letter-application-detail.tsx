import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  FileText,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { useApproveLetterApplication } from "@/hooks/use-letter-applications";
import {
  TLetterApplication,
  TLetterApplicationWithRelation,
} from "@/schemas/letter-application-schema";
import { TUser } from "@/schemas/user-schema";

import LoadingIcon from "../atoms/loading-icon";
import ApproveLetterApplicationForm from "../organisms/approve-letter-application-form";
import RejectLetterApplicationForm from "../organisms/reject-letter-application-form";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

interface Props {
  letterApplication: TLetterApplicationWithRelation;
  approvedBy: TUser;
}

export default function LetterApplicationDetail({
  letterApplication,
  approvedBy,
}: Props) {
  const { isPending, mutateAsync } = useApproveLetterApplication();

  async function onSubmit() {
    if (!approvedBy) {
      toast.error("Pengguna belum login");
      return;
    }
    const payload: Partial<TLetterApplication> = { approved_by: approvedBy.id };

    const res = await mutateAsync({
      id: letterApplication.id as number,
      payload,
    });
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { variant: "outline" as const, label: "Baru", icon: Clock },
      on_progress: {
        variant: "secondary" as const,
        label: "Diproses",
        icon: Clock,
      },
      approved: {
        variant: "success" as const,
        label: "Disetujui",
        icon: CheckCircle,
      },
      rejected: {
        variant: "destructive" as const,
        label: "Ditolak",
        icon: XCircle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    const Icon = config.icon;

    return (
      <Badge className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">
            Review Pengajuan Surat
          </h2>
          <p className="text-muted-foreground">
            Tinjau detail pengajuan sebelum menyetujui
          </p>
        </div>
        {getStatusBadge(letterApplication.status as string)}
      </div>

      <div className="gap-6">
        {/* Informasi Surat */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Informasi Surat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="gap-4 grid grid-cols-2">
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground text-sm">
                  Nomor Surat
                </p>
                <p className="font-medium">
                  {letterApplication.letter_number || "Belum ada"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground text-sm">
                  Jenis Surat
                </p>
                <p className="font-medium">
                  {letterApplication.letter_type?.letter_name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {letterApplication.letter_type?.letter_code}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground text-sm">
                  Tanggal Pengajuan
                </p>
                <p className="font-medium">
                  {letterApplication.submission_date &&
                    formatDate(letterApplication.submission_date.toString())}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground text-sm">
                  Tanggal Persetujuan
                </p>
                <p className="font-medium">
                  {letterApplication.approval_date
                    ? formatDate(letterApplication.approval_date.toString())
                    : "Belum disetujui"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">
                Deskripsi / Keterangan
              </p>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm">
                  {letterApplication.description || "Tidak ada deskripsi"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informasi Pemohon */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informasi Pemohon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-sm">
                Nama Lengkap
              </p>
              <p className="font-medium">{letterApplication.resident?.name}</p>
            </div>

            <div className="gap-4 grid grid-cols-2">
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground text-sm">NIK</p>
                <p className="font-mono text-sm">
                  {letterApplication.resident?.national_number_id}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground text-sm">
                  Jenis Kelamin
                </p>
                <p className="font-medium capitalize">
                  {letterApplication.resident?.gender === "male"
                    ? "Laki-laki"
                    : "Perempuan"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground text-sm">
                  RT/RW
                </p>
                <p className="font-medium">
                  {letterApplication.resident?.rt}/
                  {letterApplication.resident?.rw}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground text-sm">
                  Agama
                </p>
                <p className="font-medium">
                  {letterApplication.resident?.religion}
                </p>
              </div>
            </div>

            <Separator />

            <div className="gap-4 grid grid-cols-2">
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground text-sm">
                  Tempat, Tanggal Lahir
                </p>
                <p className="font-medium">
                  {letterApplication.resident?.place_of_birth},{" "}
                  {formatDate(
                    letterApplication.resident?.date_of_birth.toString() || ""
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground text-sm">
                  Pekerjaan
                </p>
                <p className="font-medium">
                  {letterApplication.resident?.occupation}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground text-sm">
                  Status Perkawinan
                </p>
                <p className="font-medium">
                  {letterApplication.resident?.marital_status}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground text-sm">
                  Pendidikan
                </p>
                <p className="font-medium">
                  {letterApplication.resident?.education}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informasi Orang Tua */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Orang Tua</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="gap-4 grid md:grid-cols-2">
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">
                Nama Ayah
              </p>
              <p className="font-medium">
                {letterApplication.resident?.father_name}
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-muted-foreground text-sm">
                Nama Ibu
              </p>
              <p className="font-medium">
                {letterApplication.resident?.mother_name}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Tindakan Persetujuan
          </CardTitle>
          <CardDescription>
            Setelah meninjau semua informasi, Anda dapat menyetujui pengajuan
            ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-4">
            <div className="space-y-1">
              <p className="font-medium text-sm">
                Disetujui oleh:{" "}
                <span className="font-bold">{approvedBy.name}</span>
              </p>
              <p className="text-muted-foreground text-xs">
                {formatDate(new Date().toISOString())}
              </p>
            </div>
          </div>
          {letterApplication.status == "new" && (
            <div className="space-y-2 mt-4">
              <ApproveLetterApplicationForm
                letterApplication={letterApplication}
                approvedBy={approvedBy}
              />
              <RejectLetterApplicationForm
                letterApplication={letterApplication}
                approvedBy={approvedBy}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
