import {
  getReportsPublic,
  getReportsWithAuth,
} from "@/services/report-service";
import { useQuery } from "@tanstack/react-query";

export function useReportsPublic() {
  return useQuery({
    queryKey: ["public-reports"],
    queryFn: getReportsPublic,
  });
}

export function useReportsWithAuth() {
  return useQuery({
    queryKey: ["auth-reports"],
    queryFn: getReportsWithAuth,
  });
}
