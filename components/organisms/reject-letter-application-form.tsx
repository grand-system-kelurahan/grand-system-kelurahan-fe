import { Check, X } from "lucide-react";
import { toast } from "sonner";

import {
  useApproveLetterApplication,
  useRejectLetterApplication,
} from "@/hooks/use-letter-applications";
import {
  TLetterApplication,
  TLetterApplicationWithRelation,
} from "@/schemas/letter-application-schema";
import { TUser } from "@/schemas/user-schema";

import LoadingIcon from "../atoms/loading-icon";
import { Button } from "../ui/button";

interface Props {
  letterApplication: TLetterApplicationWithRelation;
  approvedBy: TUser;
}

export default function RejectLetterApplicationForm({
  letterApplication,
  approvedBy,
}: Props) {
  const { isPending, mutateAsync } = useRejectLetterApplication();

  async function onSubmit() {
    if (!approvedBy) {
      toast.error("Pengguna belum login");
      return;
    }
    const payload: Partial<TLetterApplication> = { approved_by: approvedBy.id };

    const res = await mutateAsync({
      id: letterApplication.id as number,
      payload,
    });
    console.log(res);
  }

  return (
    <Button
      onClick={onSubmit}
      disabled={isPending}
      className="w-full"
      variant={"destructive"}>
      {isPending ? (
        <>
          <LoadingIcon />
          Memproses...
        </>
      ) : (
        <>
          <X className="mr-2 w-4 h-4" />
          Tolak
        </>
      )}
    </Button>
  );
}
