"use client";

import { useState } from "react";
import { XCircle, Package, User, Calendar, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRejectLoan } from "@/hooks/use-asset-loans";
import { TAssetLoanWithRelations } from "@/schemas/asset-loan-schema";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { toast } from "sonner";

interface RejectLoanFormProps {
  loan: TAssetLoanWithRelations;
}

export default function RejectLoanForm({ loan }: RejectLoanFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const { closeDialog } = useIsDialogOpenStore();
  const rejectMutation = useRejectLoan();

  const predefinedReasons = [
    "Stok tidak tersedia",
    "Jadwal bentrok dengan peminjaman lain",
    "Peminjaman tidak sesuai dengan peraturan",
    "Dokumen tidak lengkap",
    "Lainnya",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rejectionReason) {
      toast.error("Pilih alasan penolakan");
      return;
    }

    
    const finalReason = rejectionReason === "Lainnya" ? customReason : rejectionReason;
    console.log(finalReason);

    setIsLoading(true);

    try {
      const result = await rejectMutation.mutateAsync({
        id: loan.id!,
        rejected_reason: finalReason,
      });

      console.log(result);
      
      toast.success("Berhasil menolak peminjaman");
      
      closeDialog();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Gagal menolak peminjaman";
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    closeDialog();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Loan Information */}
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-center">
          Tolak Pengajuan Peminjaman
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
          
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Rencana Pinjam</p>
              <p className="font-medium">
                {new Date(loan.loan_date).toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>
          
          {loan.loan_reason && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Alasan Peminjaman</p>
              <p className="font-medium mt-1">{loan.loan_reason}</p>
            </div>
          )}
        </div>
      </div>

      {/* Warning */}
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Perhatian</p>
            <p className="text-sm text-yellow-700">
              Tindakan ini akan menolak pengajuan peminjaman. Peminjam akan menerima notifikasi penolakan.
            </p>
          </div>
        </div>
      </div>

      {/* Rejection Reason */}
      <div className="space-y-4">
        <Label>Alasan Penolakan</Label>
        
        <div className="space-y-2">
          {predefinedReasons.map((reason) => (
            <div key={reason} className="flex items-center gap-2">
              <input
                type="radio"
                id={`reason-${reason}`}
                name="rejectionReason"
                value={reason}
                checked={rejectionReason === reason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="h-4 w-4"
              />
              <label 
                htmlFor={`reason-${reason}`}
                className="text-sm cursor-pointer"
              >
                {reason}
              </label>
            </div>
          ))}
        </div>
        
        {rejectionReason === "Lainnya" && (
          <div className="space-y-2">
            <Label>Tulis Alasan Lainnya</Label>
            <Textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Jelaskan alasan penolakan secara detail..."
              className="min-h-[100px]"
              required
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button 
          type="submit" 
          disabled={isLoading || !rejectionReason || (rejectionReason === "Lainnya" && !customReason)}
          variant="destructive"
        >
          {isLoading ? "Memproses..." : (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Tolak Pengajuan
            </>
          )}
        </Button>
      </div>
    </form>
  );
}