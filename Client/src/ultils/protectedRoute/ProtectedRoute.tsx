import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "src/redux/rootReducer";

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = "/login",
}) => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.login.isLoggedIn);
  
  const statusWarningTimeout = useSelector((state: RootState) => state.productClient.getUserCart.statusWarningTimeout);
  const statusAuction = useSelector((state: RootState) => state.productClient.getUserCart.statusAuction);
  const timeLimit = useSelector((state: RootState) => state.productClient.getUserCart.timeLimit);
  const isBanned = useSelector((state: RootState) => state.productClient.getUserCart.isBanned);
  
  const isDisabled = statusAuction === "disabled";
  const hasWarningTimeout = statusWarningTimeout === true;
  const isUserBanned = isBanned === true;
  const isWithinTimeLimit = timeLimit !== null && Number(timeLimit) > 0; 

  const shouldRedirect = isDisabled || hasWarningTimeout || isUserBanned || isWithinTimeLimit;
  
  const location = useLocation();
  const isOnProductAuction = location.pathname.startsWith("/product-auction");

  if (!isLoggedIn) {
    return <Navigate to={redirectPath} />;
  }

  if (shouldRedirect && isOnProductAuction) {
    return <Navigate to="/auction" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
