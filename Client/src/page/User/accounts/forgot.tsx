import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { forgotPasswordThunk } from "../../../redux/auth/authThunk";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Forgot: React.FC = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.dismiss();

    try {
      const resultAction = await dispatch(forgotPasswordThunk(email));

      if (forgotPasswordThunk.fulfilled.match(resultAction)) {
        const { status, message } = resultAction.payload as {
          status: number;
          message: string;
        };

        if (status === 200) {
          toast.success(message || "Đã gửi email đặt lại mật khẩu.");
        } else {
          toast.error(message || "Đã xảy ra lỗi khi gửi email.");
        }
      } else if (forgotPasswordThunk.rejected.match(resultAction)) {
        const { message } = resultAction.payload as {
          status: number;
          message: string;
        };
        toast.error(message || "Đã xảy ra lỗi khi gửi email.");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="py-60  bg-gray-100">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-8 py-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Quên mật khẩu
            </h2>
            <p className="text-gray-600 mb-8">
              Vui lòng nhập email của bạn để nhận đường dẫn đặt lại mật khẩu.
            </p>

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
                  className={`items-center justify-center block w-full py-3 text-white bg-orange-500 border border-orange-500 rounded-lg hover:bg-transparent hover:text-orange-500 transition duration-200 ease-in-out font-semibold uppercase ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading} // Vô hiệu hóa nút khi loading
                >
                  {isLoading && (
                    <svg
                      className="w-5 h-5 mr-2 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  )}
                  {isLoading ? "Đang yêu cầu..." : "Khôi phục"}
                </button>
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
      <ToastContainer />
    </>
  );
};

export default Forgot;
