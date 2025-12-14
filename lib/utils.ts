import { ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import { TFamilyCardWithRelation } from "@/schemas/family-card-schema";
import { TResident, TResidentWithRelation } from "@/schemas/resident-schema";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TSelectOption } from "@/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAge(birthDate: Date | string | null | undefined): {
  years: number;
  months: number;
  days: number;
} {
  // 1. Handle null/undefined secara eksplisit
  if (!birthDate) {
    return { years: 0, months: 0, days: 0 };
  }

  // 2. Konversi ke Date object jika berupa string
  const birthDateObj =
    typeof birthDate === "string" ? new Date(birthDate) : birthDate;

  // 3. Validasi tanggal yang valid
  if (!(birthDateObj instanceof Date) || isNaN(birthDateObj.getTime())) {
    throw new Error("Tanggal lahir tidak valid");
  }

  // 4. Validasi tanggal tidak di masa depan
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalisasi untuk perbandingan tanggal saja

  const normalizedBirthDate = new Date(birthDateObj);
  normalizedBirthDate.setHours(0, 0, 0, 0);

  if (normalizedBirthDate > today) {
    throw new Error("Tanggal lahir tidak boleh di masa depan");
  }

  // 5. Hitung umur dengan logika yang lebih robust
  let years = today.getFullYear() - birthDateObj.getFullYear();
  let months = today.getMonth() - birthDateObj.getMonth();
  let days = today.getDate() - birthDateObj.getDate();

  // Koreksi untuk hari negatif
  if (days < 0) {
    // Dapatkan hari dalam bulan sebelumnya
    const lastDayOfPrevMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    ).getDate();

    months -= 1;
    days += lastDayOfPrevMonth;
  }

  // Koreksi untuk bulan negatif
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // 6. Validasi tambahan: tahun tidak boleh negatif
  if (years < 0) {
    return { years: 0, months: 0, days: 0 };
  }

  return { years, months, days };
}

// Versi alternatif yang lebih sederhana (jika tidak perlu detail bulan/hari)
export function calculateSimpleAge(
  birthDate: Date | string | null | undefined
): number {
  if (!birthDate) return 0;

  const birthDateObj =
    typeof birthDate === "string" ? new Date(birthDate) : birthDate;

  if (!(birthDateObj instanceof Date) || isNaN(birthDateObj.getTime())) {
    return 0;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
  ) {
    age--;
  }

  return age < 0 ? 0 : age;
}

export function formatDate(
  isoString?: string,
  withTime: boolean = false
): string {
  if (!isoString) {
    return "-";
  }

  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    return "-";
  }

  if (withTime) {
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  } else {
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

export function mapToOptions<T extends Record<string, unknown>>(
  data?: T[] | null,
  valueKey: keyof T = "id" as keyof T,
  labelKey: keyof T | any = "name" as keyof T,
  options?: {
    labelTemplate?: string;
    formatters?: { [key: string]: (value: any) => string };
  }
): TSelectOption[] {
  if (!data || !Array.isArray(data)) return [];

  return data.reduce<TSelectOption[]>((acc, item) => {
    const rawValue = item[valueKey];

    if (rawValue === undefined || rawValue === null) return acc;

    let value: string | number;
    if (typeof rawValue === "number") value = rawValue;
    else if (typeof rawValue === "string" && /^\d+$/.test(rawValue))
      value = Number(rawValue);
    else value = String(rawValue);

    let label: string;

    if (options?.labelTemplate) {
      label = processLabelTemplate(
        item,
        options.labelTemplate,
        options.formatters
      );
    } else if (typeof labelKey === "string") {
      const rawLabel = item[labelKey];
      if (rawLabel === undefined || rawLabel === null) return acc;
      label = String(rawLabel);
    } else {
      const rawLabel = item[labelKey as keyof T];
      if (rawLabel === undefined || rawLabel === null) return acc;
      label = String(rawLabel);
    }

    acc.push({ value, label });
    return acc;
  }, []);
}

function processLabelTemplate<T>(
  item: T,
  template: string,
  formatters?: { [key: string]: (value: unknown) => string }
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = (item as any)[key];

    if (value === undefined || value === null) {
      return "";
    }

    if (formatters?.[key]) {
      return formatters[key](value);
    }

    if (typeof value === "number") {
      return value.toString();
    }

    return String(value);
  });
}

