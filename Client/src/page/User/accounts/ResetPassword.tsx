import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import UserHeader from "../../../components/User/header";
import UserNav from "../../../components/User/navbar";
import UserFooter from "../../../components/User/footer";
import UserCoppyright from "../../../components/User/copyright";
import "../../../assets/css/user.style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { AppDispatch } from "../../../redux/store";
import { resetPasswordThunk } from "../../../redux/auth/authThunk";
import { useDispatch } from "react-redux";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu không trùng khớp.");
      return;
    }
    if (token) {
      dispatch(resetPasswordThunk({ token, password }))
        .unwrap()
        .then((result) => setMessage(result))
        .catch((error) => setError(error.message));
    }
  };

  return (
    <>
      <UserHeader />
      <UserNav />

      <div className="contain py-16">
        <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
          <h2 className="text-2xl uppercase font-medium mb-1">Quên mật khẩu</h2>
          <p className="text-gray-600 mb-6 text-sm">Welcome back customer</p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div>
                <label htmlFor="password" className="text-gray-600 mb-2 block">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                  placeholder="youremail@domain.com"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-gray-600 mb-2 block"
                >
                  Xác nhận lại mật khẩu
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                  placeholder="youremail@domain.com"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="block w-full py-2 text-center text-white bg-primary border border-primary rounded hover:bg-transparent hover:text-primary transition uppercase font-roboto font-medium"
              >
                XÁC NHẬN
              </button>
              {message && <p className="text-green-600 mt-2">{message}</p>}
              {error && <p className="text-red-600 mt-2">{error}</p>}
            </div>
          </form>
        </div>
      </div>
      {/* 
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Reset Password
          </button>
          {message && <p className="text-green-500 mt-4">{message}</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </div> */}

      <UserFooter />
      <UserCoppyright />
    </>
  );
};

export default ResetPassword;
