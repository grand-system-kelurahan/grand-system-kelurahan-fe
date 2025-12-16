"use client";

import { useMemo, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

import { useResidents, useSearchResidents } from "@/hooks/use-residents";
import type { TEmployeeFormValues } from "./employee-upsert-form";

type Props = {
  form: UseFormReturn<TEmployeeFormValues>;
  disabled?: boolean;
};

export function ResidentSearchSelect({ form, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const allQuery = useResidents();
  const searchQuery = useSearchResidents(q);

  const allResidents = useMemo(() => {
    const list = (allQuery.data as any)?.data?.residents ?? (allQuery.data as any)?.residents ?? [];
    return Array.isArray(list) ? list : [];
  }, [allQuery.data]);

  const searchedResidents = useMemo(() => {
    const list = (searchQuery.data as any)?.data?.residents ?? (searchQuery.data as any)?.residents ?? [];
    return Array.isArray(list) ? list : [];
  }, [searchQuery.data]);

  const residents = q.trim().length ? searchedResidents : allResidents;

  const selectedId = form.watch("resident_id");
  const selectedLabel = useMemo(() => {
    const found = residents.find((r: any) => Number(r.id) === Number(selectedId));
    if (found) return found.name;
    const foundAll = allResidents.find((r: any) => Number(r.id) === Number(selectedId));
    return foundAll?.name ?? (selectedId ? `Penduduk #${selectedId}` : "");
  }, [residents, allResidents, selectedId]);

  const loading = q.trim().length ? searchQuery.isLoading : allQuery.isLoading;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between" disabled={!!disabled}>
          {selectedLabel || "Pilih penduduk..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Cari nama penduduk..." value={q} onValueChange={setQ} />
          <CommandList>
            {loading ? (
              <div className="p-3 text-sm text-muted-foreground">Memuat...</div>
            ) : (
              <>
                <CommandEmpty>Tidak ada hasil.</CommandEmpty>
                <CommandGroup>
                  {residents.map((r: any) => {
                    const selected = Number(selectedId) === Number(r.id);
                    return (
                      <CommandItem
                        key={r.id}
                        value={String(r.id)}
                        onSelect={() => {
                          form.setValue("resident_id", Number(r.id), { shouldValidate: true });
                          setOpen(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", selected ? "opacity-100" : "opacity-0")} />
                        <div className="flex flex-col">
                          <span className="text-sm">{r.name}</span>
                          {r.national_number_id && <span className="text-xs text-muted-foreground">{r.national_number_id}</span>}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
