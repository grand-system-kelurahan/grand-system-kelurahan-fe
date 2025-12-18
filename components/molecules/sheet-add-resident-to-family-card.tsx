import { Check, Plus, PlusCircle, Save, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ButtonDefaultCSS } from "@/consts/button-css";
import { StatusHubunganDalamKeluarga } from "@/consts/data-definitions";
import { useCreateFamilyMember } from "@/hooks/use-family-members";
import { useResidentByName } from "@/hooks/use-residents";
import { capitalizeWords } from "@/lib/utils";
import { TResidentWithRelation } from "@/schemas/resident-schema";
import { TRelationship } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";

import LoadingIcon from "../atoms/loading-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  name: z.string().min(2).max(50),
});

interface Props {
  familyCardId: number;
}

export default function SheetAddResientToFamilyCard({ familyCardId }: Props) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pendudukId, setPendudukId] = useState<number | null>();
  const [statusHubungan, setStatusHubungan] = useState<TRelationship>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSearchQuery(values.name);
  }

  const { data, isLoading, error } = useResidentByName(searchQuery);

  const residentsData: TResidentWithRelation[] = useMemo(
    () => data?.data?.residents || [],
    [data]
  );

  function handlePendudukClick(id: number) {
    setPendudukId(id);
  }

  const { mutateAsync, isPending } = useCreateFamilyMember();

  async function onSave() {
    if (!pendudukId || !statusHubungan) {
      toast.error("Silahkan pilih penduduk dan status hubungan");
      return;
    }

    const selectedPenduduk = residentsData?.find(
      (penduduk) => penduduk.id === pendudukId
    );
    const isInKK = selectedPenduduk?.family_member != null;

    if (isInKK) {
      toast.error("Penduduk sudah terdaftar di KK");
      return;
    }

    await mutateAsync({
      familyCardId,
      payload: {
        relationship: statusHubungan,
        resident_id: pendudukId,
      },
    });
  }

  return (
    <Sheet>
      <SheetTrigger className={ButtonDefaultCSS}>
        <PlusCircle />
        Tambah Anggota Keluarga
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Tambah anggota keluarga</SheetTitle>
          <SheetDescription>
            Silahkan tambahkan anggota keluarga
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <Select
            onValueChange={(e) => setStatusHubungan(e as TRelationship)}
            defaultValue={statusHubungan}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status Hubungan dalam Keluarga" />
            </SelectTrigger>
            <SelectContent>
              {StatusHubunganDalamKeluarga.map((item) => (
                <SelectItem value={item} key={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex justify-between gap-2 w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormControl>
                      <Input placeholder="Cari nama penduduk" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="">
                <Search />
              </Button>
            </form>
          </Form>
        </div>
        <div className="px-4 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center gap-2">
              <LoadingIcon />
              <p className="text-sm">Proses...</p>
            </div>
          )}
          {error && <p>Error: {error.message}</p>}
          {!isLoading && residentsData?.length === 0 ? (
            <p className="text-sm">Tidak ada penduduk yang cocok</p>
          ) : (
            <div className="space-y-2 pb-8 overflow-y-auto">
              <hr />
              <p className="font-semibold text-sm">Hasil pencarian</p>
              {residentsData &&
                residentsData.map((item) => (
                  <div
                    className="flex justify-between items-center shadow-sm px-4 py-2 border rounded-md"
                    key={item.id}>
                    <p className="text-sm">
                      {capitalizeWords(item.name)} - (Link. {item.region.name})
                    </p>
                    {item.family_member != null ? (
                      <p className="text-green-600 text-sm">
                        Sudah terdaftar di KK
                      </p>
                    ) : (
                      <Button
                        size={"sm"}
                        onClick={() => handlePendudukClick(item.id as number)}
                        className={`${
                          pendudukId === item.id
                            ? "bg-green-600 hover:bg-green-600 text-primary-foreground"
                            : ""
                        }`}
                        disabled={item.family_member != null}>
                        {pendudukId === item.id ? <Check /> : <Plus />}
                      </Button>
                    )}
                  </div>
                ))}
              <Button
                className="mt-4 w-full"
                disabled={isPending}
                onClick={onSave}>
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <LoadingIcon /> <p>Loading</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save />
                    Simpan
                  </div>
                )}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
