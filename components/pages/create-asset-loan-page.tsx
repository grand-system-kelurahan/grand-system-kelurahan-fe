"use client";

import { Description, Heading1 } from "../atoms/typography";
import AddAssetLoanForm from "../organisms/add-asset-loan-form";

export default function CreateAssetLoanPage() {
  return (
    <div className="">
      <Heading1 text="Peminjaman Aset" />
      <Description text="Silahkan isi form berikut untuk mengajukan peminjaman aset" />
      <hr className="my-4" />
      <AddAssetLoanForm />
    </div>
  );
}
