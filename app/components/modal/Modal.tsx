import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function Modal({
  title,
  children,
  isOpen,
  onOpenChange,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
