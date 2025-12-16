"use client";

import type { UseFormReturn } from "react-hook-form";
import { useMemo } from "react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useUsers } from "@/hooks/use-users";
import { useRegions } from "@/hooks/use-regions";

import type { TEmployeeFormValues } from "./employee-upsert-form";
import { ResidentSearchSelect } from "./employee-resident-form";

type Props = {
  form: UseFormReturn<TEmployeeFormValues>;
  onSubmit: (values: TEmployeeFormValues) => void | Promise<void>;
  isLoading?: boolean;
  isCreate?: boolean;
};

export default function EmployeeForm({ form, onSubmit, isLoading, isCreate }: Props) {
  const { data: usersResp, isLoading: usersLoading } = useUsers();
  const { data: regionsResp, isLoading: regionsLoading } = useRegions();

  const users = useMemo(() => {
    const list = (usersResp as any)?.data?.users ?? (usersResp as any)?.users ?? usersResp ?? [];
    return Array.isArray(list) ? list : [];
  }, [usersResp]);

  const regions = useMemo(() => {
    const list = (regionsResp as any)?.data?.regions ?? (regionsResp as any)?.regions ?? regionsResp ?? [];
    return Array.isArray(list) ? list : [];
  }, [regionsResp]);

  const activeValue = String(form.watch("is_active") ?? 1);
  const userValue = form.watch("user_id");
  const regionValue = (form.watch as any)("region_id");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Nomor Pegawai</Label>
          <Input
            value={form.watch("employee_number") ?? ""}
            onChange={(e) => form.setValue("employee_number", e.target.value, { shouldValidate: true })}
            placeholder="EMP001"
          />
          {form.formState.errors.employee_number?.message && (
            <p className="text-sm text-destructive">{form.formState.errors.employee_number.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Nama</Label>
          <Input
            value={form.watch("name") ?? ""}
            onChange={(e) => form.setValue("name", e.target.value, { shouldValidate: true })}
            placeholder="Nama Pegawai"
          />
          {form.formState.errors.name?.message && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Jabatan</Label>
          <Input
            value={form.watch("position") ?? ""}
            onChange={(e) => form.setValue("position", e.target.value, { shouldValidate: true })}
            placeholder="Staff / Manager"
          />
        </div>

        <div className="space-y-2">
          <Label>Status Aktif</Label>
          <Select value={activeValue} onValueChange={(v) => form.setValue("is_active", Number(v), { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Aktif</SelectItem>
              <SelectItem value="0">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>User</Label>
          <Select
            value={userValue ? String(userValue) : ""}
            onValueChange={(v) => form.setValue("user_id", v ? Number(v) : undefined, { shouldValidate: true })}
            disabled={usersLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={usersLoading ? "Memuat pengguna..." : "Pilih pengguna"} />
            </SelectTrigger>
            <SelectContent>
              {users.map((u: any) => (
                <SelectItem key={u.id} value={String(u.id)}>
                  {u.name ?? u.username ?? `User ${u.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Penduduk</Label>
          <ResidentSearchSelect form={form} disabled={!!isLoading} />
          {form.formState.errors.resident_id?.message && (
            <p className="text-sm text-destructive">{String(form.formState.errors.resident_id.message)}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Region</Label>
          <Select
            value={regionValue ? String(regionValue) : ""}
            onValueChange={(v) => (form as any).setValue("region_id", v ? Number(v) : undefined, { shouldValidate: true })}
            disabled={regionsLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={regionsLoading ? "Memuat lingkungan..." : "Pilih lingkungan"} />
            </SelectTrigger>
            <SelectContent>
              {regions.map((r: any) => (
                <SelectItem key={r.id} value={String(r.id)}>
                  {r.name ?? r.title ?? `Region ${r.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.region_id?.message && (
            <p className="text-sm text-destructive">{String(form.formState.errors.region_id.message)}</p>
          )}
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