import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCustomToast from "../hooks/useCustomToast";
import { emailPattern, handleError } from "../utils";
import { type ApiError, LoginService } from "../client";
import { isLoggedIn } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface FormData {
  email: string;
}

export const Route = createFileRoute("/recover-password")({
  component: RecoverPassword,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({ to: "/" });
    }
  },
});

function RecoverPassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const showToast = useCustomToast();

  const recoverPassword = async (data: FormData) => {
    await LoginService.recoverPassword({ email: data.email });
  };

  const mutation = useMutation({
    mutationFn: recoverPassword,
    onSuccess: () => {
      showToast(
        "Email sent.",
        "We sent an email with a link to reset your password.",
        "success"
      );
      reset();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="container flex items-center justify-center h-screen">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Password Recovery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <p className="text-center mb-4">
              A password recovery email will be sent to your account.
            </p>
            <div className="mb-4">
              <Input
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: emailPattern,
                })}
                placeholder="Email"
                type="email"
              />
              {errors && (
                <p className="text-sm text-red-500">{errors.email?.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Please wait...
                </>
              ) : (
                " Continue"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default RecoverPassword;
