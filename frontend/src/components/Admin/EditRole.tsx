import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
  ProfileService,
  RolePublic,
  RoleUpdate,
  type ApiError,
} from "../../client";
import { useToast } from "@/hooks/use_toast";
import { emailPattern, handleError } from "../../utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface EditRoleProps {
  role: RolePublic;
  isOpen: boolean;
  onClose: () => void;
}

interface RoleUpdateForm extends RoleUpdate {
  confirm_password?: string;
}

export default function EditRole({ role, isOpen, onClose }: EditRoleProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RoleUpdateForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: role,
  });

  const mutation = useMutation({
    mutationFn: (data: RoleUpdateForm) =>
      ProfileService.updateRole({ roleId: role.id, requestBody: data }),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "User updated successfully.",
      });

      onClose();
    },
    onError: (err: ApiError) => {
      handleError(err, toast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });

  const onSubmit: SubmitHandler<RoleUpdateForm> = async (data) => {
    mutation.mutate(data);
  };

  const onCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* No DialogTrigger here, we open/close externally */}
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Update the Role information below and save your changes.
            </DialogDescription>
          </DialogHeader>

          {/* Name */}
          <div className="grid gap-1.5 py-2">
            <Label htmlFor="name">Email</Label>
            <Input
              id="name"
              type="name"
              {...register("name", {
                required: "Name is required",
                pattern: emailPattern,
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              variant="default"
              onClick={onCancel}
              disabled={isSubmitting}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full" disabled={!isDirty}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Please wait...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
