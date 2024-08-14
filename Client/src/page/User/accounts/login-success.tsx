import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "../../../assets/css/user.style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { apiLoginSuccessThunk } from "../../../redux/auth/apiLoginSuccessThunk";
import { AppDispatch, RootState } from "../../../redux/store";

const LoginSuccess = () => {
  const { userId, tokenLogin } = useParams<{ userId?: string; tokenLogin?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const roles = useSelector((state: RootState) => state.auth.login.roles);
  const isLoggedIn = useSelector((state: RootState) => state.auth.login.isLoggedIn);

  useEffect(() => {
    if (userId && tokenLogin) {
      const loginSuccess = async () => {
        try {
          await dispatch(apiLoginSuccessThunk({ id: userId, token: tokenLogin })).unwrap();
        } catch (error: any) {
          console.error("Lỗi khi đăng nhập:", error.message);
          navigate("/login-error");
        }
      };
      loginSuccess();
    } else {
      navigate("/login-error");
    }
  }, [userId, tokenLogin, dispatch, navigate]);

  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        if (roles && roles.length > 0) {
          const isAdmin = roles.some((role) => role.name === "admin");
          if (isAdmin) {
            navigate("/admin/listProducts");
          } else {
            navigate("/");
          }
        } else {
          navigate("/login-error");
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, roles, navigate]);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,700,900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <div className="container mx-auto px-4">
        <div className="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden my-20">
          <div className="flex justify-center items-center mt-8">
            <div className="rounded-full bg-gray-200 h-40 w-40 flex items-center justify-center">
              <i className="text-6xl text-green-500">✓</i>
            </div>
          </div>
          <div className="text-center px-6 py-4">
            <h1 className="font-bold text-3xl text-gray-900">Success</h1>
            <p className="text-gray-700 mt-2">Bạn đã đăng nhập thành công tài khoản Google</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSuccess;
