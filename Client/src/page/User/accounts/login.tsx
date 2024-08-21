import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authGoogleService from "../../../services/authentication/authGoogle.service";

import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch } from "../../../redux/store";
import { loginUserThunk } from "../../../redux/auth/authThunk";

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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setLoading(true);
    setMessage(null);

    try {
      const resultAction = await dispatch(loginUserThunk(data)).unwrap();

      if (resultAction && "status" in resultAction) {
        if (resultAction.status === 200) {
          setMessage(resultAction.message);
          navigate("/profile");
        } else {
          setMessage(resultAction.message);
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
      <div className="contain py-16">
        <div className="max-w-lg mx-auto shadow px-6 py-7 rounded overflow-hidden">
          <h2 className="text-2xl uppercase font-medium mb-1">Đăng nhập</h2>
          <p className="text-gray-600 mb-6 text-sm">Chào mừng khách hàng quay trở lại</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-gray-600 mb-2 block">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="youremail@domain.com"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                {...register("email", {
                  required: "Email không được bỏ trống",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email không đúng định dạng",
                  },
                })}
              />
              {errors.email && <small className="text-red-600">{errors.email.message}</small>}
            </div>

            <div>
              <label htmlFor="password" className="text-gray-600 mb-2 block">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                placeholder="Nhập mật khẩu....."
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-primary placeholder-gray-400"
                {...register("password", {
                  required: "Mật khẩu không được bỏ trống",
                  minLength: {
                    value: 6,
                    message: "Mật khẩu phải có ít nhất 6 ký tự",
                  },
                })}
              />
              {errors.password && <small className="text-red-600">{errors.password.message}</small>}
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center"></div>
              <Link to="/forgot" className="text-primary">
                Quên mật khẩu
              </Link>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                disabled={loading}
                className="block w-full py-2 text-center bg-yellow-400 text-white bg-primary border border-primary rounded hover:bg-yellow-500 hover:text-primary transition uppercase font-roboto font-medium"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
              <div className="flex items-center justify-between mt-6">
                {loading && <div>Loading...</div>}
                {message && <div style={{ color: "red", marginTop: "10px" }}>{message}</div>}
              </div>
            </div>
          </form>

          <div className="mt-6 flex justify-center relative">
            <div className="text-gray-600 uppercase px-3 bg-white z-10 relative">Or</div>
            <div className="absolute left-0 top-3 w-full border-b-2 border-gray-200"></div>
          </div>

          <div className="mt-4 flex gap-4">
            <a className="w-1/2 py-2 text-center text-white bg-blue-800 rounded uppercase font-roboto font-medium text-sm hover:bg-blue-700">
              OTP
            </a>
            <button
              onClick={authGoogleService.loginWithGoogle}
              className="w-1/2 py-2 text-center text-white bg-red-600 rounded uppercase font-roboto font-medium text-sm hover:bg-red-500"
            >
              Google
            </button>
          </div>

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

export default Login;
