import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  type ApiError,
  type UserPublic,
  type UpdatePassword,
  UsersService,
} from "@/client";
import useAuth from "@/hooks/useAuth";
import { useToast } from '@/hooks/use_toast';
import { emailPattern, handleError } from "@/utils";

const UserInformation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const { user: currentUser } = useAuth();

  // User Information Form
  const {
    register,
    handleSubmit,
    reset,
    // getValues,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<UserPublic>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      full_name: currentUser?.full_name,
      email: currentUser?.email,
    },
  });

  // Password Update Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { isSubmitting: isPasswordSubmitting, errors: passwordErrors },
  } = useForm<UpdatePassword>({
    mode: "onBlur",
    criteriaMode: "all",
  });

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const userMutation = useMutation({
    mutationFn: (data: UserPublic) =>
      UsersService.updateUser({
        userId: currentUser?.id!,
        requestBody: data,
      }),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "User updated successfully.",
      })
      queryClient.invalidateQueries();
      toggleEditMode();
    },
    onError: (err: ApiError) => {
      handleError(err, toast);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (data: UpdatePassword) =>
      UsersService.updatePasswordMe({ requestBody: data }),
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Password updated successfully.",
      })
      resetPassword();
    },
    onError: (err: ApiError) => {
      handleError(err, toast);
    },
  });

  const onSubmitUserInfo: SubmitHandler<UserPublic> = async (data) => {
    userMutation.mutate(data);
  };

  const onSubmitPassword: SubmitHandler<UpdatePassword> = async (data) => {
    passwordMutation.mutate(data);
  };

  const onCancel = () => {
    reset();
    toggleEditMode();
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">User Information</h2>
      <Card className="p-4 space-y-4">
        <form onSubmit={handleSubmit(onSubmitUserInfo)}>
          <div className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="full_name">Full Name</Label>
              {editMode ? (
                <Input
                  id="full_name"
                  {...register("full_name", { maxLength: 30 })}
                  type="text"
                  placeholder="Full Name"
                />
              ) : (
                <p>{currentUser?.full_name || "N/A"}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              {editMode ? (
                <Input
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: emailPattern,
                  })}
                  type="email"
                  placeholder="Email"
                />
              ) : (
                <p>{currentUser?.email}</p>
              )}
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type={editMode ? "submit" : "button"}
              onClick={!editMode ? toggleEditMode : undefined}
              disabled={editMode && (!isDirty || isSubmitting)}
            >
              {editMode ? (isSubmitting ? "Saving..." : "Save") : "Edit"}
            </Button>
            {editMode && (
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <h2 className="text-xl font-semibold mt-6">Change Password</h2>
      <Card className="p-4 space-y-4">
        <form onSubmit={handlePasswordSubmit(onSubmitPassword)}>
          <div className="grid gap-1.5">
            <Label htmlFor="current_password">Current Password</Label>
            <Input
              id="current_password"
              {...registerPassword("current_password", {
                required: "Current password is required",
              })}
              type="password"
              placeholder="Current Password"
            />
            {passwordErrors.current_password && (
              <p className="text-red-500 text-sm">
                {passwordErrors.current_password.message}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="new_password">New Password</Label>
            <Input
              id="new_password"
              {...registerPassword("new_password", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              type="password"
              placeholder="New Password"
            />
            {passwordErrors.new_password && (
              <p className="text-red-500 text-sm">
                {passwordErrors.new_password.message}
              </p>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={isPasswordSubmitting}>
              {isPasswordSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UserInformation;
