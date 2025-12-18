import { api } from "@/config/axios";
import {
  AssetLoanQuerySchema,
  CreateFormAssetLoanSchema,
  FormAssetLoanSchema,
  RejectLoanSchema,
  TAssetLoan,
  TAssetLoanQuery,
  TCreateAssetLoan,
  TRejectLoan,
} from "@/schemas/asset-loan-schema";

const ENDPOINT = "asset-loans";

export interface AssetLoanResponse {
  asset_loans: TAssetLoan[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
  };
}

export interface Resident {
  id: number;
  name: string;
  [key: string]: any;
}

export interface AssetLoanWithRelations extends TAssetLoan {
  asset?: {
    id: number;
    asset_name: string;
    asset_code: string;
    asset_type: string;
    available_stock: number;
  };
  resident?: Resident;
}

export const getAllAssetLoans = async (query?: TAssetLoanQuery) => {
  const parsedQuery = AssetLoanQuerySchema.safeParse(query || {});

  const params = new URLSearchParams();

  if (parsedQuery.success) {
    Object.entries(parsedQuery.data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
  }

  const { data } = await api.get<AssetLoanResponse>(
    `/${ENDPOINT}?${params.toString()}`
  );
  return data;
};

export const getAssetLoanById = async (id: number) => {
  const { data } = await api.get<AssetLoanWithRelations>(`/${ENDPOINT}/${id}`);
  return data;
};

export const createAssetLoan = async (payload: TCreateAssetLoan) => {
  const parsed = CreateFormAssetLoanSchema.safeParse(payload);
  if (!parsed.success) {
    throw parsed.error;
  }

  const { data } = await api.post<TAssetLoan>(`/${ENDPOINT}`, parsed.data);
  return data;
};

export const approveLoan = async (id: number) => {
  const { data } = await api.post<TAssetLoan>(`/${ENDPOINT}/${id}/approve`);
  return data;
};

export const returnLoan = async (id: number) => {
  const { data } = await api.post<TAssetLoan>(`/${ENDPOINT}/${id}/return`);
  return data;
};

export const rejectLoan = async (id: number, payload: TRejectLoan) => {
  const parsed = RejectLoanSchema.safeParse(payload);
  if (!parsed.success) {
    throw parsed.error;
  }

  const { data } = await api.post<TAssetLoan>(
    `/${ENDPOINT}/${id}/reject`,
    parsed.data
  );
  return data;
};

export const updateAssetLoan = async (
  id: number,
  payload: Partial<TAssetLoan>
) => {
  const parsed = FormAssetLoanSchema.partial().safeParse(payload);
  if (!parsed.success) {
    throw parsed.error;
  }

  const { data } = await api.put<TAssetLoan>(`/${ENDPOINT}/${id}`, parsed.data);
  return data;
};

export const deleteAssetLoan = async (id: number) => {
  const { data } = await api.delete(`/${ENDPOINT}/${id}`);
  return data;
};
