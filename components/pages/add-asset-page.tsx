"use client";

import ButtonBack from "../atoms/button-back";
import { Description, Heading1 } from "../atoms/typography";
import AddAssetForm from "../organisms/add-asset-form";

export default function AddAssetPage() {
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Tambah Data Aset" />
          <Description text="Silahkan isi form berikut untuk menambahkan data aset baru" />
        </div>
        <ButtonBack />
      </div>
      <hr className="my-4" />
      <AddAssetForm />
    </div>
  );
}
