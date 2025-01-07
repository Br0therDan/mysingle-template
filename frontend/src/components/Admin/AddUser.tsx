"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // If you generated a ShadCN Checkbox
import { MyButton } from "@/components/buttons/submit-button";  // Custom ShadCN-based button
import { type UserCreate, UsersService } from "../../client";
import type { ApiError } from "../../client/core/ApiError";
import useCustomToast from "../../hooks/useCustomToast";
import { emailPattern, handleError } from "../../utils";

interface AddUserProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserCreateForm extends UserCreate {
  confirm_password: string;
}

export default function AddUser({ isOpen, onClose }: AddUserProps) {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UserCreateForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
      is_superuser: false,
      is_active: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: UserCreate) => UsersService.createUser({ requestBody: data }),
    onSuccess: () => {
      showToast("Success!", "User created successfully.", "success");
      reset();
      onClose();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const onSubmit: SubmitHandler<UserCreateForm> = (data) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* No DialogTrigger here, as we open externally */}
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Provide user details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Email */}
          <div className="grid gap-1.5">
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
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Full name */}
          <div className="grid gap-1.5">
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              type="text"
              placeholder="Full name"
              {...register("full_name")}
            />
            {errors.full_name && (
              <p className="text-sm text-red-500">{errors.full_name.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="grid gap-1.5">
            <Label htmlFor="password">Set Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="grid gap-1.5">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Input
              id="confirm_password"
              type="password"
              placeholder="Confirm Password"
              {...register("confirm_password", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === getValues().password || "The passwords do not match",
              })}
            />
            {errors.confirm_password && (
              <p className="text-sm text-red-500">
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          {/* Superuser / Active */}
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_superuser"
                {...register("is_superuser")}
              />
              <Label htmlFor="is_superuser">Is superuser?</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                {...register("is_active")}
              />
              <Label htmlFor="is_active">Is active?</Label>
            </div>
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
