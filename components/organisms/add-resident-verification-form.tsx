/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
import { Calendar, Map } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Agama,
  GolonganDarah,
  JenisKelamin,
  JenisPekerjaan,
  Kewarganegaraan,
  Pendidikan,
  PenyandangCacat,
  StatusPerkawinan,
} from "@/consts/data-definitions";
import { useRegions } from "@/hooks/use-regions";
import { useCreateResidentVerification } from "@/hooks/use-resident-verifications";
import { useUserLogin } from "@/hooks/use-users";
import { mapToOptions } from "@/lib/utils";
import { TRegion } from "@/schemas/region-schema";
import { FormResidentSchema, TResident } from "@/schemas/resident-schema";
import {
  FormResidentVerificationSchema,
  TResidentVerification,
} from "@/schemas/resident-verification-schema";
import { TSelectOption } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";

import ButtonSave from "../atoms/button-save";
import { EmptyOutline } from "../molecules/empty-outline";
import FormSkeleton from "../molecules/form-skeleton";
import { InputDate } from "../molecules/input-date";
import { InputSelect } from "../molecules/input-select";
import { InputText } from "../molecules/input-text";
import { InputTextarea } from "../molecules/input-text-area";
import SheetChoiceResident from "../molecules/sheet-choice-resident";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form } from "../ui/form";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

// Gabungkan schema Resident dan Resident Verification
const AddResidentVerificationFormSchema = FormResidentVerificationSchema.merge(
  FormResidentSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
  }).extend({
    resident_id: z.number({ error: "Penduduk harus dipilih" }),
    status: z.enum(["pending", "verified", "rejected"]).default("pending"),
    notes: z.string().optional(),
    verified_at: z.date().optional(),
    // Override date_of_birth dari string ke Date untuk form
    date_of_birth: z.date({ error: "Tanggal lahir harus diisi" }),
  })
).omit({
  // verified_by: true,
  verified_data: true, // Akan di-generate dari data resident
});

type TAddResidentVerification = z.infer<
  typeof AddResidentVerificationFormSchema
>;

// Helper untuk konversi date string ke Date object
const parseDateString = (dateString: string | Date): Date => {
  if (dateString instanceof Date) return dateString;
  if (typeof dateString === "string") {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  }
  return new Date();
};

