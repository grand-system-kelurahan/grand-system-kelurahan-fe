"use client";

import { useMemo } from "react";

import { useFamilyCardById } from "@/hooks/use-family-cards";
import { TFamilyCardWithRelation } from "@/schemas/family-card-schema";

import ButtonBack from "../atoms/button-back";
import { Description, Heading1 } from "../atoms/typography";
import CodeEditorDialog from "../molecules/code-editor-dialog";
import FormSkeleton from "../molecules/form-skeleton";
import EditFamilyCardForm from "../organisms/edit-family-card-form";

interface Props {
  id: number;
}

export default function EditFamilyCardPage({ id }: Props) {
  const { data, isLoading } = useFamilyCardById(id);
  const familyCardData: TFamilyCardWithRelation = useMemo(
    () => data?.data?.family_card,
    [data]
  );

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Edit Data Kartu Keluarga" />
          <Description text="Silahkan isi form berikut untuk memperbarui data kartu keluarga" />
        </div>
        <ButtonBack />
      </div>
      <hr className="my-4" />
      {data && (
        <div className="mb-4">
          <CodeEditorDialog content={data} />
        </div>
      )}
      {isLoading ? (
        <FormSkeleton columnCount={2} rowCount={8} />
      ) : (
        <EditFamilyCardForm familyCard={familyCardData} />
      )}
    </div>
  );
}
