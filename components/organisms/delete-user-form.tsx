import { useDeleteUser } from "@/hooks/use-users";
import { TUser } from "@/schemas/user-schema";

import ButtonDelete from "../atoms/button-delete";

interface Props {
  user: TUser;
}

export default function DeleteUserForm({ user }: Props) {
  const { isPending, mutateAsync } = useDeleteUser();

  async function onSubmit() {
    await mutateAsync(user.id as number);
  }

  return <ButtonDelete isLoading={isPending} onClick={onSubmit} />;
}
