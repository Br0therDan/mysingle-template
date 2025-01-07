// src/components/RoleBasedAccess.tsx

import useAuth from '@/hooks/useAuth';
import { ReactNode } from 'react';

interface RoleBasedAccessProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function RoleBasedAccess({ children, allowedRoles }: RoleBasedAccessProps) {
  const { user } = useAuth();

  if (!user || !user.profile.roles().some(role => allowedRoles.includes(role))) {
    return null;
  }

  return <>{children}</>;
}


