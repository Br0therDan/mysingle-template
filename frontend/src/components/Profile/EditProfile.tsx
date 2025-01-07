import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

// shadcn/ui components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Import hooks and utilities
import useAuth from "@/hooks/useAuth";
import { UsersService } from "@/client/sdk.gen";
import { handleError } from "@/utils";
import type { ProfileUpdate } from "@/client/types.gen";
import { ApiError } from "@/client/core/ApiError";

interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth(); // Get the user object from useAuth

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
      avatar_url: "",
      bio: "",
      birth_date: "",
      roles: null,
      role_ids: null,
    },
  });

  // Mutation for updating profile
  const mutation = useMutation({
    mutationFn: (data: ProfileUpdate) =>
      UsersService.updateProfile({
        userId: user?.id!, // Use user.id from useAuth
        requestBody: data,
      }),
    onSuccess: () => {
      onClose();
    },
    onError: (err) => {
      // Ensure the error is an instance of ApiError
      if (err instanceof ApiError) {
        handleError(err, console.error);
      } else {
        console.error("Unexpected error:", err);
      }
    },
  });

  // Update default values when user.profile changes
  useEffect(() => {
    if (user?.profile) {
      reset({
        first_name: user.profile.first_name || "",
        last_name: user.profile.last_name || "",
        avatar_url: user.profile.avatar_url || "",
        bio: user.profile.bio || "",
        birth_date: user.profile.birth_date || "",
        roles: user.profile.roles || null,
        role_ids: user.profile.roles?.map((role) => role.id) || null,
      });
    }
  }, [user?.profile, reset]);

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
              <Input
                id="birth_date"
                type="date"
                {...register("birth_date")}
              />
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
