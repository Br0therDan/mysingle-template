import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";

// shadcn/ui components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ApiError, ProfileReadProfileResponse } from "@/client";
// Import hooks and utilities
import useAuth from "@/hooks/useAuth";
import { ProfileService } from "@/client/sdk.gen";
import { handleError } from "@/utils";
import type { ProfileUpdate } from "@/client/types.gen";
import { ApiError as apiError } from "@/client/core/ApiError";
import { useToast } from "@/hooks/use_toast";

interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ isOpen, onClose }) => {
  const { user, isLoading: isAuthLoading, error: authError } = useAuth();
  const currentUserId = user?.id;
  const { toast } = useToast();
  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery<ProfileReadProfileResponse, ApiError>({
    queryKey: ["profile", currentUserId],
    queryFn: () => ProfileService.readProfile({ userId: currentUserId! }),
    enabled: !!currentUserId, // currentUserId가 존재할 때만 쿼리 실행
  });

  useEffect(() => {
    if (error && typeof error !== "string") {
      handleError(error, toast);
    }
    if (authError && typeof authError === "string") {
      toast({
        title: "Authentication Error",
        description: authError,
      });
    }
  }, [error, authError, toast, currentUserId, isAuthLoading]);

  // 로딩 상태
  if (isAuthLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-2xl" />
      </div>
    );
  }
  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<ProfileUpdate>({
    defaultValues: {
      first_name: "",
      last_name: "",
      roles: [],
      avatar_url: "",
      bio: "",
      birth_date: "",
      role_ids: [],
    },
  });

  // Mutation for updating profile
  const mutation = useMutation({
    mutationFn: (data: ProfileUpdate) =>
      ProfileService.updateProfile({
        userId: user?.id!, // Use user.id from useAuth
        requestBody: data,
      }),
    onSuccess: () => {
      onClose();
    },
    onError: (err) => {
      // Ensure the error is an instance of ApiError
      if (err instanceof apiError) {
        handleError(err, console.error);
      } else {
        console.error("Unexpected error:", err);
      }
    },
  });

  // Update default values when user.profile changes
  useEffect(() => {
    if (profileData) {
      reset({
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        avatar_url: profileData.avatar_url || "",
        bio: profileData.bio || "",
        birth_date: profileData.birth_date || "",
        roles: profileData.roles,
        role_ids: profileData.roles?.map((role) => role.id),
      });
    }
  }, [profileData, reset]);

  const onSubmit: SubmitHandler<ProfileUpdate> = (data) => {
    mutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information below and save your changes.
            </DialogDescription>
          </DialogHeader>

          <Card className="p-4 space-y-3 my-2">
            {/* First Name */}
            <div className="grid gap-1.5">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                type="text"
                placeholder="First Name"
                {...register("first_name")}
              />
            </div>

            {/* Last Name */}
            <div className="grid gap-1.5">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                type="text"
                placeholder="Last Name"
                {...register("last_name")}
              />
            </div>

            {/* Role*/}
            <div className="grid gap-1.5">
              <Label htmlFor="last_name">Roles</Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    id="roles"
                    placeholder="Select Roles"
                    {...register("roles")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Super User">Super User</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/* 
              
              <Input
                id="roles"
                type="text"
                placeholder="User"
                {...register("roles")}
              />
            </div> */}

            {/* Avatar URL */}
            <div className="grid gap-1.5">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input
                id="avatar_url"
                type="url"
                placeholder="https://example.com/avatar.png"
                {...register("avatar_url")}
              />
            </div>

            {/* Bio */}
            <div className="grid gap-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                type="text"
                placeholder="Tell us about yourself"
                {...register("bio")}
              />
            </div>

            {/* Birth Date */}
            <div className="grid gap-1.5">
              <Label htmlFor="birth_date">Birth Date</Label>
              <Input id="birth_date" type="date" {...register("birth_date")} />
            </div>
          </Card>

          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isDirty || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Saving...
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
};

export default EditProfile;
