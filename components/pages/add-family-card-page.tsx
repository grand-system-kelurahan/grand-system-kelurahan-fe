"use client";

import ButtonBack from "../atoms/button-back";
import { Description, Heading1 } from "../atoms/typography";
import AddFamilyCardForm from "../organisms/add-family-card-form";

export default function AddFamilyCardPage() {
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Tambah Data Kartu Keluarga" />
          <Description text="Silahkan isi form berikut untuk menambahkan data kartu keluarga baru" />
        </div>
        <ButtonBack />
      </div>
      <hr className="my-4" />
      <AddFamilyCardForm />
    </div>
  );
}
