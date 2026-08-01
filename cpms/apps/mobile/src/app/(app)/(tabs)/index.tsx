import React from 'react';
import { useAuthStore } from '../../../core/authStore';
import ManagerDashboard from '../../../components/dashboard/manager/ManagerDashboard';
import EmployeeDashboard from '../../../components/dashboard/employee/EmployeeDashboard';

export default function DashboardScreen() {
  const user = useAuthStore(state => state.user);
  const userRole = user?.role || "MANAGER";

  if (userRole === "EMPLOYEE") {
    return <EmployeeDashboard />;
  }

  return <ManagerDashboard />;
}
