import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { verifyEmailThunk } from "../../../redux/auth/authThunk";

const VerifyEmail: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (status === "succeeded") {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [status, navigate]);

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Xác Thực Email
          </h1>
          {status === "loading" && (
            <p className="text-blue-500">Đang xác thực...</p>
          )}
          {status === "succeeded" && (
            <p className="text-green-500">{message}</p>
          )}
          {status === "failed" && (
            <p className="text-red-500">{error || "Có lỗi xảy ra"}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
