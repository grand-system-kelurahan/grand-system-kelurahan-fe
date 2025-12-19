"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Edit,
  FileText,
  UserCheck,
  Users,
  UserX,
  XCircle,
} from "lucide-react";
import { useMemo } from "react";

import { Description, Heading1 } from "@/components/atoms/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useResidentVerificationById } from "@/hooks/use-resident-verifications";
import { TResidentVerificationWithRelation } from "@/schemas/resident-verification-schema";

import ButtonBack from "../atoms/button-back";
import CodeEditorDialog from "../molecules/code-editor-dialog";
import { EmptyOutline } from "../molecules/empty-outline";
import TableSkeleton from "../molecules/table-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface Props {
  id: number;
}

// Helper untuk format tanggal
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper untuk parse verified_data
const parseVerifiedData = (verifiedDataString: string) => {
  try {
    return JSON.parse(verifiedDataString);
  } catch {
    return null;
  }
};

export default function ResidentVerificationDetailPage({ id }: Props) {
  const { data, isLoading, error } = useResidentVerificationById(id);

  const residentVerification: TResidentVerificationWithRelation = useMemo(
    () => data?.data,
    [data]
  );

  const verifiedData = useMemo(() => {
    if (!residentVerification?.verified_data) return null;
    return parseVerifiedData(residentVerification.verified_data);
  }, [residentVerification]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Heading1 text="Detail Verifikasi Penduduk" />
            <Description text="Memuat detail verifikasi..." />
          </div>
          <ButtonBack />
        </div>
        <TableSkeleton columnCount={2} rowCount={10} />
      </div>
    );
  }

  if (error || !residentVerification) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Heading1 text="Detail Verifikasi Penduduk" />
            <Description text="Terjadi kesalahan saat memuat data" />
          </div>
          <ButtonBack />
        </div>
        <EmptyOutline
          title="Data Tidak Ditemukan"
          description="Data verifikasi yang Anda cari tidak ditemukan."
          icon={Users}
        />
      </div>
    );
  }

  // Konfigurasi status
  const statusConfig = {
    pending: {
      label: "Pending",
      icon: AlertCircle,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      variant: "outline" as const,
    },
    verified: {
      label: "Terverifikasi",
      icon: CheckCircle,
      color: "bg-green-100 text-green-800 border-green-200",
      variant: "success" as const,
    },
    rejected: {
      label: "Ditolak",
      icon: XCircle,
      color: "bg-red-100 text-red-800 border-red-200",
      variant: "destructive" as const,
    },
  };

  const statusKey = residentVerification.status as keyof typeof statusConfig;
  const status = statusConfig[statusKey] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Detail Verifikasi Penduduk" />
          <Description text="Detail informasi verifikasi data penduduk" />
        </div>
        <div className="flex items-center gap-2">
          <ButtonBack />
          {data && <CodeEditorDialog content={data} />}
        </div>
      </div>

      {/* Status Banner */}
      <Card className={`${status.color} border`}>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <StatusIcon className="w-8 h-8" />
              <div>
                <h3 className="font-semibold text-lg">{status.label}</h3>
                <p className="opacity-80 text-sm">
                  Status verifikasi data penduduk
                </p>
              </div>
            </div>
            <Badge className="text-sm">{residentVerification.status}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabs untuk detail */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Informasi Verifikasi
          </TabsTrigger>
          <TabsTrigger value="resident" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Data Penduduk
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Perbandingan Data
          </TabsTrigger>
          <TabsTrigger value="metadata" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Metadata
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Informasi Verifikasi */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Verifikasi</CardTitle>
              <CardDescription>
                Detail proses dan status verifikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
                {/* Informasi Dasar */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Informasi Dasar</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        ID Verifikasi
                      </span>
                      <span className="font-medium">
                        {residentVerification.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        ID Penduduk
                      </span>
                      <span className="font-medium">
                        {residentVerification.resident_id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        Tanggal Dibuat
                      </span>
                      <span className="font-medium">
                        {formatDate(
                          residentVerification.created_at?.toString() as string
                        )}
                      </span>
                    </div>
                    {residentVerification.verified_at && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-sm">
                          Tanggal Verifikasi
                        </span>
                        <span className="font-medium">
                          {formatDate(
                            residentVerification.verified_at.toString() as string
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Pemeriksa */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Status & Pemeriksa</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">
                        Status
                      </span>
                      <Badge>{status.label}</Badge>
                    </div>
                    {residentVerification.verifier && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground text-sm">
                            Diverifikasi Oleh
                          </span>
                          <span className="font-medium">
                            {residentVerification.verifier.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground text-sm">
                            Email Verifikator
                          </span>
                          <span className="font-medium">
                            {residentVerification.verifier.email}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground text-sm">
                            Role Verifikator
                          </span>
                          <Badge variant="outline">
                            {residentVerification.verifier.role}
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Catatan */}
                {residentVerification.notes && (
                  <div className="space-y-3 md:col-span-2">
                    <h3 className="font-semibold">Catatan Verifikasi</h3>
                    <div className="bg-muted/50 p-4 border rounded-lg">
                      <p className="whitespace-pre-wrap">
                        {residentVerification.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Data Penduduk */}
        <TabsContent value="resident">
          <Card>
            <CardHeader>
              <CardTitle>Data Penduduk</CardTitle>
              <CardDescription>Data penduduk yang diverifikasi</CardDescription>
            </CardHeader>
            <CardContent>
              {residentVerification.resident ? (
                <div className="space-y-6">
                  {/* Data dari Database */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Data di Database</h3>
                      <Badge variant="outline">Current</Badge>
                    </div>
                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(residentVerification.resident).map(
                        ([key, value]) => (
                          <div key={key} className="space-y-1">
                            <p className="font-medium text-muted-foreground text-sm capitalize">
                              {key.replace(/_/g, " ")}
                            </p>
                            <p className="font-medium truncate">
                              {value?.toString() || "-"}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Data dari verified_data */}
                  {verifiedData && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">
                          Data yang Diverifikasi
                        </h3>
                        <Badge variant="secondary">Verified Snapshot</Badge>
                      </div>
                      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(verifiedData).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <p className="font-medium text-muted-foreground text-sm capitalize">
                              {key.replace(/_/g, " ")}
                            </p>
                            <p className="font-medium truncate">
                              {value?.toString() || "-"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyOutline
                  title="Data Penduduk Tidak Tersedia"
                  description="Data penduduk tidak ditemukan"
                  icon={Users}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Perbandingan Data */}
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Perbandingan Data</CardTitle>
              <CardDescription>
                Perbandingan antara data database dan data yang diverifikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              {residentVerification.resident && verifiedData ? (
                <div className="space-y-4">
                  <div className="gap-4 grid grid-cols-3 font-medium text-sm">
                    <div>Field</div>
                    <div>Database</div>
                    <div>Verified Data</div>
                  </div>
                  <Separator />

                  {Object.keys(verifiedData).map((key) => {
                    if (key === "created_at" || key === "updated_at")
                      return null;

                    const dbValue =
                      residentVerification.resident?.[
                        key as keyof typeof residentVerification.resident
                      ];
                    const verifiedValue = verifiedData[key];
                    const isDifferent = dbValue !== verifiedValue;

                    return (
                      <div
                        key={key}
                        className="items-center gap-4 grid grid-cols-3 py-2">
                        <div className="font-medium capitalize">
                          {key.replace(/_/g, " ")}
                        </div>
                        <div
                          className={`p-2 rounded ${
                            isDifferent ? "bg-yellow-50" : ""
                          }`}>
                          {dbValue?.toString() || "-"}
                        </div>
                        <div
                          className={`p-2 rounded ${
                            isDifferent ? "bg-green-50" : ""
                          }`}>
                          {verifiedValue?.toString() || "-"}
                          {isDifferent && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Changed
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Data perbandingan tidak tersedia
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Metadata */}
        <TabsContent value="metadata">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
              <CardDescription>
                Informasi teknis dan metadata verifikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Timestamps */}
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Timestamps</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Created At:
                        </span>
                        <span>
                          {formatDate(
                            residentVerification.created_at?.toString() as string
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Updated At:
                        </span>
                        <span>
                          {formatDate(
                            residentVerification.updated_at?.toString() as string
                          )}
                        </span>
                      </div>
                      {residentVerification.verified_at && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Verified At:
                          </span>
                          <span>
                            {formatDate(
                              residentVerification.verified_at?.toString()
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">System Info</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Verification ID:
                        </span>
                        <code className="font-mono">
                          {residentVerification.id}
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Resident ID:
                        </span>
                        <code className="font-mono">
                          {residentVerification.resident_id}
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Verified By ID:
                        </span>
                        <code className="font-mono">
                          {residentVerification.verified_by || "-"}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Sizes */}
                <div className="pt-4 border-t">
                  <h3 className="mb-3 font-semibold">Data Sizes</h3>
                  <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
                    <div className="p-3 border rounded-lg text-center">
                      <p className="font-bold text-2xl">
                        {residentVerification.verified_data?.length || 0}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Verified Data Size (chars)
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <p className="font-bold text-2xl">
                        {Object.keys(verifiedData || {}).length}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Verified Fields
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <p className="font-bold text-2xl">
                        {residentVerification.notes?.length || 0}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Notes Length
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg text-center">
                      <p className="font-bold text-2xl">
                        {residentVerification.status}
                      </p>
                      <p className="text-muted-foreground text-sm">Status</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
