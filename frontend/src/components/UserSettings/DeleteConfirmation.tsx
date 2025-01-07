
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteConfirmation({
  isOpen,
  onClose,
}: DeleteConfirmationProps) {
  // Here you'd trigger your destructive logic
  const handleConfirm = () => {
    // delete user logic, then onClose()
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmation Required</AlertDialogTitle>
          <AlertDialogDescription>
            All your account data will be <strong>permanently deleted</strong>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="space-x-2">
          <Button variant="destructive" onClick={handleConfirm}>
            Confirm
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
