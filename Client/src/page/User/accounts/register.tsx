import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch } from "../../../redux/store";
import { registerUserThunk } from "../../../redux/auth/authThunk";

interface FormValues {
  email: string;
  password: string;
  name: string;
  confirm: string;
}

const Register: React.FC = () => {
  const { register, handleSubmit, getValues, formState } =
    useForm<FormValues>();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleRegister: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    setMessage(null);

    try {
      const resultAction = await dispatch(
        registerUserThunk({
          email: data.email,
          password: data.password,
          name: data.name,
        })
      );

      if (registerUserThunk.fulfilled.match(resultAction)) {
        const { message } = resultAction.payload as {
          status: number;
          message: string;
        };
        setMessage(message || "Đăng ký thành công.");
      } else {
        setMessage(
          (resultAction.payload as string) || "Đã xảy ra lỗi khi đăng ký."
        );
      }
    } catch (error) {
      setMessage("Đã xảy ra lỗi khi đăng ký.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="py-20 bg-gray-100">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Đăng Ký</h2>
            <p className="text-gray-600 mb-6 text-sm">
              Chào mừng bạn đến với chúng tôi! Đăng ký để bắt đầu.
            </p>

            <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
              <div>
                <label htmlFor="name" className="text-gray-600 mb-2 block">
                  Họ Tên
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Nhập họ tên của bạn"
                  className="block w-full border border-gray-300 px-4 py-3 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400"
                  {...register("name", {
                    required: "Tên không được bỏ trống",
                  })}
                />
                {formState.errors.name && (
                  <small className="text-red-600">
                    {formState.errors.name.message}
                  </small>
                )}
              </div>

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
                {formState.errors.email && (
                  <small className="text-red-600">
                    {formState.errors.email.message}
                  </small>
                )}
              </div>

              <div>
                <label htmlFor="password" className="text-gray-600 mb-2 block">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Nhập mật khẩu..."
                  className="block w-full border border-gray-300 px-4 py-3 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400"
                  {...register("password", {
                    required: "Mật khẩu không được bỏ trống",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu ít nhất có 6 ký tự",
                    },
                  })}
                />
                {formState.errors.password && (
                  <small className="text-red-600">
                    {formState.errors.password.message}
                  </small>
                )}
              </div>

              <div>
                <label htmlFor="confirm" className="text-gray-600 mb-2 block">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  id="confirm"
                  placeholder="Xác nhận mật khẩu..."
                  className="block w-full border border-gray-300 px-4 py-3 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400"
                  {...register("confirm", {
                    required: "Xác nhận mật khẩu không được bỏ trống",
                    validate: (confirm) => {
                      const password = getValues("password");
                      return (
                        confirm === password ||
                        "Mật khẩu và xác nhận không trùng nhau"
                      );
                    },
                  })}
                />
                {formState.errors.confirm && (
                  <small className="text-red-600">
                    {formState.errors.confirm.message}
                  </small>
                )}
              </div>

              <div className="flex items-center justify-between mt-6">
                {loading && <div>Đang xử lý...</div>}
                {message && <div className="text-red-600 mt-4">{message}</div>}
              </div>

              <button
                type="submit"
                className="w-full py-2 text-center bg-yellow-400 text-white border border-yellow-400 rounded-lg hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-500 transition duration-200"
              >
                ĐĂNG KÝ
              </button>
            </form>

            <div className="mt-6 relative">
              <div className="text-gray-600 uppercase px-3 bg-white relative z-10 text-center">
                Hoặc
              </div>
              <div className="absolute inset-x-0 top-1/2 border-b-2 border-gray-200" />
            </div>

            <div className="mt-4 flex gap-4">
              <a
                href="/regisOTP"
                className="w-1/2 py-2 text-center text-white bg-blue-800 rounded-lg uppercase font-medium text-sm hover:bg-blue-700"
              >
                OTP
              </a>
              <a
                href="#"
                className="w-1/2 py-2 text-center text-white bg-red-600 rounded-lg uppercase font-medium text-sm hover:bg-red-500"
              >
                Google
              </a>
            </div>

            <p className="mt-4 text-center text-gray-600">
              Bạn đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