export async function handleCopyPendudukData(
  pendudukData: TResidentWithRelation
) {
  const dataToCopy = `NAMA LENGKAP: ${pendudukData?.name.toUpperCase() || "-"}
LINGKUNGAN: ${pendudukData?.region?.name.toUpperCase() || "-"}
JENIS KELAMIN: ${pendudukData?.gender.toUpperCase() || "-"}
TEMPAT LAHIR: ${pendudukData?.place_of_birth.toUpperCase() || "-"}
TANGGAL LAHIR: ${formatDate(pendudukData?.date_of_birth.toString()) || "-"}
USIA: ${calculateAge(pendudukData?.date_of_birth).years} TAHUN
AGAMA: ${pendudukData?.religion.toUpperCase() || "-"}
PENDIDIKAN: ${pendudukData?.education.toUpperCase() || "-"}
JENIS PEKERJAAN: ${pendudukData?.occupation.toUpperCase() || "-"}
STATUS PERKAWINAN: ${pendudukData?.marital_status.toUpperCase() || "-"}
KEWARGANEGARAAN: ${pendudukData?.citizenship.toUpperCase() || "-"}
GOLONGAN DARAH: ${pendudukData?.blood_type.toUpperCase() || "-"}
PENYANDANG CACAT: ${pendudukData?.disabilities.toUpperCase() || "-"}
NAMA AYAH: ${pendudukData?.father_name.toUpperCase() || "-"}
NAMA IBU: ${pendudukData?.mother_name.toUpperCase() || "-"}`;

  await handleCopy(dataToCopy);
}

