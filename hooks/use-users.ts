import { checkUserLogin } from "@/services/auth-service";
import { useQuery } from "@tanstack/react-query";

const queryKey = "users";

const toastText = "Pengguna ";

export function useUserLogin() {
  return useQuery({
    queryKey: [queryKey, "login"],
    queryFn: checkUserLogin,
  });
}
