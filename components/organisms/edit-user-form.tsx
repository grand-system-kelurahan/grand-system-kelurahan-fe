import { useForm } from "react-hook-form";

import { useUpdateUser } from "@/hooks/use-users";
import { FormUserSchema, TUser } from "@/schemas/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import UserForm from "./user-form";

interface Props {
  user: TUser;
}

export default function EditUserForm({ user }: Props) {
  const form = useForm<TUser>({
    resolver: zodResolver(FormUserSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      username: user.username,
    },
  });

  const { mutateAsync, isPending } = useUpdateUser();

  async function onSubmit(values: TUser) {
    await mutateAsync({
      id: user.id as number,
      payload: values,
    });
  }

  return <UserForm form={form} onSubmit={onSubmit} isLoading={isPending} />;
}
