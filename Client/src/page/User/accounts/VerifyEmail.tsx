// VerifyEmail.tsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { verifyEmailThunk } from "../../../redux/auth/authThunk";

const VerifyEmail: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const { message, status, error } = useSelector(
    (state: RootState) => state.auth.EmailVerification
  );

  useEffect(() => {
    if (token) {
      dispatch(verifyEmailThunk(token));
    }
  }, [token, dispatch]);

  return (
    <div>
      <h1>Xác Thực Email</h1>
      {status === "loading" && <p>Đang xác thực...</p>}
      {status === "succeeded" && <p>{message}</p>}
      {status === "failed" && <p>{error}</p>}
    </div>
  );
};

export default VerifyEmail;
