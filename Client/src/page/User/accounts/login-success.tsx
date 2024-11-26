import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiLoginSuccessThunk } from "../../../redux/auth/apiLoginSuccessThunk";
import { AppDispatch, RootState } from "../../../redux/store";

const LoginSuccess = () => {
  const { userId, tokenLogin } = useParams<{
    userId?: string;
    tokenLogin?: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.login.isLoggedIn
  );
  const error = useSelector((state: RootState) => state.auth.login.error);
  const roles = useSelector((state: RootState) => state.auth.login.roles);

  useEffect(() => {
    if (userId && tokenLogin) {
      const loginSuccess = async () => {
        try {
          await dispatch(
            apiLoginSuccessThunk({ id: userId, token: tokenLogin })
          ).unwrap();
        } catch (error: any) {
          console.error("Lỗi khi đăng nhập:", error.message);
        }
      };
      loginSuccess();
    } else {
      navigate("/login-error");
    }
  }, [userId, tokenLogin, dispatch, navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      if (roles && roles.length > 0) {
        const isAdmin = roles.some((role) => role.name === "admin");
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        navigate("/login-error");
      }
    } else if (error) {
      navigate("/login-error");
    }
  }, [isLoggedIn, roles, error, navigate]);



  return (
    <div className="container mx-auto px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden my-20">
        <div className="flex justify-center items-center mt-8">
          <div
            className={`rounded-full h-40 w-40 flex items-center justify-center ${
              error ? "bg-red-100" : "bg-green-100"
            }`}
          >
            <i
              className={`text-6xl ${
                error ? "text-red-500" : "text-green-500"
              }`}
            >
              {error ? "✘" : "✓"}
            </i>
          </div>
        </div>
        <div className="text-center px-6 py-4">
          <h1
            className={`text-3xl font-bold ${
              error ? "text-red-900" : "text-green-900"
            }`}
          >
            {error ? "Lỗi" : "Thành Công"}
          </h1>
          <p className="text-gray-700 mt-2">
            {error
              ? `Đã xảy ra lỗi khi đăng nhập: ${error}`
              : "Bạn đã đăng nhập thành công tài khoản Google"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSuccess;
