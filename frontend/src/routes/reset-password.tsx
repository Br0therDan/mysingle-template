import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use_toast";
import { type ApiError, LoginService, type NewPassword } from "../client";
import { confirmPasswordRules, handleError, passwordRules } from "../utils";
import { isLoggedIn } from "@/hooks/useAuth";

interface NewPasswordForm extends NewPassword {
  confirm_password: string;
}

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({ to: "/" });
    }
  },
});

function ResetPassword() {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<NewPasswordForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: { new_password: "" },
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const resetPassword = async (data: NewPassword) => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) return;
    await LoginService.resetPassword({
      requestBody: { new_password: data.new_password, token },
    });
  };

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      showToast("Success!", "Password updated successfully.", "success");
      reset();
      navigate({ to: "/login" });
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
  });

  const onSubmit: SubmitHandler<NewPasswordForm> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="container flex items-center justify-center h-screen">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <p className="text-center mb-4">
              Please enter your new password and confirm it.
            </p>
            <div className="mb-4">
              <Input
                id="password"
                {...register("new_password", passwordRules())}
                placeholder="New Password"
                type="password"
              />
              {errors && (
                <p className="text-sm text-red-500">
                  {errors.new_password?.message}
                </p>
              )}
            </div>
            <div className="mb-4">
              <Input
                id="confirm_password"
                {...register(
                  "confirm_password",
                  confirmPasswordRules(getValues)
                )}
                placeholder="Confirm Password"
                type="password"
              />
              {errors && (
                <p className="text-sm text-red-500">
                  {errors.confirm_password?.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResetPassword;
