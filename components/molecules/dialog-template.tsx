import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useIsDialogOpenStore } from "@/stores/use-is-open-dialog-store";

import { Button } from "../ui/button";

interface DialogTemplateProps {
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
  closeMethod?: () => void;
}

export default function DialogTemplate({
  title,
  description,
  className,
  children,
  closeMethod,
}: DialogTemplateProps) {
  const { isDialogOpen, closeDialog } = useIsDialogOpenStore();

  return (
    <Dialog open={isDialogOpen}>
      <DialogContent
        showCloseButton={false}
        onKeyDown={(event) => event.stopPropagation()}
        className={cn("max-h-[80vh] overflow-y-auto", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <Button
          variant={"outline"}
          onClick={() => {
            closeDialog();
            if (closeMethod) {
              closeMethod();
            }
          }}
          size={"sm"}>
          Tutup
        </Button>
      </DialogContent>
    </Dialog>
  );
}
