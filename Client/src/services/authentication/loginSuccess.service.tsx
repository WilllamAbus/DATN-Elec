import axios from "axios";
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
    const res = await axios.post(`${API_URL}/auth/login-success`, {
      id,
      tokenLogin: token,
    });
    const { token: accessToken } = res.data;

    // Lưu token vào local storage
    window.localStorage.setItem(
      "persist:root",
      JSON.stringify({
        login: {
          currentUser: {
            accessToken,
          },
        },
      })
    );

    dispatch(loginSuccess(res.data));

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
