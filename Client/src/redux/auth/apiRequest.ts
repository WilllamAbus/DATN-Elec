import axios from "axios";
import { loginFailed, loginStart, loginSuccess } from "./authSlice";
import { AppDispatch } from "../../redux/store";

const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (
  user: {
    email: string; password: string;},
  dispatch: AppDispatch,
  navigate: (path: string) => void
) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${API_URL}/auth/login`, user);
    dispatch(loginSuccess(res.data));
    navigate("/");
  } catch (err: any) {
    dispatch(loginFailed());
  }
};
