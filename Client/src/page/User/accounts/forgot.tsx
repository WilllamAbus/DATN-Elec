import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { forgotPasswordThunk } from "../../../redux/auth/authThunk";

const Forgot: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(forgotPasswordThunk(email))
      .unwrap()
      .then((result) => setMessage(result))
      .catch((error) => setError(error.message || "An unknown error occurred"));
  };

  return (
    <>
      <div className="container mx-auto py-16">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Quên mật khẩu
            </h2>
            <p className="text-gray-600 mb-8">Welcome back, customer</p>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm text-gray-700 font-medium block mb-2"
                  >
                    Địa chỉ Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full border-gray-300 px-4 py-3 rounded-lg text-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 placeholder-gray-400"
                    placeholder="youremail@domain.com"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="block w-full py-3 text-white bg-primary border border-primary rounded-lg hover:bg-transparent hover:text-primary transition duration-200 ease-in-out font-semibold uppercase"
                >
                  Gửi email
                </button>
                {message && <p className="text-green-600 mt-4">{message}</p>}
                {error && <p className="text-red-600 mt-4">{error}</p>}
              </div>
            </form>
            <p className="mt-8 text-center text-gray-600 text-sm">
              Bạn chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-primary font-medium hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Forgot;
