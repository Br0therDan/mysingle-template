// src/components/RoleBasedAccess.tsx

import useAuth from '@/hooks/useAuth';
import { ReactNode } from 'react';

interface RoleBasedAccessProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function RoleBasedAccess({ children, allowedRoles }: RoleBasedAccessProps) {
  const { user } = useAuth();

  if (
    !user || 
    !user.profile?.roles || 
    !user.profile.roles.some(role => allowedRoles.includes(role.name)) // Role 객체의 name 속성과 비교
  ) {
    return null;
  }

  return <>{children}</>;
}