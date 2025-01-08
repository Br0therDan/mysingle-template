// src/components/RoleBasedAccess.tsx

import { ApiError, ProfileReadProfileResponse, ProfileService } from '@/client';
import useAuth from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';

interface RoleBasedAccessProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function RoleBasedAccess({ children, allowedRoles }: RoleBasedAccessProps) {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const {
    data: profileData,
  } = useQuery<ProfileReadProfileResponse, ApiError>({
    queryKey: ["profile", currentUserId],
    queryFn: () => ProfileService.readProfile({ userId: currentUserId! }),
    enabled: !!currentUserId, // currentUserId가 존재할 때만 쿼리 실행
  });

  if (
    !user || 
    !profileData?.roles || 
    !profileData.roles.some(role => allowedRoles.includes(role.name)) // Role 객체의 name 속성과 비교
  ) {
    return null;
  }

  return <>{children}</>;
}