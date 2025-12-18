import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  TAssetLoanQuery,
  TCreateAssetLoan,
  TRejectLoan,
} from "@/schemas/asset-loan-schema";
import {
  approveLoan,
  createAssetLoan,
  deleteAssetLoan,
  getAllAssetLoans,
  getAssetLoanById,
  rejectLoan,
  returnLoan,
  updateAssetLoan,
} from "@/services/asset-loan-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAssetLoans = (query?: TAssetLoanQuery) => {
  return useQuery({
    queryKey: ["asset-loans", query],
    queryFn: () => getAllAssetLoans(query),
  });
};

export const useAssetLoan = (id: number) => {
  return useQuery({
    queryKey: ["asset-loan", id],
    queryFn: () => getAssetLoanById(id),
    enabled: !!id,
  });
};

export const useCreateAssetLoan = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createAssetLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asset-loans"] });
      toast.success("Peminjaman berhasil dibuat");
      router.back();
    },
    onError: (error) => {
      toast.error("Peminjaman gagal dibuat");
      console.error("Error creating data:", error);
    },
  });
};

export const useApproveLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveLoan,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["asset-loans"] });
      queryClient.invalidateQueries({ queryKey: ["asset-loan", id] });
    },
  });
};

export const useReturnLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: returnLoan,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["asset-loans"] });
      queryClient.invalidateQueries({ queryKey: ["asset-loan", id] });
    },
  });
};

export const useRejectLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number } & TRejectLoan) =>
      rejectLoan(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["asset-loans"] });
      queryClient.invalidateQueries({ queryKey: ["asset-loan", id] });
    },
  });
};

export const useUpdateAssetLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: number;
      payload: Partial<TCreateAssetLoan>;
    }) => updateAssetLoan(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["asset-loans"] });
      queryClient.invalidateQueries({ queryKey: ["asset-loan", id] });
    },
  });
};

export const useDeleteAssetLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAssetLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asset-loans"] });
    },
  });
};

export const useLoanReport = (query?: {
  loan_status?: string;
  asset_type?: string;
  from_date?: string;
  to_date?: string;
}) => {
  return useQuery({
    queryKey: ["loan-report", query],
    queryFn: () => getLoanReport(query),
  });
};
