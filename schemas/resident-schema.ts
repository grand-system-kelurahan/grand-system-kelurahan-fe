import z from "zod";

import { BaseSchema } from "./base-schema";
import { TFamilyMember } from "./family-member-schema";
import { TRegion } from "./region-schema";

export const FormResidentSchema = z
  .object({
    national_number_id: z
      .string()
      .min(2, { message: "NIK harus diisi minimal 2 karakter" }),
    name: z.string().min(2, { message: "Nama harus diisi minimal 2 karakter" }),
    gender: z.enum(["Laki-laki", "Perempuan", "Tidak Tau"], {
      message: "Jenis kelamin harus dipilih (Laki-laki atau Perempuan)",
    }),
    place_of_birth: z
      .string()
      .min(2, { message: "Tempat lahir harus diisi minimal 2 karakter" }),
    date_of_birth: z.date(),
    religion: z.enum(
      [
        "Islam",
        "Kristen",
        "Katolik",
        "Hindu",
        "Budha",
        "Konghucu",
        "Kepercayaan Terhadap Tuhan YME / Lainnya",
        "Tidak Tau",
      ],
      {
        message: "Agama harus dipilih dari opsi yang tersedia",
      }
    ),
    rt: z.string(),
    rw: z.string(),
    education: z
      .string()
      .min(2, { message: "Pendidikan harus diisi minimal 2 karakter" }),
    occupation: z
      .string()
      .min(2, { message: "Jenis pekerjaan harus diisi minimal 2 karakter" }),
    marital_status: z.enum(
      ["Kawin", "Belum Kawin", "Cerai Hidup", "Cerai Mati", "Tidak Tau"],
      {
        message: "Status perkawinan harus dipilih dari opsi yang tersedia",
      }
    ),
    citizenship: z.enum(["WNI", "WNA"], {
      message: "Kewarganegaraan harus dipilih (WNI atau WNA)",
    }),
    blood_type: z.enum(
      [
        "A",
        "B",
        "AB",
        "O",
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
        "Tidak Tau",
      ],
      {
        message: "Golongan darah harus dipilih dari opsi yang tersedia",
      }
    ),
    disabilities: z.enum(
      [
        "Tidak Cacat",
        "Cacat Fisik",
        "Cacat Netra / Buta",
        "Cacat Rungu / Wicara",
        "Cacat Mental / Jiwa",
        "Cacat Fisik dan Mental",
        "Cacat Lainnya",
        "Tidak Tau",
      ],
      {
        message:
          "Status penyandang cacat harus dipilih dari opsi yang tersedia",
      }
    ),
    father_name: z
      .string()
      .min(2, { message: "Nama ayah harus diisi minimal 2 karakter" }),
    mother_name: z
      .string()
      .min(2, { message: "Nama ibu harus diisi minimal 2 karakter" }),
    region_id: z.number().optional(),
  })
  .merge(BaseSchema);

export type TResident = z.infer<typeof FormResidentSchema>;

export type TResidentWithRelation = TResident & {
  region: TRegion;
  family_member: TFamilyMember;
};
