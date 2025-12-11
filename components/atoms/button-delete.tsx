import { Trash } from "lucide-react";

import { Button } from "../ui/button";
import LoadingIcon from "./loading-icon";

interface ButtonDeleteProps {
  isLoading: boolean;
  onClick: () => void;
}

export default function ButtonDelete({
  isLoading,
  onClick,
}: ButtonDeleteProps) {
  return (
    <Button
      disabled={isLoading}
      onClick={onClick}
      size={"sm"}
      variant={"destructive"}>
      {isLoading ? (
        <div className="flex justify-center items-center gap-2 w-full">
          <LoadingIcon /> Proses
        </div>
      ) : (
        <div className="flex justify-center items-center gap-2 w-full">
          <Trash />
          Hapus
        </div>
      )}
    </Button>
  );
}
