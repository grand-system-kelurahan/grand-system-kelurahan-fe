"use client";

import { useMemo } from "react";

import { useAssetById } from "@/hooks/use-assets";
import { TAssetWithRelation } from "@/schemas/asset-schema";

import ButtonBack from "../atoms/button-back";
import { Description, Heading1 } from "../atoms/typography";
import CodeEditorDialog from "../molecules/code-editor-dialog";
import FormSkeleton from "../molecules/form-skeleton";
import EditAssetForm from "../organisms/edit-asset-form";

interface Props {
  id: number;
}

export default function EditAssetPage({ id }: Props) {
  const { data, isLoading } = useAssetById(id);
  const assetData: TAssetWithRelation = useMemo(() => data?.data, [data]);

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <div>
          <Heading1 text="Edit Data Aset" />
          <Description text="Silahkan isi form berikut untuk memperbarui data aset" />
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
        <EditAssetForm asset={assetData} />
      )}
    </div>
  );
}
