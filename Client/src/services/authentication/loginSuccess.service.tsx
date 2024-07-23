import axios from "axios";
import { loginFailed, loginStart, loginSuccess } from "../../redux/auth/authSlice";
import  {AppDispatch}  from "../../redux/store";

const API_URL = import.meta.env.VITE_API_URL;

export const apiLoginSuccess = async (token: string, dispatch: AppDispatch , navigate: (path: string) => void) => {
    dispatch(loginStart());
    try {
        // Gửi token đến backend để xác thực và lấy thông tin người dùng
        const res = await axios.post(`${API_URL}/auth/google/callback`, { token });
        dispatch(loginSuccess(res.data));
        navigate("/");
    } catch (err: any) {
        dispatch(loginFailed());
    }
};
