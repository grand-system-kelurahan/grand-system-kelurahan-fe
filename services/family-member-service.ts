import { api } from "@/config/axios";
import {
  FormFamilyMemberSchema,
  TFamilyMember,
} from "@/schemas/family-member-schema";

const ENDPOINT = "family-cards";
const MEMBERS = "members";

export const createFamilyMember = async ({
  familyCardId,
  payload,
}: {
  familyCardId: number;
  payload: TFamilyMember;
}) => {
  const parsed = FormFamilyMemberSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return parsed.error;
  }
  const { data } = await api.post(
    `/${ENDPOINT}/${familyCardId}/${MEMBERS}`,
    parsed.data
  );
  return data;
};

export const updateFamilyMember = async ({
  familyCardId,
  payload,
}: {
  familyCardId: number;
  payload: Partial<TFamilyMember>;
}) => {
  const parsed = FormFamilyMemberSchema.partial().safeParse(payload);
  if (!parsed.success) {
    return parsed.error;
  }
  const { data } = await api.put(
    `/${ENDPOINT}/${familyCardId}/${MEMBERS}/${payload.id}`,
    parsed.data
  );
  return data;
};

export const deleteFamilyMember = async ({
  familyCardId,
  memberId,
}: {
  familyCardId: number;
  memberId: number;
}) => {
  const { data } = await api.delete(
    `/${ENDPOINT}/${familyCardId}/${MEMBERS}/${memberId}`
  );
  return data;
};
