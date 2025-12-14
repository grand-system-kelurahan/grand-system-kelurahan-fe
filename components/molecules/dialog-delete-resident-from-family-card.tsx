import { Trash } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ButtonDestructiveCSS } from "@/consts/button-css";
import { useDeleteFamilyMember } from "@/hooks/use-family-members";

import LoadingIcon from "../atoms/loading-icon";

interface Props {
  familyCardId: number;
  memberId: number;
}

export default function DialogDeleteResidentFromFamilyCard({
  familyCardId,
  memberId,
}: Props) {
  const { mutateAsync, isPending } = useDeleteFamilyMember();

  async function handleDelete() {
    await mutateAsync({
      familyCardId,
      memberId,
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className={ButtonDestructiveCSS}>
        <Trash />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Data Anggota Keluarga</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus data anggota keluarga ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="text-white">
            {isPending ? (
              <div className="flex items-center gap-2">
                <LoadingIcon />
                Menghapus...
              </div>
            ) : (
              <div className="">Hapus</div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
