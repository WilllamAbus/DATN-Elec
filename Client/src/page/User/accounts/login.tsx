
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authGoogleService from "../../../services/authentication/authGoogle.service";

import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { loginUserThunk } from "../../../redux/auth/authThunk";
import { useCookies } from "react-cookie";
interface IFormInput {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.auth);
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  useEffect(() => {
    if (status === "failed" && error) {
      setMessage(error);
    }
  }, [status, error]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      navigate("/profile");
    }
  }, [token, navigate]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoading(true);
    setMessage(null);

    try {
      const resultAction = await dispatch(loginUserThunk(data)).unwrap();

      if (resultAction) {
        setMessage(resultAction.message || "Đăng nhập thành công!");
        if (resultAction.status === 200) {
          window.location.href = "/";
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message || "Đã xảy ra lỗi khi đăng nhập.");
      } else {
        setMessage("Đã xảy ra lỗi khi đăng nhập.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="py-16 bg-gray-100">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Đăng Nhập</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Chào mừng bạn trở lại! Đăng nhập để tiếp tục.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="text-gray-600 mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="youremail@domain.com"
                  className="block w-full border border-gray-300 px-4 py-3 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400"
                  {...register("email", {
                    required: "Email không được bỏ trống",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Email không đúng định dạng",
                    },
                  })}
                />
                {errors.email && (
                  <small className="text-red-600">{errors.email.message}</small>
                )}
              </div>

              <div>
                <label htmlFor="password" className="text-gray-600 mb-2 block">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Nhập mật khẩu....."
                  className="block w-full border border-gray-300 px-4 py-3 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400"
                  {...register("password", {
                    required: "Mật khẩu không được bỏ trống",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự",
                    },
                  })}
                />
                {errors.password && (
                  <small className="text-red-600">
                    {errors.password.message}
                  </small>
                )}
              </div>

              <div className="flex items-center justify-between mt-6">
                <Link to="/forgot" className="text-primary hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 text-center bg-yellow-400 text-white border border-yellow-400 rounded-lg hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-500 transition duration-200"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

              {message && (
                <div className="text-red-600 text-center mt-4">{message}</div>
              )}
            </form>

            <div className="mt-6 relative">
              <div className="text-gray-600 uppercase px-3 bg-white relative z-10 text-center">
                Hoặc
              </div>
              <div className="absolute inset-x-0 top-1/2 border-b-2 border-gray-200" />
            </div>

            <div className="mt-4 flex gap-4">
              <a
                className="w-1/2 py-2 text-center text-white bg-blue-800 rounded-lg uppercase font-medium text-sm hover:bg-blue-700"
                href="#"
              >
                OTP
              </a>
              <button
                onClick={authGoogleService.loginWithGoogle}
                className="w-1/2 py-2 text-center text-white bg-red-600 rounded-lg uppercase font-medium text-sm hover:bg-red-500"
              >
                Đăng nhập với Google
              </button>
            </div>

            <p className="mt-4 text-center text-gray-600">
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

export default Login;