export default function AddResidentVerificationForm() {
  const [selectedResident, setSelectedResident] = useState<TResident | null>(
    null
  );
  const [isEditingData, setIsEditingData] = useState(false);

  const { data: user } = useUserLogin();

  const form = useForm<TAddResidentVerification>({
    defaultValues: {
      status: "pending",
      religion: "Islam",
      marital_status: "Belum Kawin",
      citizenship: "WNI",
      blood_type: "Tidak Tau",
      disabilities: "Tidak Cacat",
    },
  });

  // Load regions for dropdown
  const { data, isLoading: isLoadingRegions } = useRegions();
  const regionsData: TRegion[] = useMemo(() => data?.data || [], [data]);
  const regionOptions = mapToOptions(regionsData || [], "id", "name");

  // Options for dropdowns
  const jenisKelaminOptions: TSelectOption[] = [
    { value: "male", label: "Laki-laki" },
    { value: "female", label: "Perempuan" },
  ];

  const agamaOptions: TSelectOption[] = Agama.map((item) => ({
    value: item,
    label: item,
  }));

  const pendidikanOptions: TSelectOption[] = Pendidikan.map((item) => ({
    value: item,
    label: item,
  }));

  const jenisPekerjaanOptions: TSelectOption[] = JenisPekerjaan.map((item) => ({
    value: item,
    label: item,
  }));

  const statusPerkawinanOptions: TSelectOption[] = StatusPerkawinan.map(
    (item) => ({
      value: item,
      label: item,
    })
  );

  const kewarganegaraanOptions: TSelectOption[] = Kewarganegaraan.map(
    (item) => ({
      value: item,
      label: item,
    })
  );

  const golonganDarahOptions: TSelectOption[] = GolonganDarah.map((item) => ({
    value: item,
    label: item,
  }));

  const penyandangCacatOptions: TSelectOption[] = PenyandangCacat.map(
    (item) => ({
      value: item,
      label: item,
    })
  );

  const { mutateAsync, isPending } = useCreateResidentVerification();

  function handleResidentChange(resident: TResident | null) {
    setSelectedResident(resident);
    if (resident) {
      // Prefill form dengan data resident
      const residentData: Partial<TAddResidentVerification> = {
        resident_id: resident.id as number,
        status: "pending",
        national_number_id: resident.national_number_id,
        name: resident.name,
        gender: resident.gender,
        place_of_birth: resident.place_of_birth,
        date_of_birth: parseDateString(resident.date_of_birth),
        religion: resident.religion,
        rt: resident.rt,
        rw: resident.rw,
        education: resident.education,
        occupation: resident.occupation,
        marital_status: resident.marital_status,
        citizenship: resident.citizenship,
        blood_type: resident.blood_type,
        disabilities: resident.disabilities,
        father_name: resident.father_name,
        mother_name: resident.mother_name,
        region_id: resident.region_id,
      };

      form.reset(residentData);
      setIsEditingData(false);
    }
  }

  async function onSubmit(values: TAddResidentVerification) {
    if (!user) {
      toast.error("Anda belum login");
      return;
    }
    try {
      // Extract data untuk verified_data
      const { resident_id, status, notes, verified_at, ...residentData } =
        values;

      // Konversi Date object ke string untuk JSON
      const processedResidentData: TResident = {
        ...residentData,
        date_of_birth: residentData.date_of_birth,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Prepare verified_data sebagai string JSON
      const verifiedDataString = JSON.stringify(processedResidentData);

      // Prepare payload
      const payload: TResidentVerification = {
        resident_id,
        status,
        notes,
        verified_data: verifiedDataString,
        verified_by: user.id,
        verified_at: new Date(),
      };

      console.log(payload);

      const res = await mutateAsync(payload);
      console.log(res);
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  }

  useEffect(() => {
    if (selectedResident) {
      form.setValue("resident_id", selectedResident.id as number);
    }
  }, [selectedResident, form]);

  useEffect(() => {
    if (user) {
      form.setValue("verified_by", user.id as number);
    }
  }, [user, form]);

  if (isLoadingRegions) {
    return <FormSkeleton columnCount={2} rowCount={10} />;
  }

  if (regionsData.length === 0) {
    return (
      <EmptyOutline
        title="Data Lingkungan Tidak Ditemukan"
        description="Data lingkungan tidak ditemukan, silahkan tambahkan data lingkungan terlebih dahulu"
        icon={Map}
      />
    );
  }

  return (
    <div className="space-y-6">
      <pre>{JSON.stringify(user)}</pre>
      {/* Section 1: Pilih Penduduk */}
      <Card>
        <CardHeader>
          <CardTitle>1. Pilih Penduduk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Pilih Penduduk yang Akan Diverifikasi</Label>
            <p className="text-muted-foreground text-sm">
              Pilih penduduk dari database untuk memulai proses verifikasi data
            </p>
            <SheetChoiceResident
              resident={selectedResident}
              onResidentChoice={handleResidentChange}
            />
          </div>

          {selectedResident && (
            <div className="bg-muted/50 p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">Data Saat Ini di Database</h4>
                <Badge variant="outline">Original</Badge>
              </div>
              <div className="gap-3 grid grid-cols-2 text-sm">
                <div>
                  <span className="text-muted-foreground">NIK:</span>{" "}
                  <span className="font-medium">
                    {selectedResident.national_number_id}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Nama:</span>{" "}
                  <span className="font-medium">{selectedResident.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Jenis Kelamin:</span>{" "}
                  <span className="font-medium capitalize">
                    {selectedResident.gender === "male"
                      ? "Laki-laki"
                      : "Perempuan"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">TTL:</span>{" "}
                  <span className="font-medium">
                    {selectedResident.place_of_birth},{" "}
                    {new Date(
                      selectedResident.date_of_birth
                    ).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Agama:</span>{" "}
                  <span className="font-medium">
                    {selectedResident.religion}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">RT/RW:</span>{" "}
                  <span className="font-medium">
                    {selectedResident.rt}/{selectedResident.rw}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedResident && (
        <>
          <Separator />

          {/* Section 2: Data Verifikasi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>2. Data Verifikasi</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingData(!isEditingData)}
                    className="text-primary text-sm hover:underline">
                    {isEditingData ? "Kembali ke Data Asli" : "Edit Data"}
                  </button>
                </div>
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {isEditingData
                  ? "Edit data di bawah ini. Data ini akan disimpan sebagai snapshot verifikasi di field verified_data."
                  : "Data akan disimpan sebagai verifikasi. Klik 'Edit Data' jika perlu perubahan."}
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6">
                  {/* Status Verifikasi */}
                  <div className="space-y-3">
                    <Label className="font-semibold text-base">
                      Status Verifikasi
                    </Label>
                    <div className="gap-3 grid grid-cols-3">
                      {[
                        {
                          value: "pending",
                          label: "Pending",
                          color: "border-yellow-200 bg-yellow-50",
                        },
                        {
                          value: "verified",
                          label: "Terverifikasi",
                          color: "border-green-200 bg-green-50",
                        },
                        {
                          value: "rejected",
                          label: "Ditolak",
                          color: "border-red-200 bg-red-50",
                        },
                      ].map((statusOption) => (
                        <div
                          key={statusOption.value}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            statusOption.color
                          } ${
                            form.watch("status") === statusOption.value
                              ? "ring-2 ring-offset-2 ring-primary"
                              : ""
                          }`}
                          onClick={() =>
                            form.setValue("status", statusOption.value as any)
                          }>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">
                                {statusOption.label}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                {statusOption.value === "pending" &&
                                  "Menunggu verifikasi"}
                                {statusOption.value === "verified" &&
                                  "Data sudah valid"}
                                {statusOption.value === "rejected" &&
                                  "Data tidak valid"}
                              </p>
                            </div>
                            {form.watch("status") === statusOption.value && (
                              <div className="bg-primary rounded-full w-3 h-3" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-3">
                    <InputTextarea
                      control={form.control}
                      label="Catatan"
                      name="notes"
                      isDisabled={isPending}
                      placeholder="Tambahkan catatan verifikasi"
                    />
                    {form.formState.errors.notes && (
                      <p className="text-destructive text-sm">
                        {form.formState.errors.notes.message}
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* Form Data Penduduk untuk verified_data */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">
                      Data Penduduk untuk verified_data
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Data berikut akan disimpan sebagai JSON string di field
                      verified_data
                    </p>

                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                      <InputText
                        control={form.control}
                        name="national_number_id"
                        label="NIK"
                        placeholder="Nomor Induk Kependudukan"
                        isDisabled={isPending || !isEditingData}
                      />
                      <InputText
                        control={form.control}
                        name="name"
                        label="Nama Lengkap"
                        placeholder="Nama lengkap sesuai KTP"
                        isDisabled={isPending || !isEditingData}
                      />

                      <InputSelect
                        control={form.control}
                        name="gender"
                        label="Jenis Kelamin"
                        placeholder="Pilih jenis kelamin"
                        isDisabled={isPending || !isEditingData}
                        options={jenisKelaminOptions}
                      />

                      <div className="md:gap-4 space-y-4 md:space-y-0 grid grid-cols-1 md:grid-cols-2">
                        <InputText
                          control={form.control}
                          name="place_of_birth"
                          label="Tempat Lahir"
                          placeholder="Tempat lahir"
                          isDisabled={isPending || !isEditingData}
                        />
                        <InputDate
                          control={form.control}
                          name="date_of_birth"
                          label="Tanggal Lahir"
                          placeholder="Pilih tanggal lahir"
                          isDisabled={isPending || !isEditingData}
                        />
                      </div>

                      <InputSelect
                        control={form.control}
                        name="religion"
                        label="Agama"
                        placeholder="Pilih agama"
                        isDisabled={isPending || !isEditingData}
                        options={agamaOptions}
                      />

                      <InputSelect
                        control={form.control}
                        name="education"
                        label="Pendidikan Terakhir"
                        placeholder="Pilih pendidikan"
                        isDisabled={isPending || !isEditingData}
                        options={pendidikanOptions}
                      />

                      <InputSelect
                        control={form.control}
                        name="occupation"
                        label="Pekerjaan"
                        placeholder="Pilih pekerjaan"
                        isDisabled={isPending || !isEditingData}
                        options={jenisPekerjaanOptions}
                      />

                      <InputSelect
                        control={form.control}
                        name="marital_status"
                        label="Status Perkawinan"
                        placeholder="Pilih status perkawinan"
                        isDisabled={isPending || !isEditingData}
                        options={statusPerkawinanOptions}
                      />

                      <InputSelect
                        control={form.control}
                        name="citizenship"
                        label="Kewarganegaraan"
                        placeholder="Pilih kewarganegaraan"
                        isDisabled={isPending || !isEditingData}
                        options={kewarganegaraanOptions}
                      />

                      <InputSelect
                        control={form.control}
                        name="blood_type"
                        label="Golongan Darah"
                        placeholder="Pilih golongan darah"
                        isDisabled={isPending || !isEditingData}
                        options={golonganDarahOptions}
                      />

                      <InputSelect
                        control={form.control}
                        name="disabilities"
                        label="Status Disabilitas"
                        placeholder="Pilih status disabilitas"
                        isDisabled={isPending || !isEditingData}
                        options={penyandangCacatOptions}
                      />

                      <InputText
                        control={form.control}
                        name="father_name"
                        label="Nama Ayah"
                        placeholder="Nama lengkap ayah kandung"
                        isDisabled={isPending || !isEditingData}
                      />

                      <InputText
                        control={form.control}
                        name="mother_name"
                        label="Nama Ibu"
                        placeholder="Nama lengkap ibu kandung"
                        isDisabled={isPending || !isEditingData}
                      />

                      <InputText
                        control={form.control}
                        name="rt"
                        label="RT"
                        placeholder="Nomor RT"
                        isDisabled={isPending || !isEditingData}
                      />

                      <InputText
                        control={form.control}
                        name="rw"
                        label="RW"
                        placeholder="Nomor RW"
                        isDisabled={isPending || !isEditingData}
                      />

                      <InputSelect
                        control={form.control}
                        name="region_id"
                        label="Lingkungan"
                        placeholder="Pilih lingkungan"
                        isDisabled={isPending || !isEditingData}
                        options={regionOptions}
                      />
                    </div>
                  </div>

                  {/* Error Summary */}
                  {Object.keys(form.formState.errors).length > 0 && (
                    <div className="bg-destructive/10 p-4 border border-destructive/50 rounded-lg">
                      <p className="font-semibold text-destructive">
                        Terdapat kesalahan dalam form:
                      </p>
                      <ul className="mt-2 text-destructive text-sm">
                        {Object.entries(form.formState.errors).map(
                          ([key, error]) => (
                            <li key={key}>• {error.message}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end pt-6">
                    <ButtonSave isLoading={isPending} disabled={isPending} />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
