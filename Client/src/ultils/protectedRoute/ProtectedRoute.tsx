import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "src/redux/rootReducer";


interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = "/login",
}) => {

  const isLoggedIn = useSelector((state: RootState) => state.auth.login.isLoggedIn);

  return isLoggedIn ? <Outlet /> : <Navigate to={redirectPath} />;
};

export default ProtectedRoute;
