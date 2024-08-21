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

      <div className="contain py-16">
        <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
          <h2 className="text-2xl uppercase font-medium mb-1">Quên mật khẩu</h2>
          <p className="text-gray-600 mb-6 text-sm">Welcome back customer</p>
          <form onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div>
                <label htmlFor="email" className="text-gray-600 mb-2 block">
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                Gửi email
              </button>
              {message && <p className="text-green-600 mt-2">{message}</p>}
              {error && <p className="text-red-600 mt-2">{error}</p>}
            </div>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Bạn chưa có tài khoản?{" "}
            <Link to="/register" className="text-primary">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>

    </>
  );
};

export default Forgot;
