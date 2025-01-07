import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";

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

// Auto-generated API client
import { UsersService } from "@/client/sdk.gen";

// Import types
import type {
  ProfileUpdate,
  UsersUpdateProfileData,
  UsersUpdateProfileResponse,
} from "@/client/types.gen";
import type { ApiError } from "@/client/core/ApiError"; // Adjust path based on your project structure

// Import utilities and hooks
import { handleError } from "@/utils";
import useCustomToast from "@/hooks/useCustomToast";

// Import Role type
import type { Role } from "@/client/types.gen";

interface EditProfileProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ userId, isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();

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
      roles: [],
      role_ids: [],
    },
  });

  // Mutation for updating profile
  const mutation = useMutation<UsersUpdateProfileResponse, ApiError>({
    mutationFn: async (formData) => {
      const payload: UsersUpdateProfileData = {
        userId,
        requestBody: formData,
      };
      return UsersService.updateProfile(payload);
    },
    onSuccess: () => {
      showToast("Success!", "Profile updated successfully.", "success");
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      onClose();
    },
    onError: (err) => {
      handleError(err, showToast);
    },
  });

  const onSubmit: SubmitHandler<ProfileUpdate> = (data) => {
    // Transform roles into role_ids for API compatibility
    if (data.roles) {
      data.role_ids = data.roles.map((role) => role.id);
    }
    mutation.mutate(data);
  };

  const handleCancel = () => {
    reset();
    onClose();
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
              <Input id="birth_date" type="date" {...register("birth_date")} />
            </div>
          </Card>

          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="w-full"
            >
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
