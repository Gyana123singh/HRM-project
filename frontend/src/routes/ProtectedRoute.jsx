import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const RoleBasedRoute = ({ allowedRole }) => {
  const { role } = useAuthStore();

  if (role !== allowedRole) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};
