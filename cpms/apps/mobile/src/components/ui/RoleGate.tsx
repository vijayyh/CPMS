import React from 'react';
import { useAuthStore, UserRole } from '../../core/authStore';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function RoleGate({ children, allowedRoles }: RoleGateProps) {
  const user = useAuthStore(state => state.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
