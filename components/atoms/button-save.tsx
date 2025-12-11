import { Save } from "lucide-react";

import { Button } from "../ui/button";
import LoadingIcon from "./loading-icon";

interface ButtonSaveProps {
  isLoading?: boolean;
  disabled?: boolean;
}

export default function ButtonSave({ isLoading, disabled }: ButtonSaveProps) {
  return (
    <Button
      type="submit"
      className="w-full"
      size={"sm"}
      disabled={isLoading || disabled}>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <LoadingIcon />
          Proses
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Save />
          Simpan
        </div>
      )}
    </Button>
  );
}
