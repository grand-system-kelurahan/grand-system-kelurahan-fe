import { Map } from "lucide-react";
import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import { Form } from "@/components/ui/form";
import {
  Agama,
  GolonganDarah,
  JenisKelamin,
  JenisPekerjaan,
  Kewarganegaraan,
  Pendidikan,
  PenyandangCacat,
  StatusPerkawinan,
} from "@/consts/data-definitions";
import { useRegions } from "@/hooks/use-regions";
import { mapToOptions } from "@/lib/utils";
import { TRegion } from "@/schemas/region-schema";
import { TResident } from "@/schemas/resident-schema";
import { TSelectOption } from "@/types/types";

import ButtonSave from "../atoms/button-save";
import { EmptyOutline } from "../molecules/empty-outline";
import FormSkeleton from "../molecules/form-skeleton";
import { InputDate } from "../molecules/input-date";
import { InputSelect } from "../molecules/input-select";
import { InputText } from "../molecules/input-text";

interface Props {
  form: UseFormReturn<TResident>;
  onSubmit: (values: TResident) => void;
  isLoading: boolean;
}

export default function ResidentForm({ form, isLoading, onSubmit }: Props) {
  const { data, isLoading: isLoadingLingkungan } = useRegions();
  const regionsData: TRegion[] = useMemo(() => data?.data || [], [data]);
  const regionOptions = mapToOptions(regionsData || [], "id", "name");
  const jenisKelaminOptions: TSelectOption[] = JenisKelamin.map((item) => ({
    value: item,
    label: item,
  }));
  const agamaOptions: TSelectOption[] = Agama.map((item) => ({
    value: item,
    label: item,
  }));
  const pendidikanOptions: TSelectOption[] = Pendidikan.map((item) => ({
    value: item,
    label: item,
  }));
  const jenisPekerjaanOptions: TSelectOption[] = JenisPekerjaan.map((item) => ({
    value: item,
    label: item,
  }));
  const statusPerkawinanOptions: TSelectOption[] = StatusPerkawinan.map(
    (item) => ({
      value: item,
      label: item,
    })
  );
  const kewarganegaraanOptions: TSelectOption[] = Kewarganegaraan.map(
    (item) => ({
      value: item,
      label: item,
    })
  );
  const golonganDarahOptions: TSelectOption[] = GolonganDarah.map((item) => ({
    value: item,
    label: item,
  }));
  const penyandangCacatOptions: TSelectOption[] = PenyandangCacat.map(
    (item) => ({
      value: item,
      label: item,
    })
  );

  return (
    <>
      {isLoadingLingkungan ? (
        <FormSkeleton columnCount={2} rowCount={7} />
      ) : regionsData.length == 0 ? (
        <EmptyOutline
          title="Data Lingkungan Tidak Ditemukan"
          description="Data lingkungan tidak ditemukan, silahkan tambahkan data lingkungan terlebih dahulu"
          icon={Map}
        />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              <InputText
                control={form.control}
                name="national_number_id"
                label="NIK"
                placeholder="NIK"
                isDisabled={isLoading}
              />
              <InputText
                control={form.control}
                name="name"
                label="Nama Lengkap"
                placeholder="Nama lengkap"
                isDisabled={isLoading}
              />
              <InputSelect
                control={form.control}
                name="gender"
                label="Jenis Kelamin"
                placeholder="Jenis kelamin"
                isDisabled={isLoading}
                options={jenisKelaminOptions}
              />
              <div className="md:gap-4 space-y-4 md:space-y-0 grid grid-cols-1 md:grid-cols-2">
                <InputText
                  control={form.control}
                  name="place_of_birth"
                  label="Tempat Lahir"
                  placeholder="Tempat lahir"
                  isDisabled={isLoading}
                />
                <InputDate
                  control={form.control}
                  name="date_of_birth"
                  label="Tanggal Lahir"
                  placeholder="Tanggal lahir"
                  isDisabled={isLoading}
                />
              </div>
              <InputSelect
                control={form.control}
                name="religion"
                label="Agama"
                placeholder="Agama"
                isDisabled={isLoading}
                options={agamaOptions}
              />
              <InputSelect
                control={form.control}
                name="education"
                label="Pendidikan"
                placeholder="Pendidikan"
                isDisabled={isLoading}
                options={pendidikanOptions}
              />
              <InputSelect
                control={form.control}
                name="occupation"
                label="Jenis Pekerjaan"
                placeholder="Jenis pekerjaan"
                isDisabled={isLoading}
                options={jenisPekerjaanOptions}
              />
              <InputSelect
                control={form.control}
                name="marital_status"
                label="Status Perkawinan"
                placeholder="Status perkawinan"
                isDisabled={isLoading}
                options={statusPerkawinanOptions}
              />
              <InputSelect
                control={form.control}
                name="citizenship"
                label="Kewarganegaraan"
                placeholder="Kewarganegaraan"
                isDisabled={isLoading}
                options={kewarganegaraanOptions}
              />
              <InputSelect
                control={form.control}
                name="blood_type"
                label="Golongan Darah"
                placeholder="Golongan darah"
                isDisabled={isLoading}
                options={golonganDarahOptions}
              />
              <InputSelect
                control={form.control}
                name="disabilities"
                label="Golongan Darah"
                placeholder="Golongan darah"
                isDisabled={isLoading}
                options={penyandangCacatOptions}
              />
              <InputText
                control={form.control}
                name="father_name"
                label="Nama Ayah"
                placeholder="Nama ayah"
                isDisabled={isLoading}
              />
              <InputText
                control={form.control}
                name="mother_name"
                label="Nama Ibu"
                placeholder="Nama ibu"
                isDisabled={isLoading}
              />
              <InputText
                control={form.control}
                name="rt"
                label="RT"
                placeholder="RT"
                isDisabled={isLoading}
              />
              <InputText
                control={form.control}
                name="rw"
                label="RW"
                placeholder="RW"
                isDisabled={isLoading}
              />
              <InputSelect
                control={form.control}
                name="region_id"
                label="Lingkungan"
                placeholder="Lingkungan"
                isDisabled={isLoading}
                options={regionOptions}
              />
            </div>

            <ButtonSave isLoading={isLoading} />
          </form>
        </Form>
      )}
    </>
  );
}
