import { z } from "zod";

export const LoanStatus = {
  REQUESTED: "requested",
  BORROWED: "borrowed",
  RETURNED: "returned",
  REJECTED: "rejected",
} as const;

export type LoanStatusType = (typeof LoanStatus)[keyof typeof LoanStatus];

export const AssetSchema = z.object({
  id: z.number(),
  asset_name: z.string(),
  asset_code: z.string(),
  asset_type: z.string(),
  available_stock: z.number(),
});

export const ResidentSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const FormAssetLoanSchema = z.object({
  id: z.number().optional(),
  asset_id: z.number(),
  resident_id: z.number(),
  quantity: z.number().min(1),
  loan_date: z.date(),
  planned_return_date: z.date(),
  actual_return_date: z.date().nullable().optional(),
  loan_status: z.enum(LoanStatus).default(LoanStatus.REQUESTED),
  loan_reason: z.string().nullable().optional(),
  rejected_reason: z.string().nullable().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// Extended schema dengan relations
export const AssetLoanWithRelationsSchema = FormAssetLoanSchema.extend({
  asset: AssetSchema.optional(),
  resident: ResidentSchema.optional(),
});

export const CreateFormAssetLoanSchema = FormAssetLoanSchema.pick({
  asset_id: true,
  resident_id: true,
  quantity: true,
  loan_date: true,
  planned_return_date: true,
  loan_reason: true,
});

export const UpdateFormAssetLoanSchema = FormAssetLoanSchema.partial();

export const RejectLoanSchema = z.object({
  rejected_reason: z.string().min(1, "Rejection reason is required"),
});

export const AssetLoanQuerySchema = z.object({
  keyword: z.string().optional(),
  loan_status: z.nativeEnum(LoanStatus).optional(),
  asset_type: z.string().optional(),
  resident_id: z.string().transform(Number).optional(),
  from_date: z.string().date().optional(),
  to_date: z.string().date().optional(),
  sort_by: z
    .enum([
      "id",
      "loan_date",
      "planned_return_date",
      "actual_return_date",
      "loan_status",
      "created_at",
    ])
    .default("created_at"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
  per_page: z.string().transform(Number).default(10),
  page: z.string().transform(Number).default(1),
});

// Types
export type TAsset = z.infer<typeof AssetSchema>;
export type TResident = z.infer<typeof ResidentSchema>;
export type TAssetLoan = z.infer<typeof FormAssetLoanSchema>;
export type TAssetLoanWithRelations = z.infer<
  typeof AssetLoanWithRelationsSchema
>; // ← TAMBAHKAN INI
export type TCreateAssetLoan = z.infer<typeof CreateFormAssetLoanSchema>;
export type TUpdateAssetLoan = z.infer<typeof UpdateFormAssetLoanSchema>;
export type TRejectLoan = z.infer<typeof RejectLoanSchema>;
export type TAssetLoanQuery = z.infer<typeof AssetLoanQuerySchema>;

// Schema untuk condition
export const ReturnConditionSchema = z.object({
  condition: z.enum(["good", "damaged", "lost"]),
  notes: z.string().optional(),
});

export type TReturnCondition = z.infer<typeof ReturnConditionSchema>;
