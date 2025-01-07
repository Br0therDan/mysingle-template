// src/components/Profile/EditProfile.tsx

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
import { ProfilesService } from "@/client/sdk.gen";
import type {
  ProfilesUpdateProfileData,
  ProfilesUpdateProfileResponse,
} from "@/client/types.gen";
import type { ApiError } from "@/client/core/ApiError"; // 경로를 실제 프로젝트 구조에 맞게 조정
import { handleError } from "@/utils";
import useCustomToast from "@/hooks/useCustomToast";
import { createFileRoute } from '@tanstack/react-router';



interface ProfileFormData {
  role: string | null;
  avatar_url: string | null;
  bio: string | null;
  birth_date: string | null;
}

interface EditProfileProps {
  profileId: string;
  isOpen: boolean;
  onClose: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ profileId, isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<ProfileFormData>({
    defaultValues: {
      role: null,
      avatar_url: null,
      bio: null,
      birth_date: null,
    },
  });

  // Mutation for updating profile
  const mutation = useMutation<ProfilesUpdateProfileResponse, ApiError, ProfileFormData>({
    mutationFn: async (formData) => {
      const payload: ProfilesUpdateProfileData = {
        profileId,
        requestBody: formData,
      };
      return ProfilesService.updateProfile(payload);
    },
    onSuccess: () => {
      showToast("Success!", "Profile updated successfully.", "success");
      queryClient.invalidateQueries({ queryKey: ["profile", profileId] });
      onClose();
    },
    onError: (err) => {
      handleError(err, showToast);
    },
  });

  const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
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
            {/* Role */}
            <div className="grid gap-1.5">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                type="text"
                placeholder="e.g. Admin, Manager"
                {...register("role")}
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

export const Route = createFileRoute("/_layout/edit-profile")({
  component: EditProfile,
});

