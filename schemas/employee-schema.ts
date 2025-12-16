export type TEmployeeWithRelation = {
  id: number;
  employee_number: string;
  name: string;
  position?: string | null;
  is_active: number;
  user_id?: number | null;
  resident_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};
