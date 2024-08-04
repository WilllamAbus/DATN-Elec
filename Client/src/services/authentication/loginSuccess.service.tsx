import instance from "../axios";
import {
  loginFailed,
  loginStart,
  loginSuccess,
} from "../../redux/auth/authSlice";
import { AppDispatch } from "../../redux/store";

const API_URL = import.meta.env.VITE_API_URL;

export const apiLoginSuccess = async (
  id: string,
  token: string,
  dispatch: AppDispatch,
  navigate: (path: string) => void
) => {
  dispatch(loginStart());
  try {
    const res = await instance.post(`${API_URL}/auth/login-success`, {
      id,
      tokenLogin: token,
    });

    // Dispatch the success action with the response data
    dispatch(loginSuccess(res.data));

    // Navigate to the desired path after a short delay
    setTimeout(() => {
      navigate("/");
    }, 3000);
  } catch (err: any) {
    console.error(
      "Lỗi trong apiLoginSuccess:",
      err.response?.data || err.message
    );
    dispatch(loginFailed());
    navigate("/login-error");
  }
};
