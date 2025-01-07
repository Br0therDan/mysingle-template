"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as React from "react";
import { ItemsService, UsersService } from "../../client";
import { useToast } from "@/hooks/use_toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { MyButton } from "../buttons/submit-button";

interface DeleteProps {
  type: "Item" | "User";
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Delete({ type, id, isOpen, onClose }: DeleteProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const deleteEntity = async (id: string) => {
    if (type === "Item") {
      await ItemsService.deleteItem({ itemId: id });
    } else if (type === "User") {
      await UsersService.deleteUser({ userId: id });
    } else {
      throw new Error(`Unexpected type: ${type}`);
    }
  };

  const mutation = useMutation({
    mutationFn: deleteEntity,
    onSuccess: () => {
      toast({
        title: "Success!",
        description: `The ${type.toLowerCase()} was deleted successfully.`,
      })
      onClose();
    },
    onError: () => {
      toast({
        title: "An error occurred.",
        description: `An error occurred while deleting the ${type.toLowerCase()}.`,
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [type === "Item" ? "items" : "users"],
      });
    },
  });

  const onSubmit = () => {
    mutation.mutate(id);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      {/* We open externally, so no AlertDialogTrigger here */}
      <AlertDialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {type}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              {type === "User" && (
                <span>
                  All items associated with this user will also be{" "}
                  <strong>permanently deleted.</strong>{" "}
                </span>
              )}
              Are you sure? You will not be able to undo this action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="space-x-2">
            <MyButton
              variant="destructive"
              type="submit"
              isLoading={isSubmitting}
            >
              Delete
            </MyButton>
            <MyButton
              ref={cancelRef}
              onClick={onClose}
              disabled={isSubmitting}
              variant="outline"
              type="button"
            >
              Cancel
            </MyButton>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
