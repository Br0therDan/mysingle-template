"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import { ApiError, UpdatePassword, UsersService } from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import { confirmPasswordRules, handleError, passwordRules } from "../../utils";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormMessage } from "@/components/ui/form";
import { MyButton } from "../buttons/submit-button";

interface UpdatePasswordForm extends UpdatePassword {
  confirm_password: string;
}

const ChangePassword = () => {
  const showToast = useCustomToast();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordForm>({
    mode: "onBlur",
    criteriaMode: "all",
  });

  const mutation = useMutation({
    mutationFn: (data: UpdatePassword) =>
      UsersService.updatePasswordMe({ requestBody: data }),
    onSuccess: () => {
      // Ensure "success" aligns with the ToastStatus type
      showToast("Password updated successfully.", "success");
      reset();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
  });

  const onSubmit: SubmitHandler<UpdatePasswordForm> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-lg font-medium mb-4">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Current Password */}
        <Label htmlFor="current_password">Current Password</Label>
        <Input
          id="current_password"
          type="password"
          placeholder="Password"
          {...register("current_password", {
            required: "Current password is required.",
          })}
        />
        {errors.current_password && (
          <FormMessage>{errors.current_password.message}</FormMessage>
        )}

        {/* New Password */}
        <Label htmlFor="new_password">Set Password</Label>
        <Input
          id="new_password"
          type="password"
          placeholder="Password"
          {...register("new_password", passwordRules())}
        />
        {errors.new_password && (
          <FormMessage>{errors.new_password.message}</FormMessage>
        )}

        {/* Confirm Password */}
        <Label htmlFor="confirm_password">Confirm Password</Label>
        <Input
          id="confirm_password"
          type="password"
          placeholder="Password"
          {...register("confirm_password", confirmPasswordRules(getValues))}
        />
        {errors.confirm_password && (
          <FormMessage>{errors.confirm_password.message}</FormMessage>
        )}

        {/* Submit Button */}
        <MyButton type="submit" className="w-full" isLoading={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" size={20} />
              Please wait...
            </span>
          ) : (
            "Save"
          )}
        </MyButton>
      </form>
    </div>
  );
};

export default ChangePassword;
