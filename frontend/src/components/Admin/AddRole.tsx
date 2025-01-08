"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MyButton } from "@/components/buttons/submit-button"; // Custom ShadCN-based button
import { ProfileService, RoleCreate } from "../../client";
import type { ApiError } from "../../client/core/ApiError";
import { handleError } from "../../utils";
import { useToast } from "@/hooks/use_toast";

interface AddRoleProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddRole({ isOpen, onClose }: AddRoleProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoleCreate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      name: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: RoleCreate) =>
      ProfileService.createRole({ requestBody: data }),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Role created successfully.",
      });
      reset();
      onClose();
    },
    onError: (err: ApiError) => {
      handleError(err, toast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  const onSubmit: SubmitHandler<RoleCreate> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* No DialogTrigger here, as we open externally */}
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Role</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Provide role name below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Role Name */}
            <div className="grid gap-1.5">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                type="test"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-3 pt-2">
            <MyButton
              variant="default"
              type="submit"
              isLoading={isSubmitting}
              className="w-24"
            >
              Save
            </MyButton>
            <MyButton
              variant="outline"
              onClick={onClose}
              className="w-24"
              type="button"
            >
              Cancel
            </MyButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