export async function handleCopyKKData(
  kartuKeluargaData: TFamilyCardWithRelation
) {
  const kkData = `NAMA KEPALA KELUARGA: ${
    kartuKeluargaData?.head_of_family_name?.toUpperCase() || "-"
  }
ALAMAT: ${kartuKeluargaData?.address?.toUpperCase() || "-"}
LINGKUNGAN: ${kartuKeluargaData?.region?.name?.toUpperCase() || "-"}
TERAKHIR DIPERBARUI: ${
    formatDate(kartuKeluargaData?.updated_at?.toString())?.toUpperCase() || "-"
  }
=============\n\n`;

  //   let anggotaData = "";

  //   kartuKeluargaData?.anggota
  //     ?.slice()
  //     .sort((a: IAnggotaKeluarga, b: IAnggotaKeluarga) => {
  //       const indexA = StatusHubunganDalamKeluarga.indexOf(
  //         a.statusHubunganDalamKeluarga
  //       );
  //       const indexB = StatusHubunganDalamKeluarga.indexOf(
  //         b.statusHubunganDalamKeluarga
  //       );

  //       if (indexA !== indexB) {
  //         return indexA - indexB;
  //       }

  //       const dateA = new Date(a.detail?.tanggalLahir || "");
  //       const dateB = new Date(b.detail?.tanggalLahir || "");
  //       return dateA.getTime() - dateB.getTime();
  //     })
  //     .forEach((anggota: IAnggotaKeluarga) => {
  //       anggotaData += `STATUS HUBUNGAN DALAM KELUARGA: ${
  //         anggota.statusHubunganDalamKeluarga?.toUpperCase() || "-"
  //       }
  // NAMA LENGKAP: ${anggota?.detail?.nama?.toUpperCase() || "-"}
  // LINGKUNGAN: ${anggota?.detail?.lingkungan?.toUpperCase() || "-"}
  // TEMPAT LAHIR: ${anggota?.detail?.tempatLahir?.toUpperCase() || "-"}
  // TANGGAL LAHIR: ${anggota?.detail?.tanggalLahir?.toUpperCase() || "-"}
  // USIA: ${calculateAge(anggota?.detail?.tanggalLahir as string).years} TAHUN
  // AGAMA: ${anggota?.detail?.agama?.toUpperCase() || "-"}
  // PENDIDIKAN: ${anggota?.detail?.pendidikan?.toUpperCase() || "-"}
  // JENIS PEKERJAAN: ${anggota?.detail?.jenisPekerjaan?.toUpperCase() || "-"}
  // STATUS PERKAWINAN: ${anggota?.detail?.statusPerkawinan?.toUpperCase() || "-"}
  // KEWARGANEGARAAN: ${anggota?.detail?.kewarganegaraan?.toUpperCase() || "-"}
  // GOLONGAN DARAH: ${anggota?.detail?.golonganDarah?.toUpperCase() || "-"}
  // PENYANDANG CACAT: ${anggota?.detail?.penyandangCacat?.toUpperCase() || "-"}
  // NAMA AYAH: ${anggota?.detail?.namaAyah?.toUpperCase() || "-"}
  // NAMA IBU: ${anggota?.detail?.namaIbu?.toUpperCase() || "-"}\n
  // -------------\n`;
  //     });

  //   const finalKKData = kkData + anggotaData;

  //   await handleCopy(finalKKData);
  // }

  // export async function handleCopyPendudukData(pendudukData: TResident) {
  //   const dataToCopy = `NAMA LENGKAP: ${pendudukData?.name.toUpperCase() || "-"}
  // JENIS KELAMIN: ${pendudukData?.gender.toUpperCase() || "-"}
  // TEMPAT LAHIR: ${pendudukData?.place_of_birth.toUpperCase() || "-"}
  // TANGGAL LAHIR: ${
  //     formatDate(pendudukData?.date_of_birth.toString()).toUpperCase() || "-"
  //   }
  // USIA: ${calculateAge(pendudukData?.date_of_birth).years} TAHUN
  // AGAMA: ${pendudukData?.religion.toUpperCase() || "-"}
  // PENDIDIKAN: ${pendudukData?.education.toUpperCase() || "-"}
  // JENIS PEKERJAAN: ${pendudukData?.occupation.toUpperCase() || "-"}
  // STATUS PERKAWINAN: ${pendudukData?.marital_status.toUpperCase() || "-"}
  // KEWARGANEGARAAN: ${pendudukData?.citizenship.toUpperCase() || "-"}
  // GOLONGAN DARAH: ${pendudukData?.blood_type.toUpperCase() || "-"}
  // PENYANDANG CACAT: ${pendudukData?.disabilities.toUpperCase() || "-"}
  // NAMA AYAH: ${pendudukData?.father_name.toUpperCase() || "-"}
  // NAMA IBU: ${pendudukData?.mother_name.toUpperCase() || "-"}`;

  // await handleCopy(dataToCopy);
}

export function getInitials(name: string): string {
  if (!name) return "";

  const words = name.trim().split(/\s+/);

  if (words.length >= 2) {
    return words[0][0].toUpperCase() + words[1][0].toUpperCase();
  }

  const firstWord = words[0];
  return firstWord.slice(0, 2).toUpperCase();
}

export async function handleCopy(text: string) {
  try {
    if (!text) {
      toast.error("Tidak ada teks untuk disalin");
      return;
    }
    await navigator.clipboard.writeText(text);
    toast.success("Teks berhasil disalin ke clipboard");
  } catch (error: any) {
    console.error("Gagal menyalin teks:", error);
    toast.error("Gagal menyalin teks");
  }
}

export function capitalizeWords(sentence: string): string {
  if (!sentence) return "";

  return sentence
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
