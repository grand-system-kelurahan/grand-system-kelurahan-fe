"use client";

import { useMemo, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import { useEmployees } from "@/hooks/use-employees";
import type { TAttendanceForm } from "@/schemas/attendance-schema";

type Props = {
  form: UseFormReturn<TAttendanceForm>;
  onSubmit: (values: TAttendanceForm) => void | Promise<void>;
  isLoading?: boolean;
  isCreate?: boolean;
};

export default function AttendanceForm({ form, onSubmit, isLoading, isCreate }: Props) {
  const { data: employeesResp, isLoading: employeesLoading } = useEmployees();
  const [empOpen, setEmpOpen] = useState(false);
  const [empQ, setEmpQ] = useState("");

  const employees = useMemo(() => {
    if (Array.isArray(employeesResp)) return employeesResp as any[];
    const list = (employeesResp as any)?.data?.employees ?? (employeesResp as any)?.employees ?? (employeesResp as any)?.data ?? [];
    return Array.isArray(list) ? list : [];
  }, [employeesResp]);

  const filteredEmployees = useMemo(() => {
    const q = empQ.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((e: any) => String(e.name ?? "").toLowerCase().includes(q) || String(e.employee_number ?? "").toLowerCase().includes(q));
  }, [employees, empQ]);

  const selectedEmployeeId = form.watch("employee_id");
  const selectedEmployeeLabel = useMemo(() => {
    const found = employees.find((e: any) => Number(e.id) === Number(selectedEmployeeId));
    return found?.name ? `${found.name} (${found.employee_number ?? `#${found.id}`})` : selectedEmployeeId ? `#${selectedEmployeeId}` : "";
  }, [employees, selectedEmployeeId]);

  const statusValue = (form.watch("status") ?? "") as string;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Pegawai</Label>
          <Popover open={empOpen} onOpenChange={setEmpOpen}>
            <PopoverTrigger asChild>
              <Button type="button" variant="outline" className="w-full justify-between" disabled={employeesLoading || !!isLoading}>
                {selectedEmployeeLabel || "Pilih pegawai..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command shouldFilter={false}>
                <CommandInput placeholder="Cari pegawai..." value={empQ} onValueChange={setEmpQ} />
                <CommandList>
                  <CommandEmpty>Tidak ada hasil.</CommandEmpty>
                  <CommandGroup>
                    {filteredEmployees.map((e: any) => {
                      const selected = Number(selectedEmployeeId) === Number(e.id);
                      return (
                        <CommandItem
                          key={e.id}
                          value={String(e.id)}
                          onSelect={() => {
                            form.setValue("employee_id", Number(e.id), { shouldValidate: true });
                            setEmpOpen(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", selected ? "opacity-100" : "opacity-0")} />
                          <div className="flex flex-col">
                            <span className="text-sm">{e.name ?? `#${e.id}`}</span>
                            <span className="text-xs text-muted-foreground">{e.employee_number ?? ""}</span>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {form.formState.errors.employee_id?.message && (
            <p className="text-sm text-destructive">{String(form.formState.errors.employee_id.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Tanggal</Label>
          <Input
            type="date"
            value={form.watch("date") ?? ""}
            onChange={(e) => form.setValue("date", e.target.value, { shouldValidate: true })}
          />
          {form.formState.errors.date?.message && (
            <p className="text-sm text-destructive">{String(form.formState.errors.date.message)}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Jam Masuk</Label>
          <Input
            value={(form.watch("check_in_time") ?? "") as any}
            onChange={(e) => form.setValue("check_in_time", e.target.value, { shouldValidate: true })}
            placeholder="08:00"
          />
        </div>

        <div className="space-y-2">
          <Label>Jam Pulang</Label>
          <Input
            value={(form.watch("check_out_time") ?? "") as any}
            onChange={(e) => form.setValue("check_out_time", e.target.value, { shouldValidate: true })}
            placeholder="17:00"
          />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={statusValue} onValueChange={(v) => form.setValue("status", v, { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hadir">Hadir</SelectItem>
              <SelectItem value="izin">Izin</SelectItem>
              <SelectItem value="sakit">Sakit</SelectItem>
              <SelectItem value="alpha">Alpha</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Deskripsi</Label>
          <Textarea
            value={(form.watch("description") ?? "") as any}
            onChange={(e) => form.setValue("description", e.target.value, { shouldValidate: true })}
            placeholder="Catatan (opsional)"
          />
        </div>

        <div className="flex gap-2 md:col-span-2">
          <Button type="submit" disabled={!!isLoading}>
            {isLoading ? "Menyimpan..." : isCreate ? "Tambah" : "Simpan"}
          </Button>
          <Button type="button" variant="outline" onClick={() => window.history.back()} disabled={!!isLoading}>
            Batal
          </Button>
        </div>
      </form>
    </Form>
  );
}
