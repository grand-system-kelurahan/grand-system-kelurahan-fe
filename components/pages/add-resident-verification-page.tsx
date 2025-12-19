"use client";

import ButtonBack from "../atoms/button-back";
import { Description, Heading1 } from "../atoms/typography";
import AddResidentVerificationForm from "../organisms/add-resident-verification-form";

export default function AddResidentVerificationPage() {
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Tambah Data Pengajuan Penduduk" />
          <Description text="Silahkan isi form berikut untuk menambahkan data pengajuan / perubahan penduduk" />
        </div>
        <ButtonBack />
      </div>
      <hr className="my-4" />
      <AddResidentVerificationForm />
    </div>
  );
}
