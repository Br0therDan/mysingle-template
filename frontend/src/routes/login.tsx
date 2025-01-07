import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";
import type { Body_login_login_access_token as AccessToken } from "../client";
import useAuth, { isLoggedIn } from "../hooks/useAuth";
import { emailPattern } from "../utils";
import Logo from "@/components/buttons/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      });
    }
  },
});

export default function Login() {
  const { loginMutation, error, resetError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccessToken>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<AccessToken> = async (data) => {
    if (isSubmitting) return;

    resetError();

    try {
      await loginMutation.mutateAsync(data);
    } catch {
      // error is handled by useAuth hook
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2 text-2xl font-bold">
                <Logo />
                Sign in
              </CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="username"
                      {...register("username", {
                        required: "Username is required",
                        pattern: emailPattern,
                      })}
                      placeholder="Email"
                      type="email"
                      className={errors.username ? "border-red-500" : ""}
                    />
                    {errors.username && (
                      <p className="text-sm text-red-500">
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/recover-password"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                      type="password"
                      placeholder="Password"
                      className={error ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 text-gray-500"
                    >
                      Show
                    </Button>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                  </div>
                  <Button type="submit" className="w-full">
                    Sign in
                  </Button>
                  <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="underline text-blue-600">
                      Sign up
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
