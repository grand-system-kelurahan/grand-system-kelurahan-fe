import { useForm } from "react-hook-form";

import { useCreateUser } from "@/hooks/use-users";
import { FormUserSchema, TUser } from "@/schemas/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import UserForm from "./user-form";

export default function AddUserForm() {
  const form = useForm<TUser>({
    resolver: zodResolver(FormUserSchema),
    defaultValues: {},
  });

  const { mutate, isPending } = useCreateUser();

  async function onSubmit(values: TUser) {
    mutate(values);
  }

  return <UserForm form={form} onSubmit={onSubmit} isLoading={isPending} />;
}
