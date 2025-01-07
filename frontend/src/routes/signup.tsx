import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Logo from "@/components/buttons/Logo";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";
import type { UserRegister } from "../client";
import useAuth, { isLoggedIn } from "../hooks/useAuth";
import { confirmPasswordRules, emailPattern, passwordRules } from "../utils";

export const Route = createFileRoute("/signup")({
  component: SignUp,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      });
    }
  },
});

interface UserRegisterForm extends UserRegister {
  confirm_password: string;
}

export function SignUp() {
  const { signUpMutation, error, resetError } = useAuth();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit: SubmitHandler<UserRegisterForm> = (data) => {
    if (isSubmitting) return;

    resetError();
    try {
      signUpMutation.mutate(data);
    } catch {
      // error is handled by useAuth hook
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2 text-2xl font-bold">
                <Logo />
                Sign up
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      minLength={3}
                      {...register("full_name", {
                        required: "Full Name is required",
                      })}
                      placeholder="Full Name"
                      type="text"
                    />
                    {errors.full_name && (
                      <p className="text-sm text-red-500">
                        {errors.full_name.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: emailPattern,
                      })}
                      placeholder="Email"
                      type="email"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      {...register("password", passwordRules())}
                      placeholder="Password"
                      type="password"
                      required
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirm_password"
                      {...register(
                        "confirm_password",
                        confirmPasswordRules(getValues)
                      )}
                      placeholder="Repeat Password"
                      type="password"
                      required
                    />
                    {errors.confirm_password && (
                      <p className="text-sm text-red-500">
                        {errors.confirm_password.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    Sign up
                  </Button>
                  <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="underline underline-offset-4">
                      Sign in
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
