"use client";

import { useState } from "react";
import { CheckCircle, Package, User, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useApproveLoan } from "@/hooks/use-asset-loans";
import { TAssetLoanWithRelations } from "@/schemas/asset-loan-schema";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";
import { toast } from "sonner";

interface ApproveLoanFormProps {
  loan: TAssetLoanWithRelations;
}

export default function ApproveLoanForm({ loan }: ApproveLoanFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { closeDialog } = useIsDialogOpenStore();
  const approveMutation = useApproveLoan();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await approveMutation.mutateAsync(loan.id!);
      
      toast.success("Berhasil disetujui");
      
      closeDialog();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Gagal menyetujui peminjaman";
      // toast.error(errorMessage);
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
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-center">
          Konfirmasi Persetujuan Peminjaman
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Package className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Aset</p>
              <p className="font-medium">{loan.asset?.asset_name}</p>
              <p className="text-sm">Kode: {loan.asset?.asset_code}</p>
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
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Jumlah</p>
              <p className="font-medium">{loan.quantity} unit</p>
            </div>
            
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Stok Tersedia</p>
              <p className="font-medium">{loan.asset?.available_stock || 0} unit</p>
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
                  {new Date(loan.planned_return_date).toLocaleDateString("id-ID")}
                </p>
              </div>
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

      {/* Warning if stock is insufficient */}
      {loan.asset && loan.quantity > loan.asset.available_stock && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Jumlah yang diminta ({loan.quantity} unit) melebihi stok tersedia ({loan.asset.available_stock} unit).
            Pastikan ketersediaan aset sebelum menyetujui.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button 
          type="submit" 
          disabled={isLoading || (loan.asset && loan.quantity > loan.asset.available_stock)}
          className="bg-green-600 hover:bg-green-700"
        >
          {isLoading ? "Menyetujui..." : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Setujui Peminjaman
            </>
          )}
        </Button>
      </div>
    </form>
  );
}