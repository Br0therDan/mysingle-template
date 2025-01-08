// src/routes/profile.tsx

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProfileService } from "@/client/sdk.gen";
import type { ApiError, ProfileReadProfileResponse } from "@/client";
import { handleError } from "@/utils";
import { useToast } from "@/hooks/use_toast";
import useAuth from "@/hooks/useAuth"; // 경로를 실제 프로젝트 구조에 맞게 조정
import EditProfile from "@/components/Profile/EditProfile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/profile")({
  component: ProfilePage,
});

export default function ProfilePage() {
  const { user, isLoading: isAuthLoading, error: authError } = useAuth();
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const { toast } = useToast();
  const currentUserId = user?.id;
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

  // 에러 상태
  if (error || authError || !profileData) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">프로필을 불러오는 데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <>
    
      <Card className="p-6 shadow-md w-full">
        <h2 className="text-2xl font-bold mb-4">{profileData.first_name}{profileData.last_name}</h2>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Roles:</span>
            <span className="ml-2">
              {Array.isArray(profileData.roles)
                ? profileData.roles.map((role) => role.name).join(", ")
                : "N/A"}
            </span>
          </div>
          <div>
            <span className="font-semibold">Avatar URL:</span>
            <span className="ml-2">{profileData.avatar_url ?? "N/A"}</span>
          </div>
          <div>
            <span className="font-semibold">Bio:</span>
            <span className="ml-2">{profileData.bio ?? "N/A"}</span>
          </div>
          <div>
            <span className="font-semibold">Birth Date:</span>
            <span className="ml-2">
              {profileData.birth_date
                ? new Date(profileData.birth_date).toLocaleDateString()
                : ""}
            </span>
          </div>
        </div>
        <Button className="mt-4" onClick={() => setIsEditOpen(true)}>
          프로필 편집
        </Button>
      </Card>

      {/* EditProfile Modal */}
      <EditProfile
        // userId={currentUserId!} // currentUserId가 존재함을 보장
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  );
}
