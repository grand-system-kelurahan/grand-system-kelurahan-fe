"use client";

import { useState } from "react";
import {
  CheckCircle,
  Package,
  User,
  Calendar,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useReturnLoan } from "@/hooks/use-asset-loans";
import { TAssetLoanWithRelations } from "@/schemas/asset-loan-schema";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { toast } from "sonner";

interface ReturnLoanFormProps {
  loan: TAssetLoanWithRelations;
}

export default function ReturnLoanForm({ loan }: ReturnLoanFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [returnCondition, setReturnCondition] = useState("good");
  const [notes, setNotes] = useState("");
  const { setDialogType } = useIsDialogOpenStore();
  const returnMutation = useReturnLoan();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await returnMutation.mutateAsync(loan.id!);

      toast({
        title: "Berhasil Dikembalikan",
        description: `Aset ${loan.asset?.asset_name} telah dikembalikan`,
        variant: "default",
      });

      setDialogType(null);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Gagal mengembalikan aset";

      toast({
        title: "Gagal",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setDialogType(null);
  };

  const calculateOverdueDays = () => {
    const plannedDate = new Date(loan.planned_return_date);
    const today = new Date();
    const diffTime = today.getTime() - plannedDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const isOverdue = calculateOverdueDays() > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Loan Information */}
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-full bg-blue-100 p-3">
            <CheckCircle className="h-10 w-10 text-blue-600" />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-center">
          Konfirmasi Pengembalian Aset
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Package className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Aset</p>
              <p className="font-medium">{loan.asset?.asset_name}</p>
              <p className="text-sm">Jumlah: {loan.quantity} unit</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <User className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Peminjam</p>
              <p className="font-medium">{loan.resident?.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Tanggal Pinjam</p>
                <p className="font-medium">
                  {new Date(loan.loan_date).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Rencana Kembali</p>
                <p className="font-medium">
                  {new Date(loan.planned_return_date).toLocaleDateString(
                    "id-ID"
                  )}
                </p>
              </div>
            </div>
          </div>

          {isOverdue && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Keterlambatan</p>
                  <p className="text-sm text-red-700">
                    Telat {calculateOverdueDays()} hari dari tanggal rencana
                    pengembalian
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Return Condition */}
      {/* <div className="space-y-3">
        <label className="text-sm font-medium">Kondisi Pengembalian</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              value: "good",
              label: "Baik",
              color: "bg-green-100 border-green-300 text-green-800",
            },
            {
              value: "damaged",
              label: "Rusak",
              color: "bg-yellow-100 border-yellow-300 text-yellow-800",
            },
            {
              value: "lost",
              label: "Hilang",
              color: "bg-red-100 border-red-300 text-red-800",
            },
          ].map((condition) => (
            <button
              key={condition.value}
              type="button"
              className={`p-3 border rounded-lg text-center transition-colors ${
                returnCondition === condition.value
                  ? condition.color
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
              onClick={() => setReturnCondition(condition.value)}
            >
              <p className="font-medium">{condition.label}</p>
            </button>
          ))}
        </div>
      </div> */}

      {/* Notes */}
      {/* <div className="space-y-3">
        <label className="text-sm font-medium">Catatan (Opsional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm min-h-[80px]"
          placeholder="Tambahkan catatan tentang kondisi aset yang dikembalikan..."
        />
      </div> */}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            "Memproses..."
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Konfirmasi Pengembalian
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
