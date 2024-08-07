// page/User/accounts/VerifyEmail.tsx
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { verifyEmail } from "../../../redux/auth/authThunk";
import { useLocation } from "react-router-dom";

const VerifyEmailPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { message, error, status } = useAppSelector(
    (state) => state.auth.EmailVerification
  );

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token));
    }
  }, [dispatch, token]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;
  if (status === "succeeded" && message) return <p>{message}</p>;

  return <p>No data available</p>;
};

export default VerifyEmailPage;
