"use client";

import ButtonBack from "../atoms/button-back";
import { Description, Heading1 } from "../atoms/typography";
import AddResidentForm from "../organisms/add-resident-form";

export default function AddResidentPage() {
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Tambah Data Penduduk" />
          <Description text="Silahkan isi form berikut untuk menambahkan data penduduk baru" />
        </div>
        <ButtonBack />
      </div>
      <hr className="my-4" />
      <AddResidentForm />
    </div>
  );
}
