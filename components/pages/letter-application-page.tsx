"use client";

import { Description, Heading1 } from "../atoms/typography";
import AddLetterApplicationForm from "../organisms/add-letter-application-form";

export default function LetterApplicationPage() {
  return (
    <div className="">
      <Heading1 text="Pengajuan Surat" />
      <Description text="Silahkan isi form berikut untuk mengajukan surat" />
      <hr className="my-4" />
      <AddLetterApplicationForm />
    </div>
  );
}
