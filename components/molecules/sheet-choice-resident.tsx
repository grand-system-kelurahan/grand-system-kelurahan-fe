import { Check, CheckCheck, Search, SearchIcon, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSearchResidents } from "@/hooks/use-residents";
import { TResident, TResidentWithRelation } from "@/schemas/resident-schema";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Skeleton } from "../ui/skeleton";
import { EmptyOutline } from "./empty-outline";

interface Props {
  resident: TResident | null;
  onResidentChoice: (resident: TResident | null) => void;
}

export default function SheetChoiceResident({
  resident: residentInit,
  onResidentChoice,
}: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [search, setSearch] = useState("");
  const { data, isLoading } = useSearchResidents(search);

  const residentsData: TResidentWithRelation[] = useMemo(
    () => data?.data?.residents,
    [data]
  );

  function handleSearch() {
    setSearch(searchValue);
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          {residentInit ? residentInit.name : "Pilih penduduk"}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Pilih penduduk</SheetTitle>
          <SheetDescription>Pilih penduduk</SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <div className="flex gap-2">
            <InputGroup>
              <InputGroupInput
                placeholder={"Cari penduduk"}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full"
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
            <Button onClick={() => handleSearch()}>
              <Search />
            </Button>
          </div>
          <div className="py-4 max-h-[65vh] overflow-y-auto">
            {isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  className="flex justify-between mb-4 px-4 py-2 border rounded-sm"
                  key={index}>
                  <div className="space-y-2">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-16 h-2" />
                  </div>
                  <Skeleton className="w-8 h-8" />
                </div>
              ))}
            {residentsData && residentsData.length == 0 ? (
              <EmptyOutline
                title="Data Tidak Ditemukan"
                description="Data pencarian penduduk tidak ditemukan"
                icon={Users}
              />
            ) : (
              residentsData?.map((resident) => (
                <div
                  key={resident.id}
                  className="flex justify-between items-center gap-2 shadow-sm px-4 py-2 border rounded-sm"
                  onClick={() => {
                    onResidentChoice(resident);
                  }}>
                  <div>
                    <p className="font-semibold text-sm">{resident.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {resident?.region?.name}
                    </p>
                  </div>
                  {resident.id === residentInit?.id ? (
                    <Button size={"sm"}>
                      <CheckCheck />
                    </Button>
                  ) : (
                    <Button size={"sm"} variant={"outline"}>
                      <Check />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Tutup</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
