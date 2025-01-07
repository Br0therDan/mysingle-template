import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";
import {
  UsersService,
  type ApiError,
  type UserPublic,
  type UserUpdate,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface EditUserProps {
  user: UserPublic;
  isOpen: boolean;
  onClose: () => void;
}

interface UserUpdateForm extends UserUpdate {
  confirm_password?: string;
}

export default function EditUser({ user, isOpen, onClose }: EditUserProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UserUpdateForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: user,
  });

  const mutation = useMutation({
    mutationFn: (data: UserUpdateForm) =>
      UsersService.updateUser({ userId: user.id, requestBody: data }),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "User updated successfully.",
      })
  
      onClose();
    },
    onError: (err: ApiError) => {
      handleError(err, toast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const onSubmit: SubmitHandler<UserUpdateForm> = async (data) => {
    if (data.password === "") {
      data.password = undefined;
    }
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
              Update the user information below and save your changes.
            </DialogDescription>
          </DialogHeader>

          {/* Email */}
          <div className="grid gap-1.5 py-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: emailPattern,
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div className="grid gap-1.5 py-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" type="text" {...register("full_name")} />
          </div>

          {/* Password */}
          <div className="grid gap-1.5 py-2">
            <Label htmlFor="password">Set Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              {...register("password", {
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="grid gap-1.5 py-2">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Input
              id="confirm_password"
              type="password"
              placeholder="Password"
              {...register("confirm_password", {
                validate: (value) =>
                  value === getValues().password ||
                  "The passwords do not match",
              })}
            />
            {errors.confirm_password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          {/* Superuser / Active */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="is_superuser" {...register("is_superuser")} />
              <Label htmlFor="is_superuser">Is superuser?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="is_active" {...register("is_active")} />
              <Label htmlFor="is_active">Is active?</Label>
            </div>
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
